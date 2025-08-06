// app/(locale)/(private)/institution/[id]/layout.tsx
import React from "react"

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <div className="px-6 py-4">{children}</div>
    </>
  )
}
