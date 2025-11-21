"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";
import CollapseToggle from "../CollapseToggle";
import { ApiInstitution } from "@/types/institution";

export default function SidebarHeaderCard({
  collapsed,
  institution
}: { collapsed: boolean, institution: ApiInstitution }) {
  return (
    <SidebarHeader className={(collapsed ? "p-3" : "p-4") + "sticky top-0 z-10 bg-card"}>
      {collapsed ? (
        <div className="relative">
          <Image src="/IntellectaLogo.png" alt="Logo" width={28} height={28} className="mx-auto rounded" />
          <CollapseToggle  />
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
            <p className="truncate text-sm font-semibold">{institution.name}</p>
            <p className="truncate text-xs text-muted-foreground">{institution.email}</p>
          </div>
          <ChevronDown className="ml-auto size-4 text-muted-foreground" />
          <CollapseToggle  />
        </motion.div>
      )}
    </SidebarHeader>
  );
}
