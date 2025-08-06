import { z } from "zod"

export const subjectSchema = z.object({
  subjectId: z.string().uuid(),
  name: z.string(),
  teacherName: z.string(),
  activitiesCount: z.number(),
  materialsCount: z.number(),
})
export type SubjectDto = z.infer<typeof subjectSchema>
