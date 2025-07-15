<?php
declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;

final class ProfileAssetVo {
    private string $originalName;
    private string $safeName;
    private string $mimeType;
    private string $extension;
    private int $size;
    private string $content;

    private const int MAX_SIZE = 1024 * 500;
    private const array ALLOWED_MIME_TYPES = [
        'image/jpeg' => ['jpeg', 'jpg'],
        'image/png' => ['png'],
        'image/gif' => ['gif'],
        'image/webp' => ['webp'],
    ];

    public function __construct(UploadedFileInterface $file)
    {
        if ($file->getError() !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Invalid upload: upload error occurred');
        }

        $this->size = $file->getSize();
        if ($this->size > self::MAX_SIZE) {
            throw new InvalidArgumentException('File exceeds 500KB limit');
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
}
