// components/ui/LegalLinks.tsx
import React from "react"
import Link from "next/link"

interface LegalLinksProps {
  className?: string
}

export const LegalLinks: React.FC<LegalLinksProps> = ({ className = "" }) => {
  return (
    <div className={`text-center text-xs text-gray-500 ${className}`}>
      <span>Ao se inscrever, você concorda com nossos </span>
      <Link
        className="text-blue-600 hover:text-blue-800 underline transition-colors"
        href="/terms"
      >
        Termos de Uso
      </Link>
      <span> e </span>
      <Link
        className="text-blue-600 hover:text-blue-800 underline transition-colors"
        href="/privacy"
      >
        Política de Privacidade
      </Link>
      <span>.</span>
    </div>
  )
}
