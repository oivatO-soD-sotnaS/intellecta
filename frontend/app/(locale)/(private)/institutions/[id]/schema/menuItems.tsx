// app/(locale)/(private)/institution/[id]/schema/menuItems.ts
import { IconManifestType } from "react-icons";
import { MenuItemSchema, type MenuItem } from "./menuSchema"
import { HouseIcon } from "lucide-react";


export const menuItems: MenuItem[] = [
  {
    key: "overview",
    label: "Visão Geral",
    href: "/institution/[id]/overview",
    icon: <HouseIcon />,
  },
  {
    key: "courses",
    label: "Cursos",
    href: "/institution/[id]/courses",
    icon: <HouseIcon />,
  },
  {
    key: "members",
    label: "Membros",
    href: "/institution/[id]/members",
    icon: <HouseIcon />,
  },
  {
    key: "settings",
    label: "Configurações",
    href: "/institution/[id]/settings",
    icon: <HouseIcon />,
  },
].map((item) => MenuItemSchema.parse(item))
