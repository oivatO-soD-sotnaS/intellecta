// app/(public)/sign-in/page.tsx
"use client"

import React from "react"

// mantém seus caminhos atuais
import { SignInForm } from "../_components/signIn/SignInForm"
import Header from "../_components/Header"
import LegalLinks from "../_components/LegalLinks"
import { Boxes } from "@/components/ui/background-boxes"

// background boxes

export default function SignInPage() {
  return (
    <main className="relative min-h-svh bg-background overflow-hidden">
      {/* BG animado */}
      <Boxes/>


      {/* overlay p/ melhorar legibilidade sobre o bg */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35),transparent_60%)]
          md:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45),transparent_60%)]
        "
      />

      {/* container central */}
      <div className="mx-auto grid min-h-svh w-full place-items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[560px]">
          <div className="relative">
            <div
              aria-hidden
              className="
                pointer-events-none absolute -inset-[1.5px] -z-10
                rounded-[22px]
                opacity-80 blur-md
              "
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-primary) 100%)",
              }}
            />

            <section
              className="
                rounded-2xl 
                bg-card/80 p-4 shadow-2xl backdrop-blur
                supports-[backdrop-filter]:bg-card/60
                sm:p-5
              "
            >
              <div className="space-y-4 sm:space-y-5">
                <Header />
                <SignInForm />
              </div>
            </section>
          </div>

          {/* links legais FORA do card para encurtar a altura visual do card */}
          <div className="mt-4">
            <LegalLinks />
          </div>
        </div>
      </div>
    </main>
  )
}
