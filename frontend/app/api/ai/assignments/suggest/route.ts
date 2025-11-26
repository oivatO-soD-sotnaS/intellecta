// app/api/ai/assignments/suggest/route.ts
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
Você é uma IA que ajuda professores a criar atividades/avaliações dentro da plataforma educacional Intellecta.

REGRAS IMPORTANTES:
- Responda SEMPRE em português do Brasil.
- A saída deve ser APENAS um JSON válido, sem texto antes ou depois.
- O JSON deve ter exatamente estes campos:
  {
    "title": "título curto da atividade (ex.: Lista 01 - Funções do 1º grau, Projeto integrador sobre energia solar)",
    "description": "descrição em 2 a 5 frases explicando o objetivo da atividade, o que o aluno deve fazer e critérios gerais (sem entrar em detalhes excessivos de enunciados)."
  }
- Considere no seu texto o nível de ensino, disciplina, tema e tipo de atividade conforme o usuário descrever no prompt.
- Não explique o que está fazendo, não coloque comentários, não coloque markdown.
      `.trim(),
      input: prompt,
    })

    const text = response.output_text

    if (!text) {
      return NextResponse.json(
        {
          error: "Não foi possível obter texto da resposta da IA.",
        },
        { status: 500 }
      )
    }

    let data: { title: string; description: string }

    try {
      // Caso a IA devolva apenas o JSON
      data = JSON.parse(text)
    } catch {
      // Fallback: tenta extrair um bloco { ... } de dentro do texto
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
    console.error("[AI_ASSIGNMENT_SUGGEST_ERROR]", error)
    return NextResponse.json(
      {
        error: "Erro ao gerar sugestão de atividade com IA",
      },
      { status: 500 }
    )
  }
}
