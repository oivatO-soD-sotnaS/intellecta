/* eslint-disable no-console */
// app/(locale)/(private)/home/page.tsx
import { cookies } from "next/headers"

import { DashboardBanner } from "./components/DashboardBanner"
import HomeClient from "./components/HomeClient"

// função simples de decode de JWT (server-side)
function parseJwt(token: string): { [key: string]: any } {
  const base64Url = token.split(".")[1]
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  const jsonPayload = Buffer.from(base64, "base64").toString("utf8")

  return JSON.parse(jsonPayload)
}

export default async function HomePage() {
  // 1) pega token dos cookies (HttpOnly)
  const token = (await cookies()).get("token")?.value

  if (!token) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-red-600">
          Você não está autenticado. Faça login para continuar.
        </p>
      </div>
    )
  }

  // 2) tenta extrair o sub (userId) do payload
  let userId: string

  try {
    userId = parseJwt(token).sub
    if (!userId) throw new Error("JWT sem sub")
  } catch (e) {
    console.error("JWT inválido:", e)

    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-red-600">
          Erro ao processar autenticação. Faça login novamente.
        </p>
      </div>
    )
  }

  // 3) busca o usuário no backend
  let user: {
    user_id: string
    full_name: string
    email: string
    profile_picture_id?: string
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    if (!res.ok) throw new Error("Status " + res.status)
    user = await res.json()
  } catch (e) {
    console.error("Erro ao buscar usuário:", e)

    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-red-600">
          Erro ao carregar perfil. Tente recarregar a página.
        </p>
      </div>
    )
  }

  // 4) tudo ok → renderiza o banner e injeta o client
  const firstName = user.full_name.split(" ")[0]

  return (
    <>
      <DashboardBanner date={new Date()} name={firstName} />
      <HomeClient user={user} />
    </>
  )
}
