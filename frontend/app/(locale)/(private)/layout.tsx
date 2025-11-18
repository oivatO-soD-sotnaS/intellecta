// app/(locale)/(private)/layout.tsx
"use client";
import "@/styles/globals.css";
import { ReactNode } from "react";

import { Providers } from "../../providers";

import Header from "./components/Header";

import { SessionGuard } from "@/components/SessionGuar";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100svh] flex flex-col bg-background text-foreground">
      <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
        <Header />
        <main className="flex-1 border-none h-">{children}</main>
        <SessionGuard />
      </Providers>
    </div>
  );
}
