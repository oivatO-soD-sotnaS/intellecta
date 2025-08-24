"use client"
import React, { ReactNode } from "react"

export function Step({ children }: { children: ReactNode }) {
  return <div className="px-6">{children}</div>
}
