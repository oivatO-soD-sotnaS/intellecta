// hooks/useUser.ts
"use client"

import { useQuery } from "@tanstack/react-query"

export interface User {
  user_id: string
  full_name: string
  email: string
  profile_picture_id?: string
  profile_picture_url?: string
}

async function fetchMe(): Promise<User> {
  const res = await fetch("/api/me", {
    credentials: "include", // send HttpOnly token cookie
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const err = await res.json()

    throw new Error(err.error || err.message || "Falha ao carregar usuário")
  }

  return res.json()
}

export function useUser() {
  return useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: false, // don’t retry by default
  })
}
