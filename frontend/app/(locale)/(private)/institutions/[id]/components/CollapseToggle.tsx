// app/(locale)/(private)/institutions/[id]/components/CollapseToggle.tsx
"use client";

import { motion } from "framer-motion";
import { useSidebarStore } from "@/store/sidebarStore";
import { PanelLeftClose, PanelRightOpen } from "lucide-react";

export default function CollapseToggle() {
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <motion.button
      aria-label={isCollapsed ? "Expandir navegação" : "Recolher navegação"}
      onClick={toggle}
      className="absolute -right-3 top-4 grid size-6 place-items-center rounded-full border bg-card shadow hover:bg-muted cursor-pointer"
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {isCollapsed ? (
        <PanelRightOpen className="size-3.5" />
      ) : (
        <PanelLeftClose className="size-3.5" />
      )}
    </motion.button>
  );
}
