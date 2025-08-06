import { z } from "zod"

export const institutionUserSchema = z.object({
  institutionUserId: z.string().uuid(),
  role: z.enum(["admin", "teacher", "student"]),
  user: z.object({
    userId: z.string().uuid(),
    fullName: z.string(),
    email: z.string().email(),
    profilePictureUrl: z.string().url().optional(),
  }),
})
export type InstitutionUserDto = z.infer<typeof institutionUserSchema>
