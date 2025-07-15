// app/(locale)/(private)/layout.tsx
import "@/styles/globals.css"
import { ReactNode } from "react"

import { Providers } from "../../providers"

import { Header } from "./components/Header"

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {/* Header em full-width */}
          <Header className="w-full" />

          {/* Conteúdo central, agora restrito a container */}
          <main className="container mx-auto max-w-7xl flex-1 px-6 py-8 font-sans">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
