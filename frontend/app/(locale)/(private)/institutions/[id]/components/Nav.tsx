"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { label: "Dashboard", href: "./dashboard" },
  { label: "Disciplinas", href: "./subjects" },
  { label: "Membros", href: "./members" },
  { label: "Configurações", href: "./settings" },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-border bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-2 h-12">
          {items.map((it) => {
            const active =
              pathname.endsWith(it.href) || pathname.endsWith(`${it.href}/`)
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md px-3 text-sm",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {it.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
