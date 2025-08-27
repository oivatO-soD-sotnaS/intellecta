"use client";

import * as React from "react";
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";

/** Item que o hook do OriginUI costuma fornecer */
export type UploadedItem = {
  id: string;
  file: File;
  preview: string;
};

export type FileUploadHandle = {
  /** Retorna a lista de itens (com {id, file, preview}) */
  getFiles: () => UploadedItem[];
  /** Apenas os Files crus */
  getRawFiles: () => File[];
  /** Limpa todos os arquivos */
  clear: () => void;
};

type Props = {
  /** Aceita o mesmo formato do OriginUI (string com MIME types separados por vírgula) */
  accept?: string;
  /** Tamanho máximo em MB (default 5) */
  maxSizeMB?: number;
  /** Quantidade máxima de arquivos (default 6) */
  maxFiles?: number;
  /** Múltiplo (default true) */
  multiple?: boolean;
  /** Arquivos iniciais, se quiser pré-popular */
  initialFiles?: Array<{
    name: string;
    size: number;
    type: string;
    url: string;
    id: string;
  }>;
  /** Textos auxiliares */
  dropzoneLabel?: string;
  description?: string;
};

const DEFAULT_ACCEPT = "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif";

const FileUpload = React.forwardRef<FileUploadHandle, Props>(function FileUpload(
  {
    accept = DEFAULT_ACCEPT,
    maxSizeMB = 5,
    maxFiles = 6,
    multiple = true,
    initialFiles,
    dropzoneLabel = "Arraste as imagens aqui ou clique para selecionar",
    description,
  },
  ref
) {
  const maxSize = maxSizeMB * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    multiple,
    maxFiles,
    initialFiles,
  });

  // expõe API imperativa para o pai (modal)
  React.useImperativeHandle(ref, () => ({
    getFiles: () => files as unknown as UploadedItem[],
    getRawFiles: () => (files as unknown as UploadedItem[]).map((f) => f.file),
    clear: () => clearFiles(),
  }), [files, clearFiles]);

  return (
    <div className="flex flex-col gap-2">
      {/* Área de drop */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />

        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
          <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <ImageIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Solte suas imagens aqui</p>
          <p className="text-muted-foreground text-xs">
            SVG, PNG, JPG ou GIF (máx. {maxSizeMB}MB)
          </p>
          <Button variant="outline" className="mt-4" onClick={openFileDialog}>
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            {dropzoneLabel}
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          {(files as any[]).map((file: any) => (
            <div key={file.id} className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-accent aspect-square shrink-0 rounded">
                  <img src={file.preview} alt={file.file?.name ?? "preview"} className="size-10 rounded-[inherit] object-cover" />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-medium">{file.file?.name ?? file.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatBytes(file.file?.size ?? file.size ?? 0)}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={() => removeFile(file.id)}
                aria-label="Remover arquivo"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </div>
          ))}

          {files.length > 1 && (
            <div>
              <Button size="sm" variant="outline" onClick={clearFiles}>
                Remover todos
              </Button>
            </div>
          )}
        </div>
      )}

      {description ? (
        <p aria-live="polite" role="region" className="text-muted-foreground mt-2 text-center text-xs">
          {description}
        </p>
      ) : null}
    </div>
  );
});

export default FileUpload;
