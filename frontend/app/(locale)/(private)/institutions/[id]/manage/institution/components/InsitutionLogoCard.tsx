// app/(locale)/(private)/institutions/[id]/manage/institution/components/media/LogoCard.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Avatar } from "@heroui/avatar"

type Props = {
  logoUrl?: string
  onSave: (files: { profilePicture?: File | null }) => Promise<void>
}

export default function InsitutionLogoCard({ logoUrl, onSave }: Props) {
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
      await onSave({ profilePicture: file })
      setFile(null)
      setPreview(null)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm font-medium mb-3">Logo</div>
      <div className="flex items-center gap-4">
        <Avatar
          src={preview ?? logoUrl}
          name="Logo"
          className="size-20 ring-2 ring-border"
        />
        <div className="flex items-center gap-2">
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
    </div>
  )
}
