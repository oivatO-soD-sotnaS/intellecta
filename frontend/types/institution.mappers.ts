// types/institution.mappers.ts
import type { ApiInstitution, Institution, CreateInstitutionInput, UpdateInstitutionInput, ApiInstitutionSummary, InstitutionSummary } from "./institution";

export function mapApiInstitution(i: ApiInstitution): Institution {
  return {
    id: i.institution_id,
    ownerUserId: i.user_id,
    name: i.name,
    email: i.email,
    description: i.description,
    profilePicture: i.profile_picture,
    banner: i.banner,
  };
}

export function buildCreateInstitutionFormData(input: CreateInstitutionInput): FormData {
  const fd = new FormData();
  fd.append("name", input.name);
  fd.append("description", input.description);
  if (input.profilePictureFile) fd.append("profile-picture", input.profilePictureFile);
  if (input.bannerFile) fd.append("banner", input.bannerFile);
  return fd;
}

export function mapApiInstitutionSummary(i: ApiInstitutionSummary): InstitutionSummary {
  return {
    id: i.institution_id,
    name: i.name,
    email: i.email,
    profilePicture: i.profile_picture,
    banner: i.banner,
  };
}

export function normalizeList<T>(data: T[] | { items: T[]; total?: number }): T[] {
  return Array.isArray(data) ? data : data.items ?? [];
}

export function buildUpdateInstitutionFormData(input: UpdateInstitutionInput): FormData {
  const fd = new FormData();
  if (input.name !== undefined) fd.append("name", input.name);
  if (input.description !== undefined) fd.append("description", input.description);
  if (input.profilePictureFile !== undefined) {
    if (input.profilePictureFile) fd.append("profile-picture", input.profilePictureFile);
  }
  if (input.bannerFile !== undefined) {
    if (input.bannerFile) fd.append("banner", input.bannerFile);
  }
  return fd;
}
