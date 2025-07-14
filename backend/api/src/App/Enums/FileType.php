<?php

namespace App\Enums;

enum FileType: string
{
  case Image = 'image';
  case Video = 'video';
  case Audio = 'audio';
  case Document = 'document';
  case Other = 'other';
}