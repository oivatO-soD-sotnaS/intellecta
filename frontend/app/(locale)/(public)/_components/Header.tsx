import React from "react"

import { Logo } from "./Logo"
import Link from "next/link"

interface HeaderProps {
  title?: string
  subtitle?: string
  description?: string
}

export default function Header() {
  return (
    <div className="flex items-center justify-center">
      <Link href="/" className="inline-flex items-center gap-2">
        <Logo />
        <span className="sr-only">Intellecta</span>
      </Link>
    </div>
  )
}