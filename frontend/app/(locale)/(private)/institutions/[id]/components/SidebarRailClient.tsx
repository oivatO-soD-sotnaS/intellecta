"use client";

import { ReactNode } from "react";
import { useSidebarStore } from "@/store/sidebarStore";

export default function SidebarRailClient({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <aside
      data-collapsed={isCollapsed ? "true" : "false"}
      className={[
        "sticky top-16 self-start",
        "h-[calc(100vh-4rem)]",
        "relative hidden md:block rounded-xl border border-border bg-card",
        "transition-[width] duration-300 ease-out",
        "overflow-hidden w-full p-3",
        isCollapsed ? "w-[72px]" : "w-[280px]",
      ].join(" ")}
    >
      {isCollapsed && <div className="absolute right-0 top-0 h-full w-px bg-border/50" />}

      <div className="flex h-full  flex-col overflow-hidden">
        {children}
      </div>
    </aside>
  );
}
