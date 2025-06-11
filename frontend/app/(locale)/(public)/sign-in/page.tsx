// app/sign-in/page.tsx  (ou em pages/sign-in.tsx)
"use client"

import React from "react"

import { SignInHeader } from "../_components/Header"
import { SignInForm } from "../_components/Form"
import { LegalLinks } from "../_components/LegalLinks"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <SignInHeader />
        <SignInForm />
        <LegalLinks className="text-center text-xs text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  )
}
