<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

define('APP_ROOT', dirname(__DIR__));

// Build container
$container = require APP_ROOT . '/config/dependencies.php';
AppFactory::setContainer($container);

$app = AppFactory::create();

// Load middleware and routes
(require APP_ROOT . '/config/defaultMiddleware.php')($app);
(require APP_ROOT . '/config/routes.php')($app);

$app->run();