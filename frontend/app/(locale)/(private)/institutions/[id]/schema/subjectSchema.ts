// app/(locale)/(private)/institution/[id]/schema/subjectSchema.ts
import { z } from "zod"

export const subjectSchema = z.object({
  subjectId: z.string().uuid(),
  name: z.string(),
  teacherName: z.string(),
  activitiesCount: z.number(),
  materialsCount: z.number(),
  progress: z.number().min(0).max(100), 
})

export type SubjectDto = z.infer<typeof subjectSchema>
