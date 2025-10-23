<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\InstitutionsDao;
use App\Dao\InstitutionUsersDao;
use App\Dto\InstitutionDto;
use App\Dto\InstitutionSummaryDto;
use App\Enums\FileType;
use App\Enums\InstitutionUserType;
use App\Models\File;
use App\Models\Institution;
use App\Models\InstitutionSummary;
use App\Models\InstitutionUser;
use App\Models\User;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\InstitutionDescriptionVo;
use App\Vo\InstitutionNameVo;
use App\Vo\ProfileAssetVo;
use App\Vo\UuidV4Vo;
use InvalidArgumentException;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
readonly class InstitutionsController extends BaseController
{
  public function __construct(
    private InstitutionsDao $institutionsDao,
    private InstitutionUsersDao $institutionUsersDao,
    private FilesDao $filesDao,
    private UploadService $uploadService,
    private ValidatorService $validatorService
  ) {}

  public function getUserInstitutions(Request $request, Response $response): Response {
    return $this->handleErrors($request, function() use ($request, $response) {
      $user = $request->getAttribute('user');
      $userOwnedInstitutions = $this->institutionsDao->getUserOwnedInstitutions($user->getUserId());
      
      if(empty($userOwnedInstitutions) || count($userOwnedInstitutions) === 0) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $userOwnedInstitutionsDtos = array_map(function(Institution $institution) {
        $profilePicture = !empty($institution->getProfilePictureId())
          ? $this->filesDao->getFileById($institution->getProfilePictureId())
          : null;
        $banner = !empty($institution->getBannerId())
          ? $this->filesDao->getFileById($institution->getBannerId())
          : null;

        return new InstitutionDto($institution, $banner, $profilePicture);
      }, $userOwnedInstitutions);

      $response->getBody()->write(json_encode($userOwnedInstitutionsDtos));

      return $response;
    });
  }
  
  public function getInstitutionsSummary(Request $request, Response $response): Response
  {
    return $this->handleErrors($request, function() use ($request, $response) {
      $user = $request->getAttribute('user');
      $summaries = $this->institutionsDao->getInstitutionsSummaryByUserId($user->getUserId());
      
      if (empty($summaries)) {
        LogService::info("/institutions/summaries", "User does not participate in any institution");
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $summariesDtos = array_map(function(InstitutionSummary $summary) {
        $banner = !empty($summary->getBannerId()) 
          ? $this->filesDao->getFileById($summary->getBannerId()) 
          : null;
      
        $profilePicture = !empty($summary->getProfilePictureId()) 
          ? $this->filesDao->getFileById($summary->getProfilePictureId()) 
          : null;

        return new InstitutionSummaryDto($summary, $banner, $profilePicture);
      }, $summaries);

      $response->getBody()->write(json_encode($summariesDtos));
      return $response;
    });
  }

  public function getInstitutionSummaryById(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $user = $request->getAttribute('user');
      $summary = $this->institutionsDao->getInstitutionSummaryByUserIdAndInstitutionId($user->getUserId(), $institution_id);
      
      if (empty($summary)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $banner = !empty($summary->getBannerId()) 
        ? $this->filesDao->getFileById($summary->getBannerId()) 
        : null;
      
      $profilePicture = !empty($summary->getProfilePictureId()) 
        ? $this->filesDao->getFileById($summary->getProfilePictureId()) 
        : null;

      $summaryDto = new InstitutionSummaryDto($summary, $banner, $profilePicture);
      $response->getBody()->write(json_encode($summaryDto));
      return $response;
    });
  }

  public function getInstitutions(Request $request, Response $response): Response
  {
    return $this->handleErrors($request, function() use ($request, $response) {
      $user = $request->getAttribute('user');
      $institutions = $this->institutionsDao->getInstitutionsByUserId($user->getUserId());
      
      if (empty($institutions)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $institutionsDtos = array_map(function(Institution $institution) {
        $banner = !empty($institution->getBannerId()) 
          ? $this->filesDao->getFileById($institution->getBannerId()) 
          : null;
        
        $profilePicture = !empty($institution->getProfilePictureId()) 
          ? $this->filesDao->getFileById($institution->getProfilePictureId()) 
          : null;

        return new InstitutionDto($institution, $banner, $profilePicture);
      }, $institutions);

      $response->getBody()->write(json_encode($institutionsDtos));
      return $response;
    });
  }

  public function getInstitutionById(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $institution = $this->institutionsDao->getInstitutionById($institution_id);
      
      $banner = !empty($institution->getBannerId()) 
        ? $this->filesDao->getFileById($institution->getBannerId()) 
        : null;
      
      $profilePicture = !empty($institution->getProfilePictureId()) 
        ? $this->filesDao->getFileById($institution->getProfilePictureId()) 
        : null;

      $institutionDto = new InstitutionDto($institution, $banner, $profilePicture);
      $response->getBody()->write(json_encode($institutionDto));
      return $response;
    });
  }

  public function createInstitution(Request $request, Response $response): Response
  {
    return $this->handleErrors($request, function() use ($request, $response) {
      /** @var User mixed $user */
      $user = $request->getAttribute('user');
      $userOwnedInstitutions = $this->institutionsDao->getUserOwnedInstitutions($user->getUserId());
      
      if (count($userOwnedInstitutions) >= 3) {
        throw new HttpForbiddenException($request, LogService::HTTP_403 . "User has reached the maximum number of owned institutions (3)");
      }

      $body = $request->getParsedBody();
      $uploadedFiles = $request->getUploadedFiles();

      $this->validatorService->validateRequired($body, ['name', 'description']);

      // Required parameters
      $name = new InstitutionNameVo($body["name"]);
      $description = new InstitutionDescriptionVo($body["description"]);

      // Optional parameters
      $profilePicture = !empty($uploadedFiles['profile-picture']) 
      ? new ProfileAssetVo($uploadedFiles['profile-picture'])
      : null;

      $banner = !empty($uploadedFiles['banner'])
      ? new ProfileAssetVo($uploadedFiles['banner'])
      : null;

      $timestamp = date('Y-m-d H:i:s');
      if (!empty($profilePicture)) {
        $fileUrl = $this->uploadService->upload(
          $profilePicture->getExtension(), 
          $profilePicture->getContent()
        );

        $profilePictureFile = $this->filesDao->createFile(new File([
          "file_id" => Uuid::uuid4()->toString(),
          "url" => $fileUrl,
          "filename" => $profilePicture->getSafeFilename(),
          "mime_type" => $profilePicture->getMimeType(),
          "size" => $profilePicture->getSize(),
          "file_type" => FileType::Image->value,
          "uploaded_at" => $timestamp
        ]));
      }

      if (!empty($banner)) {
        $fileUrl = $this->uploadService->upload(
          $banner->getExtension(), 
          $banner->getContent()
        );

        $bannerFile = $this->filesDao->createFile(new File([
          "file_id" => Uuid::uuid4()->toString(),
          "url" => $fileUrl,
          "filename" => $banner->getSafeFilename(),
          "mime_type" => $banner->getMimeType(),
          "size" => $banner->getSize(),
          "file_type" => FileType::Image->value,
          "uploaded_at" => $timestamp
        ]));
      }

      $institution = $this->institutionsDao->createInstitution(new Institution([
        "institution_id" => Uuid::uuid4()->toString(),
        "user_id" => $user->getUserId(),
        "name" => $name->getValue(),
        "email" => $user->getEmail(),
        "description" => $description->getValue(),
        "profile_picture_id" => $profilePictureFile?->getFileId(),
        "banner_id" => $bannerFile?->getFileId(),
      ]));

      $this->institutionUsersDao->createInstitutionUser(new InstitutionUser([
        "institution_user_id" => Uuid::uuid4()->toString(),
        "role" => InstitutionUserType::Admin->value ,
        "joined_at" => $timestamp,
        "institution_id" => $institution->getInstitutionId(),
        "user_id" => $user->getUserId()
      ]));

      $institutionDto = new InstitutionDto($institution, $bannerFile, $profilePictureFile);
      LogService::info('/institutions', "Created institution {$institution->getInstitutionId()} for user {$user->getUserId()}");
      $response->getBody()->write(json_encode($institutionDto));
      return $response;
    });
  }

  public function updateInstitution(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $user = $request->getAttribute('user');

      $body = $request->getParsedBody();
      $this->validatorService->validateRequired($body, ['name', 'description']);

      // Required parameters
      $name = new InstitutionNameVo($body["name"]);
      $description = new InstitutionDescriptionVo($body["description"]);
      
      // Optional parameters
      $profilePictureId = !empty($body["profile_picture_id"]) 
      ? new UuidV4Vo($body["profile_picture_id"])
      : null;

      $bannerId = !empty($body["banner_id"])
      ? new UuidV4Vo($body["banner_id"])
      : null;

      $institution = $this->institutionsDao->getInstitutionById($institution_id);
      
      if (empty($institution)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      if($profilePictureId !== null) {
        $profilePicture = $this->filesDao->getFileById($profilePictureId->getValue());
        
        if (empty($profilePicture)) {
          throw new HttpNotFoundException($request, LogService::HTTP_404);
        }
        if ($profilePicture->getFileType()->value !== FileType::Image->value) {
          throw new InvalidArgumentException("Profile picture must be an image");
        }

        $institution->setProfilePictureId($profilePicture->getFileId());
      }
      
      if($bannerId !== null) {
        $banner = $this->filesDao->getFileById($bannerId->getValue());
        
        if (empty($banner)) {
          throw new HttpNotFoundException($request, LogService::HTTP_404);
        }
        if ($banner->getFileType()->value !== FileType::Image->value) {
          throw new InvalidArgumentException("Banner must be an image");
        }
        
        $institution->setBannerId($banner->getFileId());
      }
      
      $institution->setName($name->getValue());
      $institution->setDescription($description->getValue());
      
      $institution = $this->institutionsDao->updateInstitution($institution);

      $institutionDto = new InstitutionDto($institution, $banner, $profilePicture);
      $response->getBody()->write(json_encode($institutionDto));
      
      LogService::info("/institutions/{$institution_id}", "Institution updated by user {$user->getUserId()}");
      return $response;
    });
  }

  public function deleteInstitution(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $user = $request->getAttribute('user');

      $institution = $this->institutionsDao->getInstitutionById($institution_id);
      if (empty($institution)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $this->institutionsDao->deleteInstitution($institution_id);
      LogService::info("/institutions/$institution_id", "Institution deleted by user {$user->getUserId()}");
      return $response->withStatus(204);
    });
  }
}