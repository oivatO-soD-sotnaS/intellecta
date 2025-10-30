"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type BackProps = {
  hrefFallback?: string
  label?: string
  className?: string
  disablePrefetch?: boolean
  onClick?: () => void
}

export default function Back({
  hrefFallback,
  label = "Voltar",
  className,
  disablePrefetch,
  onClick,
}: BackProps) {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = (params?.id as string) || ""
  const manageRoot = `/institutions/${id}/manage`
  const fallback = hrefFallback ?? manageRoot

  useEffect(() => {
    if (!disablePrefetch && fallback) router.prefetch(fallback)
  }, [disablePrefetch, fallback, router])

  const canGoBack = () => {
    if (typeof window === "undefined") return false
    const { history, referrer, location } = window
    return (
      history.length > 1 && !!referrer && referrer.startsWith(location.origin)
    )
  }

  const handleClick = () => {
    onClick?.()
    if (canGoBack()) router.back()
    else router.push(fallback)
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-2xl",
        "border border-border/60 bg-muted/50 px-3.5 py-2 text-sm font-medium",
        "text-muted-foreground hover:text-foreground shadow-sm hover:shadow-md",
        "transition-all duration-200 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        // brilho diagonal suave
        "overflow-hidden",
        "after:pointer-events-none after:absolute after:inset-y-0 after:left-[-40%]",
        "after:w-1/3 after:-skew-x-12 after:bg-gradient-to-r",
        "after:from-transparent after:via-white/10 after:to-transparent",
        "after:opacity-0 after:transition-all after:duration-500",
        "group-hover:after:opacity-100 group-hover:after:translate-x-[220%]",
        "cursor-pointer",
        className
      )}
      aria-label={label}
    >
      <span
        className={cn(
          "grid place-items-center rounded-xl p-1.5",
          "bg-background/70 ring-1 ring-border/50",
          "transition-transform duration-200 group-hover:-translate-x-0.5"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
      </span>
      <span className="tracking-[-0.01em]">{label}</span>
    </motion.button>
  )
}
