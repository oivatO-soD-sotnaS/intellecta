<?php
declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;

final class MaterialFileVo {
    private string $originalName;
    private string $safeName;
    private string $mimeType;
    private string $extension;
    private int $size;
    private string $content;
    private string $type;

    private const int MAX_SIZE = 1024 * 1024 * 50; // 50 MB

    private const array ALLOWED_MIME_TYPES = [
        // Imagens
        'image/jpeg' => ['jpeg', 'jpg'],
        'image/png' => ['png'],
        'image/gif' => ['gif'],
        'image/webp' => ['webp'],

        // Vídeos
        'video/mp4' => ['mp4'],
        'video/quicktime' => ['mov'],
        'video/x-msvideo' => ['avi'],
        'video/x-matroska' => ['mkv'],

        // Áudios
        'audio/mpeg' => ['mp3'],
        'audio/wav' => ['wav'],
        'audio/ogg' => ['ogg'],

        // Documentos
        'application/pdf' => ['pdf'],
        'application/msword' => ['doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => ['docx'],
        'application/vnd.ms-excel' => ['xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => ['xlsx'],
        'application/vnd.ms-powerpoint' => ['ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => ['pptx'],
        'text/plain' => ['txt'],
        'application/vnd.oasis.opendocument.text' => ['odt'],
    ];


    private const array MIME_TYPE_GROUPS = [
        'image' => 'image/',
        'video' => 'video/',
        'audio' => 'audio/',
        'document' => [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.oasis.opendocument.text',
            'text/plain',
        ],
    ];

    public function __construct(UploadedFileInterface $file)
    {
        if ($file->getError() !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Invalid upload: upload error occurred');
        }

        $this->size = $file->getSize();
        if ($this->size > self::MAX_SIZE) {
            throw new InvalidArgumentException('File exceeds 50MB limit');
        }

        if ($this->size === 0) {
            throw new InvalidArgumentException('Empty file not allowed');
        }

        $tmpPath = $file->getStream()->getMetadata('uri');
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $this->mimeType = finfo_file($finfo, $tmpPath);
        finfo_close($finfo);

        if (!array_key_exists($this->mimeType, self::ALLOWED_MIME_TYPES)) {
            throw new InvalidArgumentException('Invalid file type');
        }

        $this->originalName = $file->getClientFilename();
        $this->extension = strtolower(pathinfo($this->originalName, PATHINFO_EXTENSION));

        if (!in_array($this->extension, self::ALLOWED_MIME_TYPES[$this->mimeType], true)) {
            throw new InvalidArgumentException('File extension does not match its content');
        }

        $safe = preg_replace('/[^a-zA-Z0-9\-_.]/', '', $this->originalName);
        $safe = substr($safe, 0, 100);
        $this->safeName = pathinfo($safe, PATHINFO_FILENAME);

        $this->content = $file->getStream()->getContents();

        $this->type = $this->resolveFileType($this->mimeType);
    }

    private function resolveFileType(string $mimeType): string
    {
        foreach (self::MIME_TYPE_GROUPS as $type => $pattern) {
            if (is_string($pattern) && str_starts_with($mimeType, $pattern)) {
                return $type;
            }

            if (is_array($pattern) && in_array($mimeType, $pattern, true)) {
                return $type;
            }
        }

        return 'other';
    }

    public function getSafeFilename(): string
    {
        return $this->safeName;
    }

    public function getMimeType(): string
    {
        return $this->mimeType;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function getExtension(): string
    {
        return $this->extension;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getType(): string
    {
        return $this->type; // One of: image, video, audio, document, other
    }
}
