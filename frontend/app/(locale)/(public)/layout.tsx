// app/(public)/layouts/PublicLayout.tsx
import "@/styles/globals.css"
import { ReactNode } from "react"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="isolate grid min-h-dvh grid-rows-[auto_1fr_auto] overflow-x-hidden">
      <div />
      <main className="row-start-2 w-full">{children}</main>
      <footer className="row-start-3 py-4">
        <div className="w-full text-center text-xs">
          © 2025 IFPR by Davyd &amp; Otavio
        </div>
      </footer>
      <div id="portal-root" />
    </div>
  )
}
