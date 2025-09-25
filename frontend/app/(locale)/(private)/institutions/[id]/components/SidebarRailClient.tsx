"use client";

import { ReactNode } from "react";
import { useSidebarStore } from "@/store/sidebarStore";

export default function SidebarRailClient({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <aside
      data-collapsed={isCollapsed ? "true" : "false"}
      className={[
        "relative hidden md:block rounded-xl border border-border bg-card pt-16", 
        "transition-[width] duration-300 ease-out",
        isCollapsed ? "w-[72px]" : "w-[280px]",
      ].join(" ")}
    >
      {isCollapsed && (
        <div className="absolute right-0 top-0 h-full w-px bg-border/50" />
      )}

      <div className="flex min-h-full flex-col">
        {children}
      </div>
    </aside>
  );
}
