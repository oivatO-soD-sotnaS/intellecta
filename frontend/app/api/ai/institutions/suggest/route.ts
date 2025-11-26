// app/api/ai/institutions/suggest/route.ts
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt inválido" }, { status: 400 })
    }

    const response = await client.responses.create({
      // pode usar "gpt-4o-mini" ou "gpt-4.1-mini", por exemplo
      model: "gpt-4o-mini",
      instructions: `
Você é uma IA que ajuda a criar instituições educacionais dentro de uma plataforma chamada Intellecta.

REGRAS IMPORTANTES:
- Responda SEMPRE em português do Brasil.
- A saída deve ser APENAS um JSON válido, sem texto antes ou depois.
- O JSON deve ter exatamente estes campos:
  {
    "title": "nome curto da instituição (até ~60 caracteres)",
    "description": "descrição em 2 a 4 frases, tom profissional e acolhedor"
  }
- Não explique o que está fazendo, não coloque comentários, não coloque markdown.
      `.trim(),
      // Tudo o que o usuário escreveu sobre o estilo da instituição
      input: prompt,
    })

    const text = response.output_text

    if (!text) {
      return NextResponse.json(
        { error: "Não foi possível obter texto da resposta da IA." },
        { status: 500 }
      )
    }

    let data: { title: string; description: string }

    try {
      // Tentativa direta: a IA devolveu só o JSON certinho
      data = JSON.parse(text)
    } catch {
      // Fallback: se vier algo tipo texto + JSON, tenta extrair o bloco { ... }
      const match = text.match(/\{[\s\S]*\}/)
      if (!match) {
        return NextResponse.json(
          {
            error:
              "A IA não retornou um JSON válido. Tente reformular o prompt.",
            raw: text,
          },
          { status: 500 }
        )
      }

      data = JSON.parse(match[0])
    }

    return NextResponse.json(
      {
        title: data.title,
        description: data.description,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[AI_INSTITUTION_SUGGEST_ERROR]", error)
    return NextResponse.json(
      { error: "Erro ao gerar sugestão com IA" },
      { status: 500 }
    )
  }
}
