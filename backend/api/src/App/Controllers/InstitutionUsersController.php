<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\InstitutionDao;
use App\Dao\InstitutionUserDao;
use App\Dao\InvitationDao;
use App\Dao\UserDao;
use App\Dto\InstitutionUserDto;
use App\Dto\UserDto;
use App\Enums\InstitutionUserType;
use App\Models\InstitutionUser;
use App\Models\Invitation;
use App\Queue\RedisEmailQueue;
use App\Services\EmailService;
use App\Services\LogService;
use App\Services\ValidatorService;
use App\Vo\InvitationVo;
use InvalidArgumentException;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
readonly class InstitutionUsersController extends BaseController
{
  public function __construct(
    private InstitutionUserDao $institutionUserDao,
    private InstitutionDao $institutionDao,
    private InvitationDao $invitationDao,
    private UserDao $userDao,
    private FilesDao $filesDao,
    private EmailService $emailService,
    private ValidatorService $validatorService,
    private RedisEmailQueue $emailQueue
  ) {}

  public function getInstitutionUsers(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $institutionUsers = $this->institutionUserDao->getUsersByInstitutionId($institution_id);

      if(count($institutionUsers) === 0) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);        
      }

      $institutionUsersDto = array_map(function(InstitutionUser $institutionUser) {
        $user = $this->userDao->getById($institutionUser->getUserId());
        $profilePicture = !empty($user->getProfilePictureId())
          ? $this->filesDao->getFileById($user->getProfilePictureId())
          : null;

        $userDto = new UserDto($user, $profilePicture);
        return new InstitutionUserDto($institutionUser, $userDto);
      }, $institutionUsers);

      $response->getBody()->write(json_encode($institutionUsersDto));
      return $response;
    });
  }

  public function inviteUsers(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $body = $request->getParsedBody();
      $this->validatorService->validateRequired($body, ['invites']);

      $invites = $body['invites'];

      if (!is_array($invites)) {
        throw new InvalidArgumentException("'invites' must be an array");
      }

      $invitesVo = array_map(fn($inviteEmail) => new InvitationVo($inviteEmail), $invites);
      $token = $request->getAttribute('token');
      $institution = $this->institutionDao->getInstitutionById($institution_id);

      $invitations = array_map(function(InvitationVo $invite) use ($institution, $token) {
        $invitation = $this->invitationDao->createInvitation(new Invitation([
          'invitation_id' => Uuid::uuid4()->toString(),
          'email' => $invite->getEmail(),
          'role' => $invite->getRole()->value,
          'expires_at' => date('Y-m-d H:i:s', strtotime('+7 days')),
          'accepted_at' => null,
          'created_at' => date('Y-m-d H:i:s'),
          'institution_id' => $institution->getInstitutionId(),
          'invited_by' => $token['sub']
        ]));
        LogService::info("/institutions/{$institution->getInstitutionId()}/users/invite", "{$token['sub']} invited {$invite->getEmail()} to {$institution->getName()}");

        if ($invitation) {
          $this->emailQueue->push([
            'to' => $invite->getEmail(),
            'toName' => $invite->getEmail(),
            'subject' => 'Você foi convidado para se juntar a uma instituição no Intellecta',
            'body' => $this->emailService->getInstitutionInvitationEmailTemplate(
              institutionName: $institution->getName(),
              acceptLink: "http://localhost:3000/invitation/accept?token={$invitation->getInvitationId()}",
            ),
          ]);
        }

        return $invitation;
      }, $invitesVo);

      $invitesCount = count($invitations);
      LogService::info("/institutions/{$institution_id}/users/invite", "{$token['sub']} invited {$invitesCount} users to {$institution->getName()}");
      $response->getBody()->write(json_encode(array_filter($invitations)));
      
      return $response;
    });
  }

  public function changeUserRole(Request $request, Response $response, string $institution_id, string $institution_user_id): Response {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id, $institution_user_id) {
      $token = $request->getAttribute("token");
      
      $body = $request->getParsedBody();
      $this->validatorService->validateRequired($body, ['new_role']);
      
      $newRole = InstitutionUserType::tryFrom($body['new_role']);
      if(empty($newRole)) {
        throw new InvalidArgumentException("Only 'admin', 'teacher' and 'student' are allowed as roles");
      }

      $institutionUser = $this->institutionUserDao->getInstitutionUserById($institution_user_id);
      if(empty($institutionUser)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }
      if($institutionUser->getInstitutionId() !== $institution_id) {
        throw new HttpForbiddenException($request, LogService::HTTP_403);
      }

      $institutionUser->setRole($newRole);      
      $institutionUser = $this->institutionUserDao->updateInstitutionUserRole($institutionUser);
      if(empty($institutionUser)) {
        throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
      }

      $user = $this->userDao->getById($institutionUser->getUserId());
      $profilePicture = !empty($user->getProfilePictureId())
        ? $this->filesDao->getFileById($user->getProfilePictureId())
        : null;

      $userDto = new UserDto($user, $profilePicture);
      $institutionUserDto = new InstitutionUserDto($institutionUser, $userDto);
      $response->getBody()->write(json_encode($institutionUserDto));

      LogService::info("/institutions/{$institution_id}/users/{$institution_user_id}/change-role", "{$token["email"]} changed {$user->getFullName()} role to {$newRole->value}");
      return $response;
    });
  }
  
  public function removeUser(Request $request, Response $response, string $institution_id, string $institution_user_id): Response {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id, $institution_user_id) {
      /** @var InstitutionUser $membership */
      $membership = $request->getAttribute('membership');
      $token = $request->getAttribute('token');

      $institutionUser = $this->institutionUserDao->getInstitutionUserById($institution_user_id);
      
      if(
        empty($institutionUser)
        || $institutionUser->getInstitutionId() !== $institution_id
      ) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      if(
        $membership->getRole() !== InstitutionUserType::Admin->value
        && $institutionUser->getUserId() !== $token['sub']
      ) {
        throw new HttpForbiddenException($request, LogService::HTTP_403 . 'Only admins and the user itself can access this endpoint');
      }

      $this->institutionUserDao->deleteInstitutionUser($institutionUser);

      $response->getBody()->write(json_encode([
        "message" => "User removed from institution successfully"
      ]));

      return $response;
    });
  }
}