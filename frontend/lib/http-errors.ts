// lib/http-errors.ts
export class HttpError extends Error {
  status: number
  payload?: any
  constructor(status: number, message: string, payload?: any) {
    super(message)
    this.name = "HttpError"
    this.status = status
    this.payload = payload
  }
}

async function readPayload(res: Response) {
  try {
    const text = await res.text()
    if (!text) return undefined
    try {
      return JSON.parse(text)
    } catch {
      return { message: text }
    }
  } catch {
    return undefined
  }
}

export async function assertOkOrThrow(res: Response) {
  if (res.ok) return res
  const payload = await readPayload(res)
  const msg =
    payload?.message ||
    payload?.error ||
    (typeof payload === "string" ? payload : "") ||
    `${res.status} ${res.statusText}`
  throw new HttpError(res.status, msg, payload)
}

export function friendlyMessage(
  err: unknown,
  ctx?: "signin" | string
): { title: string; description?: string } {
  if (err instanceof TypeError) {
    return {
      title: "Falha de conexão",
      description:
        "Não foi possível comunicar com o servidor. Verifique sua internet e tente novamente.",
    }
  }

  if (err instanceof HttpError) {
    if (ctx === "signin") {
      if (err.status === 422) {
        return {
          title: "Credenciais inválidas",
          description:
            "E-mail e/ou senha incorretos. Confira seus dados e tente novamente.",
        }
      }
      if (err.status >= 500) {
        return {
          title: "Erro no servidor",
          description:
            "Houve um problema ao processar seu login. Tente novamente em instantes.",
        }
      }
    }

    return {
      title: err.message || "Não foi possível concluir a ação",
      description: err.payload?.details || undefined,
    }
  }

  return {
    title: "Algo deu errado",
    description:
      "Tente novamente. Se o problema persistir, entre em contato com o suporte.",
  }
}
