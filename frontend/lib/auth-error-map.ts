// lib/auth-error-map.ts
export type Problem = {
  status?: number
  title?: string
  detail?: string
  code?: string // se seu backend envia um code estável, use aqui
  issues?: Array<{ path?: string; message: string }>
}

export function mapSignInProblem(p?: Problem) {
  const status = p?.status ?? 0

  // Genérico para usuário (não revelar validação/política de senha)
  if ([ 403, 422].includes(status)) {
    return {
      title: "Usuário ou senha incorretos",
      description: "Verifique suas credenciais e tente novamente.",
      level: "error" as const,
    }
  }

  if (status === 429) {
    return {
      title: "Muitas tentativas",
      description:
        "Você atingiu o limite de tentativas. Tente novamente em alguns instantes.",
      level: "warning" as const,
    }
  }

  if(status === 401){
    return{
      title: "Dados não encontrados",
      description:
        "Não foi possivel encontrar os dados.",
      level: "warning" as const,
    }
  }

  if (status >= 500) {
    return {
      title: "Erro no servidor",
      description:
        "Estamos com instabilidade no momento. Tente novamente mais tarde.",
      level: "error" as const,
    }
  }

  // Fallback
  return {
    title: p?.title || "Falha ao entrar",
    description: p?.detail || "Não foi possível concluir o login.",
    level: "error" as const,
  }
}
