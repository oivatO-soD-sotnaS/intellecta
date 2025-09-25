"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "@/store/sidebarStore";
import CollapseToggle from "./CollapseToggle";

import {
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

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
} from "lucide-react";

// (opcional) Tooltip do shadcn. Se não tiver, remova os <Tooltip*> abaixo.
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Item = { label: string; href: string; icon: React.ReactNode };

const base = ".";

const MENU: Item[] = [
  { label: "Início", icon: <Home className="size-4" />, href: `${base}` },
  { label: "Disciplinas", icon: <BookOpen className="size-4" />, href: `${base}/subjects` },
  { label: "Atividades", icon: <ListChecks className="size-4" />, href: `${base}/activities` },
  { label: "Calendário", icon: <CalendarDays className="size-4" />, href: `${base}/calendar` },
  { label: "Fórum", icon: <MessageSquareMore className="size-4" />, href: `${base}/forum` },
  { label: "Materiais", icon: <FolderOpen className="size-4" />, href: `${base}/materials` },
];

const CLASSES: Item[] = [
  { label: "3º Ano - Informática", icon: <Users className="size-4" />, href: `${base}/classes/3-ano-info` },
  { label: "4º Ano - Informática", icon: <Users className="size-4" />, href: `${base}/classes/4-ano-info` },
];

const SETTINGS: Item[] = [
  { label: "Perfil", icon: <UserCog className="size-4" />, href: `${base}/profile` },
  { label: "Preferências", icon: <Settings className="size-4" />, href: `${base}/settings` },
  { label: "Sair", icon: <LogOut className="size-4" />, href: `/logout` },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function ListExpanded({ items, pathname }: { items: Item[]; pathname: string }) {
  return (
    <SidebarMenu >
      <motion.ul
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.04, delayChildren: 0.03 },
          },
        }}
      >
        {items.map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <SidebarMenuItem  key={it.label} className="mt-1">
              <motion.li variants={{ hidden: { y: 6, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
                <SidebarMenuButton asChild isActive={active} className="relative overflow-hidden group">
                  <Link href={it.href} className="gap-2">
                    <span className="grid size-5 place-items-center transition-transform group-hover:scale-110">
                      {it.icon}
                    </span>
                    <span className="truncate">{it.label}</span>
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          layoutId="sidebar-active-bg"
                          className="absolute inset-0 -z-10 rounded-md bg-primary/10"
                          transition={{ type: "spring", stiffness: 420, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </motion.li>
            </SidebarMenuItem>
          );
        })}
      </motion.ul>
    </SidebarMenu>
  );
}

function ListCollapsed({ items, pathname }: { items: Item[]; pathname: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {items.map((it) => {
        const active = isActive(pathname, it.href);
        const btn = (
          <Link
            key={it.label}
            href={it.href}
            className={[
              "relative grid size-10 place-items-center rounded-xl",
              "text-muted-foreground hover:text-foreground",
              active ? "bg-primary/15 text-primary" : "hover:bg-muted/60",
              "transition-colors",
            ].join(" ")}
          >
            {it.icon}
            <AnimatePresence>
              {active && (
                <motion.span
                  layoutId="rail-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-primary/15"
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
            </AnimatePresence>
          </Link>
        );

        // se tiver tooltip, envolve; senão, retorne btn direto
        return (
          <TooltipProvider key={it.label} delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>{btn}</TooltipTrigger>
              <TooltipContent side="right" className="px-2 py-1 text-xs">
                {it.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

export default function InstitutionSidebarContent() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebarStore();

  return (
    <SidebarProvider>
      {/* ⬇️ Wrapper que força direção em COLUNA */}
      <div className="flex h-full min-h-0 flex-col">
        <SidebarHeader className={isCollapsed ? "p-3" : "p-4"}>
          {isCollapsed ? (
            <div className="relative">
              <Image src="/IntellectaLogo.png" alt="Logo" width={28} height={28} className="mx-auto rounded" />
              <CollapseToggle />
            </div>
          ) : (
            <motion.div
              className="relative flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Image src="/IntellectaLogo.png" alt="Logo" width={28} height={28} className="rounded" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">IFPR - Campus</p>
                <p className="truncate text-xs text-muted-foreground">Foz do Iguaçu</p>
              </div>
              <ChevronDown className="ml-auto size-4 text-muted-foreground" />
              <CollapseToggle />
            </motion.div>
          )}
        </SidebarHeader>

        {/* ⬇️ Content ocupa o restante da altura */}
        <SidebarContent className="flex-1">
          {isCollapsed ? (
            <div className="flex h-full flex-col justify-start gap-6 py-2">
              {/* MENU / TURMAS / CONFIGURAÇÕES (versão colapsada) */}
              <section aria-label="Menu"><ListCollapsed items={MENU} pathname={pathname} /></section>
              <section aria-label="Turmas"><ListCollapsed items={CLASSES} pathname={pathname} /></section>
              <section aria-label="Configurações" className="mt-auto pb-3"><ListCollapsed items={SETTINGS} pathname={pathname} /></section>
            </div>
          ) : (
            <div className="space-y-6 py-2">
              {/* MENU */}
              <SidebarGroup>
                <SidebarGroupLabel>MENU</SidebarGroupLabel>
                <SidebarGroupContent>
                  <ListExpanded items={MENU} pathname={pathname} />
                </SidebarGroupContent>
              </SidebarGroup>
              {/* TURMAS */}
              <SidebarGroup>
                <SidebarGroupLabel>TURMAS</SidebarGroupLabel>
                <SidebarGroupContent>
                  <ListExpanded items={CLASSES} pathname={pathname} />
                </SidebarGroupContent>
              </SidebarGroup>
              {/* CONFIGURAÇÕES */}
              <SidebarGroup>
                <SidebarGroupLabel>CONFIGURAÇÕES</SidebarGroupLabel>
                <SidebarGroupContent>
                  <ListExpanded items={SETTINGS} pathname={pathname} />
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
          )}
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
}

