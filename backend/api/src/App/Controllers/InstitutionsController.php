<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\InstitutionDao;
use App\Models\Institution;
use App\Services\LogService;
use Exception;
use PDOException;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class InstitutionsController {
  public function __construct(
    private InstitutionDao $institutionDao
  ){}

  public function getInstitutionsSummary(Request $request, Response $response): Response {
    $token = $request->getAttribute('token');

    try{
      $summaries = $this->institutionDao->getInstitutionsSummary($token['sub']);
      if(empty($summaries)) {
        LogService::http404('/institutions/summary', "No summaries found for the user {$token['sub']}");
        throw new HttpNotFoundException($request, "No summaries found for the user {$token['sub']}");
      }

      $response->getBody()->write(json_encode($summaries));
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

      $response->getBody()->write(json_encode($summary));
      return $response;
    }catch (PDOException $e) {
      LogService::http500('/institutions-summary', "Could not get institutions summaries due to a database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not get institutions summaries due to a database error. See logs for more details');
    }
  }

  public function createInstitution(Request $request, Response $response): Response {
    try {
      $body = $request->getParsedBody();
  
      $name = $body["name"] ?? null;
      $description = $body["description"] ?? null;
      $thumbnailId = $body["thumbnail_id"] ?? null;
      $bannerId = $body["banner_id"] ?? null;
  
      // Check for empty required fields
      if (empty($name) || empty($description)) {
        LogService::http422('/institutions', "Missing POST parameters: 'name' or 'description'");
        throw new HttpException($request, "POST parameters: 'name' and 'description' are required", 422);
      }
      $token = $request->getAttribute('token');
  
      $userOwnedInstitutions = $this->institutionDao->getOwnedInstitutions($token['sub']);
      
      if(count($userOwnedInstitutions) >= 3) {
        LogService::http403('/institutions', "User {$token['sub']} has reached the maximum number of owned institutions (3). Could not create institution.");
        throw new HttpForbiddenException($request, "User has reached the maximum number of owned institutions (3). Could not create institution.");
      }

      $institution = $this->institutionDao->createInstitution(new Institution([
        "institution_id" => Uuid::uuid4()->toString(),
        "owner_id" => $token['sub'],
        "name" => $name,
        "email" => $token["email"],
        "description" => $description,
        "thumbnail_id" => $thumbnailId,
        "banner_id" => $bannerId,
      ]));

      LogService::info('/institutions', "Create institution {$institution->getInstitutionId()} for user {$token['sub']}");
      $response->getBody()->write(json_encode($institution));
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