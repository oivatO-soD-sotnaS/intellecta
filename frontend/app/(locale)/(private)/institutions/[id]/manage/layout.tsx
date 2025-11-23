"use client"

import React from "react"
import { useInstitution } from "../layout"
import Forbidden from "@/app/forbidden"

export default function InstitutionManageLayout({ children }: { children: React.ReactNode }) {
    const { institution, me } = useInstitution()
    
    if (me.role !== "admin") return <Forbidden getBackTo={`/institutions/${institution.institution_id}`}/>
  
    return (
        <>{children}</>
    )
}
