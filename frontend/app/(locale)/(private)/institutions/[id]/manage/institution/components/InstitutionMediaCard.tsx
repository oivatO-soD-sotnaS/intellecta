// app/(locale)/(private)/institutions/[id]/manage/institution/components/media/MediaCard.tsx
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InsitutionLogoCard from "./InsitutionLogoCard"
import InstitutionBannerCard from "./InstitutionBannerCard"

type Props = {
  id?: string
  logoUrl?: string
  bannerUrl?: string
  onSave: (files: {
    profilePicture?: File | null
    banner?: File | null
  }) => Promise<void>
}

export default function InstitutionMediaCard({ id, logoUrl, bannerUrl, onSave }: Props) {
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Mídia</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsitutionLogoCard logoUrl={logoUrl} onSave={onSave} />
        <InstitutionBannerCard bannerUrl={bannerUrl} onSave={onSave} />
      </CardContent>
    </Card>
  )
}
