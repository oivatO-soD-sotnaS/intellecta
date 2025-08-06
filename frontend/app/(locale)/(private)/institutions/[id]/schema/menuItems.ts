// app/(locale)/(private)/institution/[id]/schema/menuItems.ts
import { IconManifestType } from "react-icons";
import { MenuItemSchema, type MenuItem } from "./menuSchema"


export const menuItems: MenuItem[] = [
  {
    key:   "overview",
    label: "Visão Geral",
    href:  "/institution/[id]/overview",
    icon:  <IconManifestType />,
  },
  {
    key:   "courses",
    label: "Cursos",
    href:  "/institution/[id]/courses",
    icon:  <IconManifestType />,
  },
  {
    key:   "members",
    label: "Membros",
    href:  "/institution/[id]/members",
    icon:  <IconManifestType />,
  },
  {
    key:   "settings",
    label: "Configurações",
    href:  "/institution/[id]/settings",
    icon:  <IconManifestType />,
  },
].map(item => MenuItemSchema.parse(item))
