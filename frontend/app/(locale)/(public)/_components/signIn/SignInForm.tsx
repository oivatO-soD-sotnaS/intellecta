"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { addToast } from "@heroui/toast"
import { cn } from "@/lib/utils"

import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

// ----------------------
// ✔ Zod Schema
// ----------------------
const schema = z.object({
  email: z.string().email("Digite um email válido."),
  password: z
    .string()
    .min(5, "A senha deve ter ao menos 5 caracteres.")
    .refine((pw) => /[A-Z]/.test(pw), {
      message: "A senha deve incluir pelo menos 1 letra maiúscula.",
    })
    .refine((pw) => /[^a-zA-Z0-9]/.test(pw), {
      message: "A senha deve incluir pelo menos 1 símbolo.",
    }),
})

type FormValues = z.infer<typeof schema>


async function signInApi(values: FormValues) {
  const res = await fetch("/api/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  })

  if (!res.ok) throw new Error(`${res.status}`)

  return res.json()
}

function getErrorMessage(status: string) {
  switch (status) {
    case "401":
      return {
        title: "Credenciais inválidas",
        description: "Email ou senha incorretos.",
      }
    case "403":
      return {
        title: "E-mail não verificado",
        description: "Confirme seu e-mail antes de fazer login.",
      }
    case "404":
      return {
        title: "Usuário não encontrado",
        description: "Verifique se o email está correto.",
      }
    case "500":
      return {
        title: "Erro interno do servidor",
        description: "Estamos trabalhando para resolver.",
      }
    default:
      return {
        title: "Erro inesperado",
        description: "Algo deu errado. Tente novamente.",
      }
  }
}

export const SignInForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const mutation = useMutation({
    mutationFn: signInApi,

    onSuccess: () => {
      addToast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
        color: "success",
        variant: "flat",
      });

      router.push("/home");
      router.refresh();
    },

    onError: (err) => {
      const msg = getErrorMessage(err.message)
      addToast({
        title: msg.title,
        description: msg.description,
        color: "danger",
        variant: "flat",
      })
    },
  })

  const isLoading = mutation.isPending

  const onSubmit = (values: FormValues) => mutation.mutate(values)

  return (
    <Card className="w-full max-w-md mx-auto rounded-lg shadow-xl border-none">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD COM TOGGLE */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isLoading}
                        {...field}
                      />

                      {/* Botão de ver senha */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isLoading}
              className={cn("w-full bg-primary text-white")}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>

        {/* Sign up link */}
        <p className="text-center pt-6 text-base tracking-wide">
          Não tem conta ainda?{" "}
          <Link className="text-primary font-bold" href="/sign-up">
            Inscreva-se
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
