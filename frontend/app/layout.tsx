/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "@/styles/globals.css"
import { Metadata, Viewport } from "next"
import { Link } from "@heroui/link"
import clsx from "clsx"

import { Providers } from "./providers"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/config/fonts"
import { Navbar } from "@/components/navbar"
import { ThemeSwitch } from "@/components/theme-switch"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            {/* Theme Switch - Posicionado no canto superior direito */}
            <div className="absolute top-4 right-4 z-50">
              <ThemeSwitch />
            </div>

            <main className="container mx-auto max-w-7xl px-6 sm:px-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
