// app/(locale)/(public)/sign-up/page.tsx
import React from "react"
import SignUpStepper from "../_components/signUp/SignUpStepper"

export default function SignUpPage() {
  return (
    <main className="relative min-h-[calc(100vh-0px)] overflow-hidden">
      {/* fundo decorativo suave */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/5 dark:to-white/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Coluna esquerda: mensagem/branding (opcional) */}
          <section className="hidden lg:block">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold leading-tight tracking-tight">
                Crie sua conta no{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Intellecta
                </span>
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 max-w-prose">
                Uma experiência de aprendizagem unificada — simples de usar,
                poderosa no que entrega. Cadastre-se em minutos, confirme seu
                e-mail e comece agora.
              </p>

              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-purple-500/80" />
                  Fluxo guiado em etapas, direto ao ponto.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-500/80" />
                  Segurança: verificação por código de 6 dígitos no e-mail.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-indigo-500/80" />
                  Design limpo e responsivo, pronto para dark mode.
                </li>
              </ul>
            </div>
          </section>

          {/* Coluna direita: Stepper */}
          <section className="flex w-full items-center justify-center">
            <div className="w-full max-w-[28rem]">
              <SignUpStepper />
            </div>
          </section>
        </div>

        {/* Rodapé leve (opcional): termos/infos */}
        <div className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
          Ao continuar, você concorda com nossas políticas e termos de uso.
        </div>
      </div>
    </main>
  )
}
