// app/(locale)/(private)/home/components/HomeClient.tsx
"use client"

import React from "react"

import { UpcomingEvents } from "./UpcomingEvents"
import InstitutionsSection from "./Institution/InstitutionsSection"

export interface User {
  user_id: string
  full_name: string
  email: string
  profile_picture_id?: string
  profile_picture_url?: string
}

interface HomeClientProps {
  user: User
}

export default function HomeClient({ user }: HomeClientProps) {
  return (
    <div className="lg:max-w-9/12 container mx-auto px-6 py-8 lg:px-0 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-8">
          <InstitutionsSection />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <UpcomingEvents />
        </aside>
      </div>
    </div>
  )
}
