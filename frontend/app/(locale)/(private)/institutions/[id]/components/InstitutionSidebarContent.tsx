"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
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
  ChevronDown,
} from "lucide-react"
import Image from "next/image"

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/")
}

export default function InstitutionSidebarContent() {
  const pathname = usePathname()
  const base = "." // dentro de [id], "./" resolve para a própria instituição

  return (
    <>
      {/* Cabeçalho da instituição (logo + nome + dropdown) */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
          <Image
            src="/IntellectaLogo.png"
            alt="Logo"
            width={28}
            height={28}
            className="rounded"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">IFPR - Campus</p>
            <p className="text-xs text-muted-foreground truncate">
              Foz do Iguaçu
            </p>
          </div>
          <ChevronDown className="ml-auto size-4 text-muted-foreground" />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {/* MENU */}
        <SidebarGroup>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                {
                  label: "Início",
                  icon: <Home className="size-4" />,
                  href: `${base}`,
                },
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
              ].map((it) => (
                <SidebarMenuItem key={it.label} className="mt-1">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(pathname, it.href)}
                  >
                    <Link href={it.href} className="gap-2">
                      {it.icon}
                      <span className="truncate">{it.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* TURMAS */}
        <SidebarGroup>
          <SidebarGroupLabel>TURMAS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
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
              ].map((it) => (
                <SidebarMenuItem key={it.label} className="mt-1">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(pathname, it.href)}
                  >
                    <Link href={it.href} className="gap-2">
                      {it.icon}
                      <span className="truncate">{it.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* CONFIGURAÇÕES */}
        <SidebarGroup>
          <SidebarGroupLabel>CONFIGURAÇÕES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                {
                  label: "Perfil",
                  icon: <UserCog className="size-4" />,
                  href: `${base}/profile`,
                },
                {
                  label: "Preferências",
                  icon: <Settings className="size-4" />,
                  href: `${base}/settings`,
                },
                {
                  label: "Sair",
                  icon: <LogOut className="size-4" />,
                  href: `/logout`,
                },
              ].map((it) => (
                <SidebarMenuItem key={it.label} className="mt-1">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(pathname, it.href)}
                  >
                    <Link href={it.href} className="gap-2">
                      {it.icon}
                      <span className="truncate">{it.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}
