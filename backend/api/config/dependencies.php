<?php

use DI\ContainerBuilder;

$builder = new ContainerBuilder();
$builder->addDefinitions(APP_ROOT . '/config/definitions.php');

return $builder->build();
