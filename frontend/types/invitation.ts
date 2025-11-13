// types/invitation.ts
export type InvitationDTO = {
  id: string
  email: string
  institutionId: string
  institutionName: string
  role: "student" | "teacher" | "admin"
  expiresAt: string
  acceptedAt?: string | null
  createdAt: string
}
