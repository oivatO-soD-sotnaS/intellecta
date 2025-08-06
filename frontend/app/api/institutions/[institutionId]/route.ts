import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_URL!

interface ParamsPromise {
  params: Promise<{ institutionId: string }>
}

export async function GET(req: NextRequest, { params }: ParamsPromise) {
  const { institutionId } = await params

  const response = await fetch(`${API}/institutions/${institutionId}`, {
    headers: { Authorization: req.headers.get("Authorization")! },
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: `Erro ao buscar instituição (status ${response.status})` },
      { status: response.status }
    )
  }

  const data = await response.json()
  return NextResponse.json(data)
}
