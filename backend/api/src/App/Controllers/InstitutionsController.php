<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\InstitutionDao;
use App\Dao\InstitutionUserDao;
use App\Dto\InstitutionDto;
use App\Dto\InstitutionSummaryDto;
use App\Enums\FileType;
use App\Enums\InstitutionUserType;
use App\Models\File;
use App\Models\Institution;
use App\Models\InstitutionSummary;
use App\Models\InstitutionUser;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\InstitutionDescriptionVo;
use App\Vo\InstitutionNameVo;
use App\Vo\ProfileAssetVo;
use App\Vo\UuidV4Vo;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
class InstitutionsController extends BaseController
{
  public function __construct(
    private InstitutionDao $institutionDao,
    private InstitutionUserDao $institutionUserDao,
    private FilesDao $filesDao,
    private UploadService $uploadService,
    private ValidatorService $validatorService
  ) {}

  public function getUserInstitutions(Request $request, Response $response): Response {
    return $this->handleErrors($request, function() use ($request, $response) {
      $token = $request->getAttribute('token');
      $userOwnedInstitutions = $this->institutionDao->getOwnedInstitutions($token['sub']);
      
      if(empty($userOwnedInstitutions) || count($userOwnedInstitutions) === 0) {
        throw new HttpNotFoundException($request, "O usuário não é dono de nenhuma instituição");
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
      $token = $request->getAttribute('token');
      $summaries = $this->institutionDao->getInstitutionsSummary($token['sub']);
      
      if (empty($summaries)) {
        LogService::info("/institutions/summaries", "User does not participate in any institution");
        throw new HttpNotFoundException($request, "User does not participate in any institution");
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
      $token = $request->getAttribute('token');
      $summary = $this->institutionDao->getInstitutionSummaryById($token['sub'], $institution_id);
      
      if (empty($summary)) {
        throw new HttpNotFoundException($request, "No summary found for the user {$token['sub']} and institution $institution_id");
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
      $token = $request->getAttribute('token');
      $institutions = $this->institutionDao->getInstitutionsByUserId($token['sub']);
      
      if (empty($institutions)) {
        throw new HttpNotFoundException($request, "User does not participate in any institutions");
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
      $institution = $this->institutionDao->getInstitutionById($institution_id);
      
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
      $token = $request->getAttribute('token');
      $userOwnedInstitutions = $this->institutionDao->getOwnedInstitutions($token['sub']);
      
      if (count($userOwnedInstitutions) >= 3) {
        throw new HttpForbiddenException($request, "User has reached the maximum number of owned institutions (3)");
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

      $institution = $this->institutionDao->createInstitution(new Institution([
        "institution_id" => Uuid::uuid4()->toString(),
        "user_id" => $token['sub'],
        "name" => $name->getValue(),
        "email" => $token["email"],
        "description" => $description->getValue(),
        "profile_picture_id" => $profilePictureFile?->getFileId(),
        "banner_id" => $bannerFile?->getFileId(),
      ]));

      $this->institutionUserDao->createInstitutionUser(new InstitutionUser([
        "institution_user_id" => Uuid::uuid4()->toString(),
        "role" => InstitutionUserType::Admin->value ,
        "joined_at" => $timestamp,
        "institution_id" => $institution->getInstitutionId(),
        "user_id" => $token['sub']
      ]));

      $institutionDto = new InstitutionDto($institution, $bannerFile, $profilePictureFile);
      LogService::info('/institutions', "Created institution {$institution->getInstitutionId()} for user {$token['email']}");
      $response->getBody()->write(json_encode($institutionDto));
      return $response;
    });
  }

  public function updateInstitution(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $token= $request->getAttribute('token');

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

      $institution = $this->institutionDao->getInstitutionById($institution_id);
      
      if (empty($institution)) {
        throw new HttpNotFoundException($request, "Institution not found");
      }

      if($profilePictureId !== null) {
        $profilePicture = $this->filesDao->getFileById($profilePictureId->getValue());
        
        if (empty($profilePicture)) {
          throw new HttpNotFoundException($request, "Profile picture not found");
        }
        if ($profilePicture->getFileType()->value !== 'image') {
          throw new HttpException($request, "Profile picture must be an image", 422);
        }


        $institution->setProfilePictureId($profilePicture->getFileId());
      }
      
      if($bannerId !== null) {
        $banner = $this->filesDao->getFileById($bannerId->getValue());
        
        if (empty($banner)) {
          throw new HttpNotFoundException($request, "Banner not found");
        }
        if ($banner->getFileType()->value !== 'image') {
          throw new HttpException($request, "Banner must be an image", 422);
        }
        
        $institution->setBannerId($banner->getFileId());
      }
      
      $institution->setName($name->getValue());
      $institution->setDescription($description->getValue());
      
      $institution = $this->institutionDao->updateInstitution($institution);

      $institutionDto = new InstitutionDto($institution, $banner, $profilePicture);
      $response->getBody()->write(json_encode($institutionDto));
      
      LogService::info("/institutions/{$institution_id}", "Institution updated by user {$token['email']}");
      return $response;
    });
  }

  public function deleteInstitution(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $token = $request->getAttribute('token');

      $institution = $this->institutionDao->getInstitutionById($institution_id);
      if (empty($institution)) {
        throw new HttpNotFoundException($request, "Institution not found");
      }

      $this->institutionDao->deleteInstitution($institution_id);
      LogService::info("/institutions/$institution_id", "Institution deleted by user {$token['email']}");
      return $response->withStatus(204);
    });
  }
}