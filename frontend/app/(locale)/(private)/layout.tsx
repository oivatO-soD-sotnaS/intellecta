// app/(locale)/(private)/layout.tsx
import "@/styles/globals.css"
import { ReactNode } from "react"

import { Providers } from "../../providers"
import { Header } from "./components/Header"


export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100svh] flex flex-col bg-background text-foreground">
      <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
        <Header className="w-full" />
        <main className="flex-1 border-none">{children}</main>
      </Providers>
    </div>
  )
}
