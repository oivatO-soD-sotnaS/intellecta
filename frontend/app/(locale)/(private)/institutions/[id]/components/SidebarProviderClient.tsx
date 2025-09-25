"use client";

import * as React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

/**
 * Wrapper cliente para injetar o contexto do shadcn Sidebar
 * quando estamos dentro do layout da Instituição.
 *
 * Use este componente para envolver QUALQUER uso de:
 * - <SidebarHeader>, <SidebarContent>, <SidebarGroup>, <SidebarMenuButton>, etc.
 * - <SidebarTrigger> (se você quiser um trigger local)
 */
export default function SidebarProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
