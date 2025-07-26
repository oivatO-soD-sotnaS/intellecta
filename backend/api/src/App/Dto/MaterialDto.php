<?php
namespace App\Dto;

use App\Models\File;
use App\Models\Material;

readonly class MaterialDto implements \JsonSerializable {
    private string $material_id;
    private string $title;
    private string $created_at;
    private string $changed_at;
    private string $subject_id;
    private ?File $file;

    public function __construct(Material $material, ?File $file) {
        $this->material_id = $material->getMaterialId();
        $this->title = $material->getTitle();
        $this->created_at = $material->getCreatedAt();
        $this->changed_at = $material->getChangedAt();
        $this->subject_id = $material->getSubjectId();
        $this->file = $file;
    }

    private function toArray(): array {
        return [
            'material_id' => $this->material_id,
            'title' => $this->title,
            'created_at' => $this->created_at,
            'changed_at' => $this->changed_at,
            'subject_id' => $this->subject_id,
            'file' => $this->file
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}