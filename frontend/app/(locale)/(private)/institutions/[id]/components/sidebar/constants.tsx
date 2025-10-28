// app/(locale)/(private)/institutions/[id]/components/sidebar/constants.tsx
import {
  Home,
  BookOpen,
  ListChecks,
  CalendarDays,
  MessageSquareMore,
  FolderOpen,
  Users,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react"
import type { NavItem } from "./types"

export const makeNav = (institutionId: string) => {
  const base = `/institutions/${institutionId}` 

  const MENU: NavItem[] = [
    { label: "Início", icon: <Home className="size-4" />, href: `${base}` },
    {
      label: "Disciplinas",
      icon: <BookOpen className="size-4" />,
      href: `${base}/subjects`,
    },
    {
      label: "Atividades",
      icon: <ListChecks className="size-4" />,
      href: `${base}/activities`,
    },
    {
      label: "Calendário",
      icon: <CalendarDays className="size-4" />,
      href: `${base}/calendar`,
    },
    {
      label: "Fórum",
      icon: <MessageSquareMore className="size-4" />,
      href: `${base}/forum`,
    },
    {
      label: "Materiais",
      icon: <FolderOpen className="size-4" />,
      href: `${base}/materials`,
    },
  ]

  // se suas turmas forem dinâmicas, você pode montar isso via fetch/props
  const CLASSES: NavItem[] = [
    {
      label: "3º Ano - Informática",
      icon: <Users className="size-4" />,
      href: `${base}/classes/3-ano-info`,
    },
    {
      label: "4º Ano - Informática",
      icon: <Users className="size-4" />,
      href: `${base}/classes/4-ano-info`,
    },
  ]

  const SETTINGS: NavItem[] = [
    {
      label: "Gerenciar Instituição",
      icon: <UserCog className="size-4" />,
      href: `${base}/manage`,
    },
    {
      label: "Preferências",
      icon: <Settings className="size-4" />,
      href: `${base}/settings`,
    },
    { label: "Sair", icon: <LogOut className="size-4" />, href: `/logout` },
  ]

  return { MENU, CLASSES, SETTINGS }
}
