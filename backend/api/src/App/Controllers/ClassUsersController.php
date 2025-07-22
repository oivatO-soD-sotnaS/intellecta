<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\ClassUsersDao;
use App\Dao\FilesDao;
use App\Dao\InstitutionUserDao;
use App\Dao\UserDao;
use App\Dto\ClassUserDto;
use App\Dto\UserDto;
use App\Models\ClassUser;
use App\Models\InstitutionUser;
use App\Services\LogService;
use App\Services\ValidatorService;
use InvalidArgumentException;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
class ClassUsersController extends BaseController {
    public function __construct(
        private ClassUsersDao $classUsersDao,
        private InstitutionUserDao $institutionUserDao,
        private UserDao $userDao,
        private ValidatorService $validatorService,
        private FilesDao $filesDao,
    ) {}
        
    public function getClassUsers(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($response, $class_id) {
            $classUsers = $this->classUsersDao->getClassUsersByClassId($class_id);

            $classUsersDtos = array_map(function(ClassUser $classUser) {
                $user = $this->userDao->getById($classUser->getUserId());
                
                $profilePicture = $user->getProfilePictureId()
                    ? $this->filesDao->getFileById($user->getProfilePictureId())
                    : null;
                
                $userDto = new UserDto($user, $profilePicture);

                return new ClassUserDto($classUser, $userDto);
            }, $classUsers);

            $response->getBody()->write(json_encode($classUsersDtos));
            
            return $response;
        });
    }

    public function createClassUsers(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($response, $request, $institution_id, $class_id) {
            $token = $request->getAttribute('token');
            $body = $request->getParsedBody();

            $this->validatorService->validateRequired($body, ['user_ids']);

            /** @var string[] $userIds */
            $userIds = $body["user_ids"];
            if (!is_array($userIds)) {
                throw new InvalidArgumentException("user_ids must be an array of strings.");
            }

            $classUsers = $this->classUsersDao->getClassUsersByClassId($class_id);
            $institutionUsers = $this->institutionUserDao->getUsersByInstitutionId($institution_id);

            $classUsersMap = array_flip(array_map(fn(ClassUser $u) => $u->getUserId(), $classUsers));
            $institutionUsersMap = array_flip(array_map(fn(InstitutionUser $u) => $u->getUserId(), $institutionUsers));

            $timestamp = date("Y-m-d H:i:s");
            $toInsert = [];
            $added = [];

            foreach ($userIds as $userId) {
                if (isset($classUsersMap[$userId])) continue;
                if (!isset($institutionUsersMap[$userId])) continue;

                $toInsert[] = new ClassUser([
                    "class_users_id" => Uuid::uuid4()->toString(),
                    "joined_at" => $timestamp,
                    "class_id" => $class_id,
                    "user_id" => $userId,
                ]);

                $added[] = $userId;
            }

            if (!empty($toInsert)) {
                $this->classUsersDao->createMultipleClassUsers($toInsert);
            }

            $response->getBody()->write(json_encode([
                "message" => "All users added successfully!"
            ]));

            $userList = implode(",", $added);
            
            LogService::info("/institutions/{$institution_id}/classes/{$class_id}/users", "{$token['email']} added {$userList} to the class {$class_id}");
            return $response;
        });
    }

    public function getClassUserById(Request $request, Response $response, string $institution_id, string $class_id, string $class_user_id): Response {
        return $this->handleErrors($request, function() use ($response, $request, $institution_id, $class_id, $class_user_id) {
            $classUser = $this->classUsersDao->getClassUserByClassUserIdAndClassId($class_user_id, $class_id);
        
            if(empty($classUser)) {
                throw new HttpNotFoundException($request, "Could not find user {$class_user_id} in this class");
            }

            $user = $this->userDao->getById($classUser->getUserId());
            $profilePicture = $user->getProfilePictureId()
                ? $this->filesDao->getFileById($user->getProfilePictureId())
                : null;

            $userDto = new UserDto($user, $profilePicture);

            $classUserDto = new ClassUserDto($classUser, $userDto);

            $response->getBody()->write(json_encode($classUserDto));

            return $response;
        });
    }
    public function removeClassUser(Request $request, Response $response, string $institution_id, string $class_id, string $class_user_id): Response {
        return $this->handleErrors($request, function() use ($response, $request, $institution_id, $class_id, $class_user_id) {
            $token = $request->getAttribute('token');

            $classUser = $this->classUsersDao->getClassUserByClassUserIdAndClassId($class_user_id, $class_id);
        
            if(empty($classUser)) {
                throw new HttpNotFoundException($request, "Could not find user {$class_user_id} in this class");
            }

            $success = $this->classUsersDao->deleteClassUser($classUser);
            if(!$success) {

            }

            $response->getBody()->write(json_encode([
                "message" => "User deleted successfully!"
            ]));

            LogService::info("/institutions/{$institution_id}/classes/{$class_id}/users/{$class_user_id}", message: "{$token['email']} removed the user {$class_user_id} from the class {$class_id}");
            return $response;
        });
    }
}