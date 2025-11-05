// app/(locale)/(private)/institutions/[id]/manage/institution/components/media/BannerCard.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Upload } from "lucide-react"

type Props = {
  bannerUrl?: string
  onSave: (files: { banner?: File | null }) => Promise<void>
}

export default function InstitutionBannerCard({ bannerUrl, onSave }: Props) {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    if (!file) return
    setPending(true)
    try {
      await onSave({ banner: file })
      setFile(null)
      setPreview(null)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm font-medium mb-3">Banner</div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border bg-muted">
        {preview || bannerUrl ? (
          <Image
            src={preview ?? bannerUrl!}
            alt=""
            fill
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer hover:bg-muted">
          <Upload className="size-4" />
          <span>Selecionar</span>
          <input
            type="file"
            accept="image/*"
            onChange={onPick}
            className="hidden"
          />
        </label>
        <Button onClick={handleSave} disabled={!file || pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  )
}
