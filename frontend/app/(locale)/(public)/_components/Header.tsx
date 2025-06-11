import React from "react"

import { Logo } from "./Logo"

interface SignInHeaderProps {
  title?: string
  subtitle?: string
  description?: string
}

export const SignInHeader: React.FC<SignInHeaderProps> = ({
  title = "Entrar no Intellecta",
  subtitle = "Sua plataforma educacional integrada",
  description = "Comece a aprender e colaborar agora",
}) => (
  <header className="flex flex-col items-center space-y-2 text-center">
    <Logo />

    <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
      {title}
    </h1>

    <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </header>
)
