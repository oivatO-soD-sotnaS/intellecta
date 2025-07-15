<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\InstitutionDao;
use App\Dao\InstitutionUserDao;
use App\Dao\InvitationDao;
use App\Dao\UserDao;
use App\Dto\InstitutionDto;
use App\Dto\InstitutionUserDto;
use App\Dto\InvitationDto;
use App\Dto\UserDto;
use App\Models\InstitutionUser;
use App\Models\Invitation;
use App\Services\LogService;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class InvitationsController extends BaseController {
    public function __construct(
        private InvitationDao $invitationDao,
        private InstitutionUserDao $institutionUserDao,
        private UserDao $userDao,
        private FilesDao $filesDao,
        private InstitutionDao $institutionDao
    ){}

    public function acceptInvitation(Request $request, Response $response, string $invitation_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $invitation_id) {
            $invitation = $this->invitationDao->getInvitationById($invitation_id);
            if(empty($invitation)) {
                throw new HttpNotFoundException($request, "There is no invitation with the given ID: {$invitation_id}");
            }
            $token = $request->getAttribute('token');
            $user = $this->userDao->getById($token['sub']);

            if($invitation->getEmail() !== $user->getEmail()) {
                LogService::http403("/invitation/{$invitation_id}/accept", "User {$user->getEmail()} tried using invitation for {$invitation->getEmail()}");
                throw new HttpForbiddenException($request, "You cannot use this invitation. See logs for more detail.");
            }
            if($invitation->isExpired() || $invitation->isAccepted()) {
                throw new HttpForbiddenException($request, "Invitation already accepted or expired.");
            }

            $timestamp = date('Y-m-d H:i:s');
            $invitation->setAcceptedAt($timestamp);
            $invitation = $this->invitationDao->updateInvitation($invitation);

            if(empty($invitation)) {
                LogService::http500("/invitation/{$invitation_id}/accept", "Could not accept invitation due to an unknown error.");
                throw new HttpInternalServerErrorException($request, "Could not accept invitation due to an unknown error.");
            }

            $institutionUser = $this->institutionUserDao->createInstitutionUser(new InstitutionUser([
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
            $invitation = $this->invitationDao->getInvitationById($invitation_id);
            if(empty($invitation)) {
                throw new HttpNotFoundException($request, "There is no invitation with the given ID: {$invitation_id}");
            }
            $token = $request->getAttribute('token');

            if($invitation->getEmail() !== $token['email']) {
                LogService::http403("/invitation/{$invitation_id}", "User {$token['email']} tried fetching invitation for {$invitation->getEmail()}");
                throw new HttpForbiddenException($request, "You cannot fetch this invitation. See logs for more detail.");
            }

            $institution = $this->institutionDao->getInstitutionById($invitation->getInstitutionId());
            if(!empty($institution->getProfilePictureId())) {
                $institutionProfilePicture = $this->filesDao->getFileById($institution->getProfilePictureId());
            }
            if(!empty($institution->getBannerId())) {
                $institutionBanner = $this->filesDao->getFileById($institution->getBannerId());
            }

            $institutionDto = new InstitutionDto($institution, $institutionBanner, $institutionProfilePicture);

            $invitedBy = $this->userDao->getById($invitation->getInvitedBy());
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
            $invitations = $this->invitationDao->getAllUserInvitations($token['email']);
            
            $invitationDtos = array_map(function(Invitation $invitation) {
                $institution = $this->institutionDao->getInstitutionById($invitation->getInstitutionId());
                if(!empty($institution->getProfilePictureId())) {
                    $institutionProfilePicture = $this->filesDao->getFileById($institution->getProfilePictureId());
                }
                if(!empty($institution->getBannerId())) {
                    $institutionBanner = $this->filesDao->getFileById($institution->getBannerId());
                }

                $institutionDto = new InstitutionDto($institution, $institutionBanner, $institutionProfilePicture);

                $invitedBy = $this->userDao->getById($invitation->getInvitedBy());
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