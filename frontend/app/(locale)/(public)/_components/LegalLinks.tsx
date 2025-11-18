"use client"

import React from "react"
import Link from "next/link"

export default function LegalLinks() {
  return (
    <div className="w-full text-center text-xs text-muted-foreground">
      <p className="mb-2">
        Ao se inscrever, você concorda com nossos{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Termos de Uso
        </Link>{" "}
        e{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Política de Privacidade
        </Link>
        .
      </p>
      <p className="opacity-80">© 2025 IFPR by Otavio &amp; Davyd</p>
    </div>
  )
}
