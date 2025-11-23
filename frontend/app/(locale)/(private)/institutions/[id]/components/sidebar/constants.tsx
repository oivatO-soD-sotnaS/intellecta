import {
  Home,
  ListChecks,
  UserCog,
  LogOut,
} from "lucide-react"
import type { NavItem } from "./types"

export const makeNav = (institutionId: string) => {
  const base = `/institutions/${institutionId}` 

  const MENU: NavItem[] = [
    { label: "Início", icon: <Home className="size-4" />, href: `${base}` },
    {
      label: "Atividades",
      icon: <ListChecks className="size-4" />,
      href: `${base}/assignments`,
    },
  ]
  const SETTINGS: NavItem[] = [
    {
      label: "Gerenciar Instituição",
      icon: <UserCog className="size-4" />,
      href: `${base}/manage`,
      admin: true
    },
    { label: "Sair", icon: <LogOut className="size-4" />, href: `/logout` },
  ]

  return { MENU, SETTINGS }
}
