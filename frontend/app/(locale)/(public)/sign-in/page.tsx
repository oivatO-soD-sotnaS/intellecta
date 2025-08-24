// app/sign-in/page.tsx  (ou em pages/sign-in.tsx)
"use client"

import React from "react"

import { SignInForm } from "../_components/signIn/SignInForm"
import Header from "../_components/Header"
import LegalLinks from "../_components/LegalLinks"


export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <Header />
        <SignInForm />
        <LegalLinks/>
      </div>
    </div>
  )
}
