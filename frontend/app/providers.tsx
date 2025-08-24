// app/providers.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

// HeroUI
// (mantenha o import que seu projeto já usa; se hoje é "@heroui/system", troque aqui)
import { HeroUIProvider } from "@heroui/system"

// Tema (classe no <html> via next-themes)
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes"

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "@heroui/toast"

type Props = {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: Props) {
  const router = useRouter()

  // evita recriar client a cada render
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        // evita animação ao trocar tema
        disableTransitionOnChange
        {...themeProps}
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider/>
          {children}
        </QueryClientProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
