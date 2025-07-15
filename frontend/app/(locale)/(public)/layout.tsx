// app/(public)/layouts/PublicLayout.tsx
import "@/styles/globals.css"
import { ReactNode } from "react"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br">
      <main className="flex-1 flex items-center justify-center px-4 font-sans">
        {children}
      </main>
      <footer className="flex-shrink-0 py-4">
        <span className="text-gray-500 text-xs block text-center w-full">
          © 2025 IFPR by Davyd & Otavio
        </span>
      </footer>
    </div>
  )
}
