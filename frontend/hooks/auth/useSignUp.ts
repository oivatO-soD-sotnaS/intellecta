"use client"

import { useState, useCallback } from "react"

type Payload = {
  email: string
  password: string
  isHuman: boolean
  full_name: string
}

export function useSignUp(
  onSuccess: (email: string) => void,
  onFail: (msg: string) => void
) {
  const [isPending, setIsPending] = useState(false)

  const mutate = useCallback(
    async (body: Payload) => {
      try {
        setIsPending(true)

        const res = await fetch("/api/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        const data = await res.json().catch(() => ({}) as any)

        if (!res.ok) {
          const msg =
            data?.error?.message ||
            (typeof data === "string" ? data : "Erro ao cadastrar")
          onFail(msg)
          return
        }

        onSuccess(data?.email ?? body.email)
      } catch (e) {
        onFail("Falha de rede")
      } finally {
        setIsPending(false)
      }
    },
    [onSuccess, onFail]
  )

  return { mutate, isPending }
}
