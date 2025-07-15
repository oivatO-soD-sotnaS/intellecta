<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Services\LogService;
use Exception;
use InvalidArgumentException;
use PDOException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;


abstract class BaseController
{
    protected function handleErrors(Request $request, callable $action): Response
    {
        try {
            return $action();
        } catch (InvalidArgumentException $e) {
            LogService::http422($request->getUri()->getPath(), $e->getMessage());
            throw new HttpException($request, $e->getMessage(), 422);
        } catch (PDOException $e) {
            LogService::http500($request->getUri()->getPath(), $e->getMessage());
            if ($e->getCode() === 23000) {
                throw new HttpException($request, 'E-mail already registered', 409);
            }
            throw new HttpInternalServerErrorException($request, "Could not complete the operation due to a database error");
        } catch (HttpException $e) {
            throw $e;
        } catch (Exception $e) {
            LogService::http500($request->getUri()->getPath(), $e->getMessage());
            throw new HttpInternalServerErrorException($request, $e->getMessage());
        }
    }
}