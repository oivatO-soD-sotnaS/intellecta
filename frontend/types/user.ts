// /types/user.ts
export type Role = "admin" | "teacher" | "student"

export type FileAssetDto = {
  fileId: string
  url: string
  filename: string
  mimeType: string
  size: number
}

export type AppUserDto = {
  userId: string
  fullName: string
  email: string
  profilePicture?: FileAssetDto | null
  profilePictureUrl?: string | null 
}
