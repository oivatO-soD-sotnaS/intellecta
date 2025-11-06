// lib/http.ts
export type Problem = {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  code?: string // app-specific
  issues?: Array<{ path?: string; message: string }>
}

export class AppError extends Error {
  status?: number
  code?: string
  detail?: string
  problem?: Problem
  constructor(problem: Problem, fallbackMsg = "Ocorreu um erro") {
    super(problem.title || fallbackMsg)
    this.name = "AppError"
    this.status = problem.status
    this.code = problem.code
    this.detail = problem.detail
    this.problem = problem
  }
}

export type HttpOptions = RequestInit & {
  onError?: (err: AppError) => void // para toasts globais
}

function mapFriendlyMessage(p?: Problem): string {
  switch (p?.code) {
    case "AUTH_TOKEN_MISSING":
    case "AUTH_INVALID":
      return "Sua sessão expirou. Faça login novamente."
    case "USER_NOT_FOUND":
      return "Não encontramos seu perfil."
    default:
      // fallback por status
      if (p?.status === 404) return "Recurso não encontrado."
      if (p?.status === 500) return "Erro interno do servidor."
      return p?.detail || p?.title || "Falha ao processar sua solicitação."
  }
}

export async function apiFetch<T = unknown>(
  input: RequestInfo | URL,
  init?: HttpOptions
): Promise<T> {
  const res = await fetch(input, { cache: "no-store", ...init })

  // OK → devolve JSON ou vazio
  if (res.ok) {
    const ct = res.headers.get("content-type") || ""
    return ct.includes("application/json")
      ? ((await res.json()) as T)
      : (undefined as T)
  }

  // Erro → tenta ler Problem Details; se não vier, cria um
  let problem: Problem | undefined
  try {
    if (res.headers.get("content-type")?.includes("application/problem+json")) {
      problem = await res.json()
    } else if (res.headers.get("content-type")?.includes("application/json")) {
      // Back pode não usar RFC 7807 sempre; ainda assim tentamos aproveitar
      problem = await res.json()
    }
  } catch {
    // ignore
  }
  problem = {
    status: res.status,
    title: res.statusText || "Erro",
    detail: problem?.detail || (await res.text().catch(() => "")) || undefined,
    code: problem?.code,
    ...problem,
  }

  const err = new AppError(problem)
  // dispara feedback global amigável:
  init?.onError?.(
    new AppError({ ...problem, title: mapFriendlyMessage(problem) })
  )

  throw err
}
