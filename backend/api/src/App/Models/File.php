<?php
namespace App\Models;

use App\Enums\FileType;

class File implements \JsonSerializable {
    private $file_id;
    private $url;
    private $filename;
    private $mime_type;
    private $size;
    private $uploaded_at;
    private FileType $file_type;

    public function __construct(array $data = []) {
        $this->file_id = $data['file_id'] ?? '';
        $this->url = $data['url'] ?? '';
        $this->filename = $data['filename'] ?? '';
        $this->mime_type = $data['mime_type'] ?? null;
        $this->size = $data['size'] ?? null;
        $this->file_type = FileType::tryFrom($data['file_type'] ?? 'other') ?? FileType::Other;
        $this->uploaded_at = $data['uploaded_at'] ?? date('Y-m-d H:i:s');
    }

    private function toArray(): array {
        return [
            'file_id' => $this->file_id,
            'url' => $this->url,
            'filename' => $this->filename,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'uploaded_at' => $this->uploaded_at,
            'file_type' => $this->file_type->value
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
public function getFileId(): string
{
    return $this->file_id;
}

public function setFileId(string $file_id): void
{
    $this->file_id = $file_id;
}

public function getUrl(): string
{
    return $this->url;
}

public function setUrl(string $url): void
{
    $this->url = $url;
}

public function getFilename(): string
{
    return $this->filename;
}

public function setFilename(string $filename): void
{
    $this->filename = $filename;
}

public function getMimeType(): ?string
{
    return $this->mime_type;
}

public function setMimeType(?string $mime_type): void
{
    $this->mime_type = $mime_type;
}

public function getSize(): ?int
{
    return $this->size;
}

public function setSize(?int $size): void
{
    $this->size = $size;
}

public function getUploadedAt(): string
{
    return $this->uploaded_at;
}

public function setUploadedAt(string $uploaded_at): void
{
    $this->uploaded_at = $uploaded_at;
}

public function getFileType(): FileType
{
    return $this->file_type;
}

public function setFileType(FileType $file_type): void
{
    $this->file_type = $file_type;
}
}