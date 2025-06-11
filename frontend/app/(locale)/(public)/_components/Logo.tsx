/* eslint-disable react/jsx-sort-props */
// components/ui/Logo.tsx
import Image from "next/image"
import React from "react"

interface LogoProps {
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Ícone do livro com chat bubble - baseado no Figma */}
      <div className="relative">
        <Image
          src="/IntellectaLogo.png"
          alt="Intellecta Logo"
          width={190}
          height={190}
        />
      </div>
    </div>
  )
}
