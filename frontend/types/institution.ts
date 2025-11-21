// types/institution.ts

import { ApiUploadedFile } from "./file";
import { AppUserDto, Role } from "./user";

/** Arquivo vindo do backend */
export type ApiFileMeta = {
  file_id: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
};

/** Instituição como a API retorna (snake-case, campos com underscore) */
export type ApiInstitution = {
  institution_id: string;
  name: string;
  email: string;
  description: string;
  profilePicture: ApiFileMeta | null;
  banner: ApiFileMeta | null;
};

/** Instituição no domínio do front (camelCase, id normalizado) */
export type Institution = {
  id: string;
  ownerUserId: string;
  name: string;
  email: string;
  description: string;
  profilePicture?: ApiFileMeta;
  banner?: ApiFileMeta;
};

/** Modelo SUMMARY (ex.: GET /institutions/summaries, /institutions/summaries/{id}) */
export type ApiInstitutionSummary = {
  institution_id: string;
  name: string;
  email: string;
  profilePicture?: ApiFileMeta;
  banner?: ApiFileMeta;
  active_user_count: number;
  description: string;
  role: "admin" | "teacher" | "student";
  upcoming_event_count: number;
};

export type InstitutionSummary = {
  institution_id: string;
  name: string;
  email: string;
  profilePicture?: ApiFileMeta;
  banner?: ApiFileMeta;
  active_user_count: number;
  description: string;
  role: "admin" | "teacher" | "student";
  upcoming_event_count: number;
};

/** Payload para criar (POST /institutions) */
export type CreateInstitutionInput = {
  name: string;
  description: string;
  profilePictureFile?: File | null;
  bannerFile?: File | null;
};

/** Payload para atualizar (PUT /institutions/{id}) — JSON */
export type UpdateInstitutionInput = Partial<{
  name: string;
  description: string;
  profilePictureId: string | null;
  bannerId: string | null;
}>;


export type InstitutionUserDto = {
  institutionUserId: string
  userId: string
  institutionId: string
  role: Role
  joinedAt?: string | null
  user: AppUserDto
}
