<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\InstitutionDao;
use App\Dto\InstitutionDto;
use App\Dto\InstitutionSummaryDto;
use App\Models\File;
use App\Models\Institution;
use App\Models\InstitutionSummary;
use App\Services\LogService;
use App\Services\UploadService;
use App\Vo\InstitutionDescriptionVo;
use App\Vo\InstitutionNameVo;
use App\Vo\ProfilePictureVo;
use Exception;
use InvalidArgumentException;
use PDOException;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

use function PHPSTORM_META\map;

class InstitutionsController {
  public function __construct(
    private InstitutionDao $institutionDao,
    private FilesDao $filesDao,
    private UploadService $uploadService
  ){}

  public function getInstitutionsSummary(Request $request, Response $response): Response {
    $token = $request->getAttribute('token');

    try{
      $summaries = $this->institutionDao->getInstitutionsSummary($token['sub']);
      if(empty($summaries)) {
        LogService::http404('/institutions/summary', "No summaries found for the user {$token['sub']}");
        throw new HttpNotFoundException($request, "No summaries found for the user {$token['sub']}");
      }

      $summariesDtos = array_map(function(InstitutionSummary $summary) {
        if(!empty($summary->getBannerId())) {
          $banner = $this->filesDao->getFileById($summary->getBannerId());
        }
        if(!empty($summary->getThumbnailId())) {
          $profilePicture = $this->filesDao->getFileById($summary->getThumbnailId());
        }

        $summaryDto = new InstitutionSummaryDto($summary, $banner, $profilePicture);
        return $summaryDto;
      }, $summaries);

      $response->getBody()->write(json_encode($summariesDtos));
      return $response;
    }catch (PDOException $e) {
      LogService::http500('/institutions-summary', "Could not get institutions summaries due to a database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not get institutions summaries due to a database error. See logs for more details');
    }
  }
  public function getInstitutionSummaryById(Request $request, Response $response, string $institution_id): Response {
    $token = $request->getAttribute('token');

    try{
      $summary = $this->institutionDao->getInstitutionSummaryById($token['sub'], $institution_id);
      if(empty($summary)) {
        LogService::http404('/institutions/summary', "No summary found for the user {$token['sub']} and institution $institution_id");
        throw new HttpNotFoundException($request, "No summaries found for the user {$token['sub']} and institution $institution_id");
      }
      if(!empty($summary->getBannerId())) {
        $banner = $this->filesDao->getFileById($summary->getBannerId());
      }
      if(!empty($summary->getThumbnailId())) {
        $profilePicture = $this->filesDao->getFileById($summary->getThumbnailId());
      }

      $summaryDto = new InstitutionSummaryDto($summary, $banner, $profilePicture);

      $response->getBody()->write(json_encode($summaryDto));
      return $response;
    }catch (PDOException $e) {
      LogService::http500('/institutions-summary', "Could not get institutions summaries due to a database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not get institutions summaries due to a database error. See logs for more details');
    }
  }

  public function getInstitutions(Request $request, Response $response): Response {
    try{
      $token = $request->getAttribute('token');
      $institutions = $this->institutionDao->getInstitutionsByUserId($token['sub']);
      if(empty($institutions)) {
        LogService::http404('/institutions', "User {$token['sub']} does not participate in any institutions");
        throw new HttpNotFoundException($request, "User does not participate in any institutions");
      }

      $institutionsDtos = array_map(function(Institution $institution) {
        if(!empty($institution->getBannerId())) {
          $banner = $this->filesDao->getFileById($institution->getBannerId());
        }
        if(!empty($institution->getThumbnailId())) {
          $profilePicture = $this->filesDao->getFileById($institution->getThumbnailId());          
        }

        return new InstitutionDto($institution, $banner, $profilePicture);
      }, $institutions);

      $response->getBody()->write(json_encode($institutionsDtos));
      return $response;
    } catch (PDOException $e) {
      LogService::http500('/institutions', "Could not search for institutions the user participates in due to an database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not search for institutions the user participates in due to an database error. See logs for more details');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500('/institutions', "Could not search for institutions the user participates in due to a unknown error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not search for institutions the user participates in due to a unknown error. See logs for more details');
    } 
  }

  public function getInstitutionById(Request $request, Response $response, string $institution_id): Response {
    try{
      $institution = $this->institutionDao->getInstitutionById($institution_id);
      
      if(!empty($institution->getBannerId())) {
        $banner = $this->filesDao->getFileById($institution->getBannerId());
      }
      if(!empty($institution->getThumbnailId())) {
        $profilePicture = $this->filesDao->getFileById($institution->getThumbnailId());          
      }
      $institutionDto = new InstitutionDto($institution, $banner, $profilePicture);

      $response->getBody()->write(json_encode($institutionDto));
      return $response;
    } catch (PDOException $e) {
      LogService::http500('/institutions', "Could not search for institutions the user participates in due to an database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not search for institutions the user participates in due to an database error. See logs for more details');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500('/institutions', "Could not search for institutions the user participates in due to a unknown error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not search for institutions the user participates in due to a unknown error. See logs for more details');
    }
  }
  public function createInstitution(Request $request, Response $response): Response {
    try {
      $token = $request->getAttribute('token');
  
      $userOwnedInstitutions = $this->institutionDao->getOwnedInstitutions($token['sub']);
      
      if(count($userOwnedInstitutions) >= 3) {
        LogService::http403('/institutions', "User {$token['sub']} has reached the maximum number of owned institutions (3). Could not create institution.");
        throw new HttpForbiddenException($request, "User has reached the maximum number of owned institutions (3). Could not create institution.");
      }

      $body = $request->getParsedBody();
  
      $name = $body["name"] ?? null;
      $description = $body["description"] ?? null;

      $uploadedFiles = $request->getUploadedFiles();
    
      /**
       * @var UploadedFileInterface|null
       */
      $profilePicture = $uploadedFiles['profile-picture'] ?? null;
      /**
       * @var UploadedFileInterface|null
       */
      $banner = $uploadedFiles['banner'] ?? null;
      
      // Check for empty required fields
      if (empty($name) || empty($description)) {
        LogService::http422('/institutions', "Missing POST parameters: 'name' or 'description'");
        throw new HttpException($request, "POST parameters: 'name' and 'description' are required", 422);
      }

      try {
        $name = new InstitutionNameVo($name);
        $description = new InstitutionDescriptionVo($description);
        if(!empty($profilePicture)) $profilePicture = new ProfilePictureVo($profilePicture);
        if(!empty($banner)) $banner = new ProfilePictureVo($banner);
      } catch (InvalidArgumentException $e) {
        LogService::http422("/institutions/", $e->getMessage());
        throw new HttpException($request, $e->getMessage(), 422);
      }
      
      if(!empty($profilePicture)) {
        $fileUrl = $this->uploadService->institutionProfilePicture($profilePicture->getExtension(), $profilePicture->getContent());

        $profilePicture = $this->filesDao->createFile(new File([
          "file_id" => Uuid::uuid4()->toString(),
          "url" => $fileUrl,
          "filename" => $profilePicture->getSafeFilename(),
          "mime_type" => $profilePicture->getMimeType(),
          "size" => $profilePicture->getSize(),
          "uploaded_at" => date('Y-m-d H:i:s')
        ]));
      }

      if(!empty($banner)) {
        $fileUrl = $this->uploadService->institutionBanner($banner->getExtension(), $banner->getContent());

        $banner = $this->filesDao->createFile(new File([
          "file_id" => Uuid::uuid4()->toString(),
          "url" => $fileUrl,
          "filename" => $banner->getSafeFilename(),
          "mime_type" => $banner->getMimeType(),
          "size" => $banner->getSize(),
          "uploaded_at" => date('Y-m-d H:i:s')
        ]));
      }

      $institution = $this->institutionDao->createInstitution(new Institution([
        "institution_id" => Uuid::uuid4()->toString(),
        "user_id" => $token['sub'],
        "name" => $name->getValue(),
        "email" => $token["email"],
        "description" => $description->getValue(),
        "profile_picture_id" => $profilePicture ? $profilePicture->getFileId() : null,
        "banner_id" => $banner ? $banner->getFileId() : null,
      ]));

      $institutionDto = new InstitutionDto($institution, $banner, $profilePicture);
      LogService::info('/institutions', "Create institution {$institution->getInstitutionId()} for user {$token['sub']}");
      $response->getBody()->write(json_encode($institutionDto));
      return $response;
    } catch (PDOException $e) {
      LogService::http500('/institutions', "Could not create the institution due to an database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not create the institution due to an database error. See logs for more detail');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500('/institutions', "Could not create the institution due to a unknown error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not create the institution due to a unknown error. See logs for more detail');
    }
  }
}