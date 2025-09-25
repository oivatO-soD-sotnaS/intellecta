// types/subject.ts
export type FileDTO = {
  file_id: string;
  title?: string | null;
  url?: string | null;
  filename?: string | null;
  mime_type?: string | null;
  size?: number | null;
};

export type TeacherDTO = {
  full_name: string;
  email?: string | null;
  profile_picture?: FileDTO | null;
};

export type SubjectDTO = {
  subject_id: string;
  institution_id: string;
  name: string;
  description?: string | null;
  profile_picture?: FileDTO | null;
  banner?: FileDTO | null;
  teacher?: TeacherDTO | null;
};

// Caso você liste por instituição (GET /institutions/{id}/subjects)
export type InstitutionSubjectsResponse = SubjectDTO[];
