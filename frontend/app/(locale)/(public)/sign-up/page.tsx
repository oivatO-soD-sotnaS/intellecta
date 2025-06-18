"use client"

import React from "react"

import { Header } from "../_components/Header"
import { SignUpForm } from "../_components/signUp/SignUpForm"
import { LegalLinks } from "../_components/LegalLinks"

export default function SignUpPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <Header title="Cadastre-se no Intellecta" />
        <SignUpForm />
        <LegalLinks className="text-center text-xs text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  )
}
