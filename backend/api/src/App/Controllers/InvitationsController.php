<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\InstitutionsDao;
use App\Dao\InstitutionUsersDao;
use App\Dao\InvitationsDao;
use App\Dao\UsersDao;
use App\Dto\InstitutionDto;
use App\Dto\InstitutionUserDto;
use App\Dto\InvitationDto;
use App\Dto\UserDto;
use App\Models\InstitutionUser;
use App\Models\Invitation;
use App\Services\LogService;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
readonly class InvitationsController extends BaseController {
    public function __construct(
        private InvitationsDao $invitationsDao,
        private InstitutionUsersDao $institutionUsersDao,
        private UsersDao $usersDao,
        private FilesDao $filesDao,
        private InstitutionsDao $institutionsDao
    ){}

    public function acceptInvitation(Request $request, Response $response, string $invitation_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $invitation_id) {
            $invitation = $this->invitationsDao->getInvitationById($invitation_id);
            if(empty($invitation)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }
            $token = $request->getAttribute('token');
            $user = $this->usersDao->getUserBydId($token['sub']);

            if($invitation->getEmail() !== $user->getEmail()) {
                LogService::http403("/invitation/{$invitation_id}/accept", "User {$user->getEmail()} tried using invitation for {$invitation->getEmail()}");
                throw new HttpForbiddenException($request, LogService::HTTP_403);
            }
            if($invitation->isExpired() || $invitation->isAccepted()) {
                throw new HttpException($request, LogService::HTTP_422 . "Invitation already accepted or expired.", 422);
            }

            $timestamp = date('Y-m-d H:i:s');
            $invitation->setAcceptedAt($timestamp);
            $invitation = $this->invitationsDao->updateInvitation($invitation);

            if(empty($invitation)) {
                LogService::http500("/invitation/{$invitation_id}/accept", "Could not accept invitation due to an unknown error.");
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $institutionUser = $this->institutionUsersDao->createInstitutionUser(new InstitutionUser([
                "institution_user_id" => Uuid::uuid4()->toString(),
                "role" => $invitation->getRole(),
                "joined_at" => $timestamp,
                "institution_id" => $invitation->getInstitutionId(),
                "user_id" => $user->getUserId()
            ]));

             if(!empty($user->getProfilePictureId())) {
                $profilePicture = $this->filesDao->getFileById($user->getProfilePictureId());
            }

            $userDto = new UserDto($user, $profilePicture);
            $institutionUserDto = new InstitutionUserDto($institutionUser, $userDto);

            $response->getBody()->write(json_encode($institutionUserDto));
            return $response;
        });
    }

    public function getInvitation(Request $request, Response $response, string $invitation_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $invitation_id) {
            $invitation = $this->invitationsDao->getInvitationById($invitation_id);
            if(empty($invitation)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }
            $token = $request->getAttribute('token');

            if($invitation->getEmail() !== $token['email']) {
                LogService::http403("/invitation/{$invitation_id}", "User {$token['email']} tried fetching invitation for {$invitation->getEmail()}");
                throw new HttpForbiddenException($request, LogService::HTTP_403);
            }

            $institution = $this->institutionsDao->getInstitutionById($invitation->getInstitutionId());
            if(!empty($institution->getProfilePictureId())) {
                $institutionProfilePicture = $this->filesDao->getFileById($institution->getProfilePictureId());
            }
            if(!empty($institution->getBannerId())) {
                $institutionBanner = $this->filesDao->getFileById($institution->getBannerId());
            }

            $institutionDto = new InstitutionDto($institution, $institutionBanner, $institutionProfilePicture);

            $invitedBy = $this->usersDao->getUserBydId($invitation->getInvitedBy());
            if(!empty($invitedBy->getProfilePictureId())) {
                $invitedByProfilePicture = $this->filesDao->getFileById($invitedBy->getProfilePictureId());
            }
            $invitedByDto = new UserDto($invitedBy, $invitedByProfilePicture);

            $invitationDto = new InvitationDto($invitation, $institutionDto, $invitedByDto);

            $response->getBody()->write(json_encode($invitationDto));

            return $response;
        });
    }

    public function getAllInvitations(Request $request, Response $response): Response {
        return $this->handleErrors($request, function() use ($request, $response) {
            $token = $request->getAttribute('token');
            $invitations = $this->invitationsDao->getAllUserInvitations($token['email']);
            
            if(count($invitations) === 0){
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }
            $invitationDtos = array_map(function(Invitation $invitation) {
                $institution = $this->institutionsDao->getInstitutionById($invitation->getInstitutionId());
                if(!empty($institution->getProfilePictureId())) {
                    $institutionProfilePicture = $this->filesDao->getFileById($institution->getProfilePictureId());
                }
                if(!empty($institution->getBannerId())) {
                    $institutionBanner = $this->filesDao->getFileById($institution->getBannerId());
                }

                $institutionDto = new InstitutionDto($institution, $institutionBanner, $institutionProfilePicture);

                $invitedBy = $this->usersDao->getUserBydId($invitation->getInvitedBy());
                if(!empty($invitedBy->getProfilePictureId())) {
                    $invitedByProfilePicture = $this->filesDao->getFileById($invitedBy->getProfilePictureId());
                }
                $invitedByDto = new UserDto($invitedBy, $invitedByProfilePicture);

                return new InvitationDto($invitation, $institutionDto, $invitedByDto);
            }, $invitations);
            
            $response->getBody()->write(json_encode($invitationDtos));

            return $response;
        });
    }
}