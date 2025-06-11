import "@/styles/globals.css"
import { ReactNode } from "react"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br  flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <footer className="py-4">
        <span className="text-gray-500 text-xs mx-auto block text-center">
          &copy; 2025 IFPR by Davyd & Otavio
        </span>
      </footer>
    </div>
  )
}
