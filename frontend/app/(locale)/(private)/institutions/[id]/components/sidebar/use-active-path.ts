"use client";
import { usePathname } from "next/navigation";

export function useActivePath() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");
  return { pathname, isActive };
}
