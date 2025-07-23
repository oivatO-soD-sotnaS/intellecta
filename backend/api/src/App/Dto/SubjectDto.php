<?php
namespace App\Dto;

use App\Models\File;
use App\Models\Subject;
use App\Models\User;

readonly class SubjectDto implements \JsonSerializable {
    private string $subject_id;
    private string $name;
    private string $description;
    private string $institution_id;
    private ?UserDto $teacher;
    private ?File $profile_picture;
    private ?File $banner;

    public function __construct(Subject $subject, ?UserDto $teacher, ?File $profilePicture, ?File $banner) {
        $this->subject_id = $subject->getSubjectId();
        $this->name = $subject->getName();
        $this->description = $subject->getDescription();
        $this->institution_id = $subject->getInstitutionId();
        $this->teacher = $teacher;
        $this->profile_picture = $profilePicture;
        $this->banner = $banner;
    }

    private function toArray(): array {
        return [
            'subject_id' => $this->subject_id,
            'name' => $this->name,
            'description' => $this->description,
            'institution_id' => $this->institution_id,
            'teacher' => $this->teacher,
            'profile_picture' => $this->profile_picture,
            'banner' => $this->banner
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}