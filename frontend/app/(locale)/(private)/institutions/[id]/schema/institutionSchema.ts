// app/(locale)/(private)/institution/[id]/schema/institutionSchema.ts
import { z } from "zod"

export const institutionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  bannerUrl: z.string().url().optional(),
  profilePictureUrl: z.string().url().optional(),
})
export type InstitutionDto = z.infer<typeof institutionSchema>

export const institutionSummarySchema = z.object({
  id: z.string().uuid(),
  subjectsCount: z.number(),
  usersCount: z.number(),
  eventsCount: z.number(),
  bannerUrl: z.string().url().optional(),
  profilePictureUrl: z.string().url().optional(),
})
export type InstitutionSummaryDto = z.infer<typeof institutionSummarySchema>


export const institutionUpdateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  profile_picture_id: z.string().uuid().optional(),
  banner_id: z.string().uuid().optional(),
});
export type InstitutionUpdateInput = z.infer<typeof institutionUpdateSchema>;
