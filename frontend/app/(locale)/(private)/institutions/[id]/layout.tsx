"use client"

import { useQuery } from "@tanstack/react-query"
import { Spinner } from "@heroui/spinner"

import SidebarProviderClient from "./components/SidebarProviderClient"
import SidebarRailClient from "./components/SidebarRailClient"
import InstitutionSidebarContent from "./components/InstitutionSidebarContent"

import React, { createContext, useContext } from "react"
import { ApiInstitution } from "@/types/institution"
import { unauthorized, useParams } from "next/navigation"
import Forbidden from "@/app/forbidden"
import NotFound from "@/app/not-found"

export type InstitutionUserMe = {
  institution_user_id: string
  role: "admin" | "teacher" | "student"
  joined_at: string
  institution_id: string
  user_id: string
}

interface InstitutionContextType {
  institution: ApiInstitution
  me: InstitutionUserMe
}

const InstitutionContext = createContext<InstitutionContextType | null>(null)

export function InstitutionProvider({
  children,
  institution,
  me
}: {
  children: React.ReactNode
  institution: ApiInstitution
  me: InstitutionUserMe
}) {
  return (
    <InstitutionContext.Provider value={{ institution, me }}>
      {children}
    </InstitutionContext.Provider>
  )
}

export function useInstitution() {
  const ctx = useContext(InstitutionContext)
  if (!ctx) {
    throw new Error("useInstitution must be used inside InstitutionProvider")
  }
  return ctx
}

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const institutionId = params.id as string

  const {
    data: me,
    isPending: isMePending,
    error: meError
  } = useQuery<InstitutionUserMe>({
    queryKey: ["institution", institutionId, "user", "me"],
    queryFn: async () => {
      const r = await fetch(`/api/institutions/${institutionId}/users/me`)
      if (!r.ok) throw new Error(String(r.status))

      return r.json()
    }
  })

  const {
    data: institution,
    isPending: isInstitutionPending,
    error: institutionError
  } = useQuery<ApiInstitution>({
    queryKey: ["institution", institutionId],
    queryFn: async () => {
      const r = await fetch(`/api/institutions/${institutionId}`)
      if (!r.ok) throw new Error(String(r.status))
      return r.json()
    }
  })

  if (isMePending || isInstitutionPending) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-muted-foreground text-lg">
            Carregando instituição...
          </p>
        </div>
      </div>
    )
  }

  const errorToShow = meError || institutionError

  console.log(meError?.message, institutionError?.message)

  if (errorToShow) {
    const status = Number((errorToShow as Error).message)

    if (status === 403) {
      return <Forbidden />
    }

    if (status === 404) {
      return <NotFound />
    }

    if (status === 401) {
      unauthorized()
    }

    throw errorToShow
  }

  return (
    <InstitutionProvider institution={institution!} me={me!}>
      <div className="w-full">
        <div className="px-3 sm:px-4 py-6">
          <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
            <SidebarProviderClient>
              <SidebarRailClient>
                <InstitutionSidebarContent />
              </SidebarRailClient>
            </SidebarProviderClient>
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </InstitutionProvider>
  )
}
