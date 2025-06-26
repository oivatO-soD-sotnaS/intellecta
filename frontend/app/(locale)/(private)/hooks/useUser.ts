// hooks/useUser.ts
"use client"
import { useState, useEffect } from "react"

interface User {
  user_id: string
  full_name: string
  email: string
  profile_picture_id?: string
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))

  console.log("log do m ->", m)

  return m ? decodeURIComponent(m[2]) : null
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = getCookie("user_id")

    if (!id) {
      setError("Usuário não autenticado")
      setLoading(false)

      return
    }

    fetch(`/api/users/${id}`, {
      credentials: "include", // para mandar o token HttpOnly junto
    })
      .then(async (res) => {
        const payload = await res.json()

        if (!res.ok) throw new Error(payload.error || payload.message)
        setUser(payload)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading, error }
}
