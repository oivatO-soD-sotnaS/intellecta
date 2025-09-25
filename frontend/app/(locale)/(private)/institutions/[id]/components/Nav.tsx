// app/(locale)/(private)/institutions/[id]/components/sidebar/NavItem.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export default function NavItem({ href, icon, label }: Props) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="relative">
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
          active
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        )}
      >
        <span className={cn("grid size-5 place-items-center transition-transform group-hover:scale-110", active && "text-primary")}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </Link>

      <AnimatePresence>
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
