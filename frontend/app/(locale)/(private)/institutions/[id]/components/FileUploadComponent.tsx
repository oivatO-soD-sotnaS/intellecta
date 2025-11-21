"use client"

import { AlertCircleIcon, PaperclipIcon, UploadIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatBytes } from "@/hooks/use-file-upload"

interface FileUploadComponentProps {
  label?: string
  maxSize: number
  file: any | null
  errors: string[]
  isDragging: boolean
  openFileDialog: () => void
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  getInputProps: () => any
  removeFile: (id: string) => void
}

export function FileUploadComponent({
  label = "Anexo (opcional)",
  maxSize,
  file,
  errors,
  isDragging,
  openFileDialog,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  getInputProps,
  removeFile,
}: FileUploadComponentProps) {
  return (
    <div className="space-y-1 cursor-pointer ">
      <label className="text-xs font-medium text-foreground">{label}</label>

      {/* Drop area */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload file"
          disabled={Boolean(file)}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
            aria-hidden="true"
          >
            <UploadIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload de arquivo</p>
          <p className="text-xs text-muted-foreground">
            Arraste e solte ou clique para procurar (máx. {formatBytes(maxSize)}
            )
          </p>
        </div>
      </div>

      {/* Erros */}
      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span className="truncate">{errors[0]}</span>
        </div>
      )}

      {/* Arquivo selecionado */}
      {file && (
        <div className="w-full">
          <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
            <PaperclipIcon
              className="size-4 shrink-0 opacity-60"
              aria-hidden="true"
            />

            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-medium truncate overflow-hidden text-ellipsis whitespace-nowrap"
                title={file.file.name}
                style={{ maxWidth: "100%" }}
              >
                {file.file.name}
              </p>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="shrink-0 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                removeFile(file.id)
              }}
              aria-label="Remover arquivo"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
