<?php
namespace App\Dto;

use App\Models\ClassModel;
use App\Models\File;

readonly class ClassModelDto implements \JsonSerializable {
    private string $class_id;
    private string $name;
    private string $description;
    private string $institution_id;
    private ?File $profile_picture;
    private ?File $banner;

    public function __construct(ClassModel $class, ?File $profile_picture, ?File $banner) {
        $this->class_id = $class->getClassId();
        $this->name = $class->getName();
        $this->description = $class->getDescription();
        $this->institution_id = $class->getInstitutionId();
        $this->profile_picture = $profile_picture;
        $this->banner = $banner;
    }

    private function toArray(): array {
        return [
            'class_id' => $this->class_id,
            'name' => $this->name,
            'description'=> $this->description,
            'institution_id' => $this->institution_id,
            'profile_picture' => $this->profile_picture,
            'banner' => $this->banner,
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}
