// components/AppAvatar.tsx
"use client"

import { Avatar } from "@heroui/avatar"

// Se o import for diferente no seu setup, use: import { Avatar } from "heroui";

type Props = {
  src?: string
  name?: string
  size?: "sm" | "md" | "lg"
  radius?: "none" | "sm" | "md" | "lg" | "full"
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  className?: string
}

// Gera iniciais para fallback
function initialsFromName(n?: string) {
  if (!n) return "U"
  const parts = n.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "U"
}

export default function AppAvatar({
  src,
  name,
  size = "md",
  radius = "full",
  color = "default",
  className,
}: Props) {
  return (
    <Avatar
      src={src}
      name={name}
      fallback={initialsFromName(name)}
      size={size}
      radius={radius}
      color={color}
      showFallback
      className={className}
    />
  )
}
