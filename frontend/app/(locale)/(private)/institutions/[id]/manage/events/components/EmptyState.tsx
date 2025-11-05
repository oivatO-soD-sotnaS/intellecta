// app/(locale)/(private)/institutions/[id]/manage/events/_components/EmptyState.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

type Props = {
  title: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
}

export default function EmptyState({
  title,
  description,
  ctaLabel,
  onCta,
}: Props) {
  return (
    <div className="grid place-items-center rounded-xl border bg-background py-16 text-center">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        ) : null}
        {ctaLabel && onCta ? (
          <div className="pt-2">
            <Button onClick={onCta}>{ctaLabel}</Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
