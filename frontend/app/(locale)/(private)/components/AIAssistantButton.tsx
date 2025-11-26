"use client"

import { useEffect, useState, ReactNode } from "react"
import {
  PopoverForm,
  PopoverFormButton,
  PopoverFormCutOutLeftIcon,
  PopoverFormCutOutRightIcon,
  PopoverFormSeparator,
  PopoverFormSuccess,
} from "@/components/ui/popover-form"
import { Sparkles } from "lucide-react"

type AssistantFormState = "idle" | "loading" | "success"

interface AIAssistantButtonProps {
  /** Rota da API que será chamada. Ex.: "/api/ai/institutions/suggest" */
  endpoint: string
  /** Método HTTP (default: "POST") */
  method?: "POST" | "GET"
  /** Função para montar o payload enviado para a API (default: { prompt }) */
  buildPayload?: (prompt: string) => unknown
  /** Callback chamado com o JSON retornado pela API */
  onSuccess?: (data: any) => void
  /** Desabilita / esconde o botão (ex.: enquanto form está salvando) */
  disable?: boolean

  /** Título mostrado no topo do popover (default: "IA") */
  title?: string
  /** Placeholder do textarea */
  textareaPlaceholder?: string
  /** Texto do botão de envio */
  submitLabel?: string
  /** Título da tela de sucesso */
  successTitle?: string
  /** Descrição da tela de sucesso */
  successDescription?: string

  /** Largura / altura do popover (passado para o PopoverForm) */
  width?: string
  height?: string

  /** Trigger customizado (se não passar, usa ícone Sparkles com estilo padrão) */
  trigger?: ReactNode
  /** Estilo do trigger padrão: "icon" (só ícone) ou "button" (botão com texto) */
  triggerStyle?: "icon" | "button"
  /** Texto do trigger quando triggerStyle="button" */
  triggerText?: string
}

export function AIAssistantButton({
  endpoint,
  method = "POST",
  buildPayload,
  onSuccess,
  disable = false,
  title = "IA",
  textareaPlaceholder = "Descreva aqui o que você quer que a IA faça...",
  submitLabel = "Gerar com IA",
  successTitle = "Sugestão criada!",
  successDescription = "Os campos foram preenchidos com a sugestão da IA. Revise antes de salvar.",
  width = "380px",
  height = "340px",
  trigger,
  triggerStyle = "icon",
  triggerText = "Assistente IA",
}: AIAssistantButtonProps) {
  const [formState, setFormState] = useState<AssistantFormState>("idle")
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState("")

  const isLoading = formState === "loading"
  const isSuccess = formState === "success"

  async function submit() {
    const value = prompt.trim()
    if (!value) return
    if (!endpoint) return

    setFormState("loading")

    try {
      const payload =
        buildPayload?.(value) ??
        (method === "POST" ? { prompt: value } : undefined)

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: method === "POST" ? JSON.stringify(payload) : undefined,
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => null)
        throw new Error(errJson?.error || res.statusText)
      }

      const data = await res.json()
      onSuccess?.(data)
      setFormState("success")
    } catch (error) {
      console.error("[AIAssistantButton] Erro:", error)
      setFormState("idle")
    } finally {
      // deixa alguns segundos pro usuário ver o "success" bonitinho
      setTimeout(() => {
        setOpen(false)
        setFormState("idle")
        setPrompt("")
      }, 2500)
    }
  }

  // ESC pra fechar e Ctrl+Enter / Cmd+Enter pra enviar
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "Enter" &&
        formState === "idle"
      ) {
        event.preventDefault()
        submit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, formState, prompt])

  if (disable) {
    return null
  }

  // Render trigger padrão baseado no triggerStyle
  const defaultTrigger =
    triggerStyle === "button" ? (
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{triggerText}</span>
      </button>
    ) : (
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-primary transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        aria-label="Assistente IA"
      >
        <Sparkles className="h-5 w-5" />
      </button>
    )

  return (
    <PopoverForm
      title={title}
      open={open}
      setOpen={setOpen}
      trigger={trigger ?? defaultTrigger}
      width={width}
      height={height}
      showCloseButton={!isSuccess}
      showSuccess={isSuccess}
      openChild={
        <div className="flex h-full flex-col">
          {/* Textarea Area */}
          <div className="flex-1 overflow-hidden p-4">
            <textarea
              autoFocus
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={textareaPlaceholder}
              disabled={isLoading}
              className="h-full w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Footer com botão de submit */}
          <div className="relative flex h-12 items-center border-t px-[10px]">
            <PopoverFormSeparator />

            {/* Cut-outs decorativos */}
            <div className="absolute left-0 top-0 -translate-x-[1.5px] -translate-y-1/2">
              <PopoverFormCutOutLeftIcon />
            </div>
            <div className="absolute right-0 top-0 translate-x-[1.5px] -translate-y-1/2 rotate-180">
              <PopoverFormCutOutRightIcon />
            </div>


            <PopoverFormButton
              text={submitLabel}
              loading={isLoading}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                submit()
              }}
            />
          </div>
        </div>
      }
      successChild={
        <PopoverFormSuccess
          title={successTitle}
          description={successDescription}
        />
      }
    />
  )
}
