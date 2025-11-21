"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { NavItem } from "./types";
import { InstitutionUserMe } from "../../layout";



export default function ListCollapsed({
  items,
  isActive,
  me
}: { items: NavItem[]; isActive: (href: string) => boolean, me: InstitutionUserMe }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {items.map((it) => {
        if(it.admin && me.role !== "admin") return

        const active = isActive(it.href);
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

        return btn;
      })}
    </div>
  );
}
