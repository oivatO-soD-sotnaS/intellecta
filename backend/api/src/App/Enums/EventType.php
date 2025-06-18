<?php

declare(strict_types=1);

namespace App\Enums;

enum EventType: string
{
    case Exam = 'exam';
    case Quiz = 'quiz';
    case Assignment = 'assignment';
    case Lecture = 'lecture';
    case Workshop = 'workshop';
    case Seminar = 'seminar';
    case Presentation = 'presentation';
    case Deadline = 'deadline';
    case Holiday = 'holiday';
    case Announcement = 'announcement';
    case Cultural = 'cultural';
    case Sports = 'sports';
    case Other = 'other';
}