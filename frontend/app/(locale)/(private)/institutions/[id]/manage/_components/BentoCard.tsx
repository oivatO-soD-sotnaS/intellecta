// app/(locale)/(private)/institutions/[id]/manage/components/BentoCard.tsx
"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

type Props = {
  title: string
  description: string
  image: string
  icon: LucideIcon
  onExpand: () => void
}

export default function BentoCard({
  title,
  description,
  image,
  icon: Icon,
  onExpand,
}: Props) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="relative overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      <div className="relative h-40 w-full">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent" />
      </div>

      <div className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="pt-3">
          <Button
            onClick={onExpand}
            className="rounded-xl"
            // micro-transição que dá a sensação de “entrar”
            asChild={false}
          >
            Expandir
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
