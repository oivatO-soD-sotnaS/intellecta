<?php

declare(strict_types=1);

namespace App\Enums;

enum InstitutionUserType: string
{
    case Admin = 'admin';
    case Teacher = 'teacher';
    case Student = 'student';
}