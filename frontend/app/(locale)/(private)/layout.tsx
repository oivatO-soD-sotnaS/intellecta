// app/(locale)/(private)/layout.tsx
"use client"
import "@/styles/globals.css"
import { ReactNode } from "react"

import { Providers } from "../../providers"
import { ThemeSwitch } from "@/components/theme-switch"
import Header from "./components/Header"


export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100svh] flex flex-col bg-background text-foreground">
      <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
        <Header
        user={{ name: "Ana Silva", email: "ana@ifpr.edu.br", avatarUrl: "" }}
        notifications={3}
        onSignOut={() => {/* sua lógica de logout */}}
      />
        <main className="flex-1 border-none h-">{children}</main>
      </Providers>
    </div>
  )
}
