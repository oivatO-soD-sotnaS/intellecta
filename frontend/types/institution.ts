// types/institution.ts

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
  user_id: string;
  name: string;
  email: string;
  description: string;
  profile_picture: ApiFileMeta | null;
  banner: ApiFileMeta | null;
};

/** Instituição no domínio do front (camelCase, id normalizado) */
export type Institution = {
  id: string;
  ownerUserId: string;
  name: string;
  email: string;
  description: string;
  profilePicture?: ApiFileMeta | null;
  banner?: ApiFileMeta | null;
};

/** Modelo SUMMARY (ex.: GET /institutions/summaries, /institutions/summaries/{id}) */
export type ApiInstitutionSummary = {
  institution_id: string;
  name: string;
  email: string;
  profile_picture: ApiFileMeta | null;
  banner: ApiFileMeta | null;
};


export type InstitutionSummary = {
  id: string;
  name: string;
  email: string;
  profilePicture?: ApiFileMeta | null;
  banner?: ApiFileMeta | null;
};

/** Payload para criar (POST /institutions) */
export type CreateInstitutionInput = {
  name: string;
  description: string;
  profilePictureFile?: File | null;
  bannerFile?: File | null;
};

/** Payload para atualizar (PUT /institutions/{id}) — parcial */
export type UpdateInstitutionInput = Partial<{
  name: string;
  description: string;
  profilePictureFile: File | null; 
  bannerFile: File | null;         
}>;
