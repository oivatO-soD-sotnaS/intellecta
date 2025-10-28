// components/ui/bento-grid.tsx
import Link from "next/link"
import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

export interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background: ReactNode
  Icon: LucideIcon | React.ElementType
  description: string
  href?: string
  cta?: string
  onExpand?: () => void
}

export const BentoGrid = ({
  children,
  className,
  ...props
}: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full gap-4",
        // layout responsivo: 1 col no mobile, 6 cols do sm+ pra cima
        "grid-cols-1 sm:grid-cols-6",
        // controla a altura base de cada “faixa” de linha (cards altos = row-span-2, etc.)
        "auto-rows-[18rem] md:auto-rows-[20rem]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const Action = ({
  href,
  cta = "Expandir",
  onExpand,
  name,
  className = "pointer-events-auto p-0",
}: {
  href?: string
  cta?: string
  onExpand?: () => void
  name: string
  className?: string
}) => {
  if (onExpand) {
    return (
      <Button
        variant="link"
        size="sm"
        className={className}
        onClick={onExpand}
        aria-label={`Abrir ${name}`}
      >
        {cta}
        <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
      </Button>
    )
  }
  if (href) {
    return (
      <Button variant="link" asChild size="sm" className={className}>
        <Link href={href} aria-label={`Abrir ${name}`}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </Link>
      </Button>
    )
  }
  return null
}

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta = "Expandir",
  onExpand,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      // base visual
      "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
      // span default: ocupa 3 colunas em telas sm+ (fica “médio”)
      "sm:col-span-3",
      className
    )}
    {...props}
  >
    {/* hero/background */}
    <div className="relative h-40 w-full overflow-hidden">
      {background}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent" />
    </div>

    {/* texto + ação */}
    <div className="p-6">
      <div className="cursor pointer z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
        <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          {name}
        </h3>
        <p className="max-w-lg text-neutral-400">{description}</p>
      </div>

      {/* ação mobile visível sempre */}
      <div className="pointer-events-none mt-2 flex w-full lg:hidden">
        <Action href={href} onExpand={onExpand} cta={cta} name={name} />
      </div>
    </div>

    {/* ação desktop no hover */}
    <div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
      <Action href={href} onExpand={onExpand} cta={cta} name={name} />
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
)
