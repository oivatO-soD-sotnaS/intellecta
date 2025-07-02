<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\InstitutionDao;
use App\Services\LogService;
use PDOException;
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
    $body = $request->getParsedBody();

    $name = $body["name"] ?? null;
    $email = $body["email"] ?? null;
    $phoneNumber = $body["phone_number"] ?? null;
    $description = $body["description"] ?? null;
    $thumbnailUrl = $body["thumbnail_id"] ?? null;
    $bannerId = $body["banner_id"] ?? null;


    return $response;
  }
}