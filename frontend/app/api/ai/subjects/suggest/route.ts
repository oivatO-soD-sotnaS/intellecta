// app/api/ai/subjects/suggest/route.ts
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
      model: "gpt-4o-mini",
      instructions: `
Você é uma IA que ajuda professores a criar disciplinas (matérias) dentro de uma plataforma de ensino chamada Intellecta.

REGRAS IMPORTANTES:
- Responda SEMPRE em português do Brasil.
- A saída deve ser APENAS um JSON válido, sem texto antes ou depois.
- O JSON deve ter exatamente estes campos:
  {
    "name": "nome da disciplina (ex.: Matemática - 1º ano, Física III, Programação Web)",
    "description": "descrição em 1 a 3 frases explicando o foco, os principais conteúdos e o público-alvo da disciplina"
  }
- Não explique o que está fazendo, não coloque comentários, não coloque markdown.
      `.trim(),
      input: prompt,
    })

    const text = response.output_text

    if (!text) {
      return NextResponse.json(
        { error: "Não foi possível obter texto da resposta da IA." },
        { status: 500 }
      )
    }

    let data: { name: string; description: string }

    try {
      // caso a IA devolva só o JSON
      data = JSON.parse(text)
    } catch {
      // fallback: tenta extrair um bloco { ... } de dentro do texto
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
        name: data.name,
        description: data.description,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[AI_SUBJECT_SUGGEST_ERROR]", error)
    return NextResponse.json(
      { error: "Erro ao gerar sugestão de disciplina com IA" },
      { status: 500 }
    )
  }
}
