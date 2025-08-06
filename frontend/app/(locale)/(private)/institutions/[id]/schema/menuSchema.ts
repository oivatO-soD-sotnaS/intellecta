// app/(locale)/(private)/institution/[id]/schema/menuSchema.ts
import { z } from "zod"

export const MenuItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  href: z.string(),
  icon: z.any(), 
})
export type MenuItem = z.infer<typeof MenuItemSchema>
