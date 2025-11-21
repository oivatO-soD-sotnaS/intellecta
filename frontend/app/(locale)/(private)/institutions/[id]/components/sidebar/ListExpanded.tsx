// app/(locale)/(private)/institutions/[id]/components/sidebar/ListExpanded.tsx

"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { NavItem } from "./types";
import { InstitutionUserMe } from "../../layout";

export default function ListExpanded({
  items,
  isActive,
  me
}: {
  items: NavItem[];
  isActive: (href: string) => boolean;
  me: InstitutionUserMe;
}) {
  return (
    <SidebarMenu>
      {items.map((it, idx) => {
        if(it.admin && me.role !== "admin") return

        const active = isActive(it.href);
        return (
          <SidebarMenuItem key={it.label} className="mt-1">
            <motion.div
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.18, delay: 0.03 * idx }}
              className="relative overflow-hidden"
            >
              <SidebarMenuButton
                asChild
                isActive={active}
                className="relative overflow-hidden group"
              >
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
            </motion.div>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
