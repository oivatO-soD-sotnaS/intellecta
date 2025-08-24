// app/layout.tsx
import type { Metadata } from "next"
import "./../styles/globals.css"
import { Providers } from "./providers"
import { fontSans, fontMono } from "@/config/fonts"
import { ThemeSwitch } from "@/components/theme-switch"

export const metadata: Metadata = {
  title: "Intellecta",
  description: "Sua plataforma educacional integrada",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable}`} 
    >
      <body className="font-sans min-h-[100svh] bg-background text-foreground antialiased">
        <Providers>
          <ThemeSwitch className="absolute top-4 right-4 z-50" />
          {children}
        </Providers>
      </body>
    </html>
  )
}
