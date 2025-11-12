// /lib/mappers.ts
import type { AppUserDto, FileAssetDto } from "@/types/user"
import type { InstitutionUserDto } from "@/types/institution"
import type { ClassDTO } from "@/types/class"

/** Util: pega a 1ª string não vazia */
const pickStr = (...vals: any[]) => {
  for (const v of vals) if (typeof v === "string" && v.length) return v
  return ""
}

/** Util: pega a 1ª data (string) ou null */
const pickDate = (...vals: any[]) => {
  for (const v of vals) if (typeof v === "string" && v.length) return v
  return null as string | null
}

const mapFile = (api: any): FileAssetDto | null => {
  if (!api) return null
  return {
    fileId: api.file_id ?? api.fileId ?? api.id ?? "",
    url: api.url ?? "",
    filename: api.filename ?? "",
    mimeType: api.mime_type ?? api.mimeType ?? "",
    size: api.size ?? 0,
  }
}

export const mapAppUser = (api: any): AppUserDto => {
  // aceita user no topo (achatado) ou dentro de "user"
  const u = api?.user ? api.user : api

  const profile = mapFile(
    u?.profile_picture ?? u?.profilePicture ?? u?.avatar ?? null
  )

  return {
    userId: pickStr(u?.user_id, u?.userId, u?.id),
    fullName: pickStr(u?.full_name, u?.fullName, u?.name),
    email: pickStr(u?.email),
    profilePicture: profile,
    profilePictureUrl: profile?.url ?? null,
  }
}

export const mapInstitutionUser = (api: any): InstitutionUserDto => {
  // suporta shapes:
  // - { institution_user_id, user_id, institution_id, role, joined_at, user: {...} }
  // - { id/institutionUserId, userId, institutionId, role, joinedAt, ...achatado... }
  // - { id, role, name/email no topo }
  const userObj = api.user ? mapAppUser(api.user) : mapAppUser(api)

  return {
    institutionUserId: pickStr(
      api?.institution_user_id,
      api?.institutionUserId,
      api?.id,
      api?.institution_user?.id
    ),
    userId: pickStr(
      api?.user_id,
      api?.userId,
      api?.user?.user_id,
      api?.user?.userId
    ),
    institutionId: pickStr(api?.institution_id, api?.institutionId),
    role: (api?.role ?? "student") as InstitutionUserDto["role"],
    joinedAt: pickDate(
      api?.joined_at,
      api?.joinedAt,
      api?.created_at,
      api?.createdAt
    ),
    user: userObj,
  }
}

export const mapInstitutionUserList = (arr: any[]): InstitutionUserDto[] =>
  Array.isArray(arr) ? arr.map(mapInstitutionUser) : []

// export const mapClassUser = (api: any): ClassUserDto => {
//   return {
//     classUsersId: pickStr(api?.class_users_id, api?.classUsersId, api?.id),
//     joinedAt: pickStr(api?.joined_at, api?.joinedAt),
//     classId: pickStr(api?.class_id, api?.classId),
//     userId: pickStr(api?.user_id, api?.userId),
//     user: mapAppUser(api?.user ?? api),
//   }
// }
