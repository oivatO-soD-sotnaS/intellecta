// app/(locale)/(public)/sign-up/page.tsx
import React from "react"
import { LegalLinks } from "../_components/LegalLinks"
import { Header } from "../_components/Header"
import SignUpClient from "./SignUpClient"


export default function SignUpPage() {
  return (
    <main className="min-h-screen min-w-full flex flex-col bg-gradient-to-b from-transparent to-black/[0.03] dark:to-white/[0.03]">
      <header className="w-full">
        <Header />
      </header>

      <div className="min-h-dvh bg-gradient-to-b from-indigo-50 to-white py-10">
        <SignUpClient />
      </div>

      <div className="w-full flex justify-center py-2">
        <LegalLinks />
      </div>
    </main>
  )
}
