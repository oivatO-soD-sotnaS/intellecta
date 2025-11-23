// app/(locale)/(private)/institutions/[id]/manage/components/BentoManageGrid.tsx
"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid" // seu componente (HeroUI+ajustes)
import {
  Users2,
  UserPlus,
  GraduationCap,
  Building2,
  CalendarDays,
  UserCog,
} from "lucide-react"
import { useInstitution } from "../layout"

export default function BentoManageGrid() {
  const { institution } = useInstitution()  

  const router = useRouter()
  const base = `/institutions/${institution.institution_id}/manage`

  return (
    <div className=" mx-auto px-4 md:px-6 py-4 overflow-x-hidden overflow-y-visible">
      <BentoGrid className="grid-cols-1 md:grid-cols-6 xl:grid-cols-12 auto-rows-[clamp(140px,18vh,200px)] gap-4">
        <BentoCard
          name="Gerenciar usuários"
          description="Remova membros da instituição ou altere seus papéis (aluno, professor, admin)."
          Icon={UserCog}
          cta="Expandir"
          onExpand={() => router.push(`${base}/people`)}
          className="col-span-1 md:col-span-6 xl:col-span-12"
          background={
            <img
              src="/manage/manage-users.png"
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
          }
        />
        {/* LINHA 2 — dois cards com larguras diferentes (como no exemplo) */}
        <BentoCard
          name="Matrículas"
          description="Adicione usuários às turmas rapidamente."
          Icon={UserPlus}
          cta="Expandir"
          onExpand={() => router.push(`${base}/enrollment`)}
          className="col-span-1 md:col-span-3 xl:col-span-7"
          background={
            <img
              src="/manage/enrollment-hero.png"
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
          }
        />
        <BentoCard
          name="Turmas e Disciplinas"
          description="Crie, edite e duplique turmas e disciplinas."
          Icon={GraduationCap}
          cta="Expandir"
          onExpand={() => router.push(`${base}/classes-subjects`)}
          className="col-span-1 md:col-span-3 xl:col-span-5"
          background={
            <img
              src="/manage/classes-hero.png"
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
          }
        />
        <BentoCard
          name="Instituição"
          description="Logo, nome e configurações avançadas."
          Icon={Building2}
          cta="Expandir"
          onExpand={() => router.push(`${base}/institution`)}
          className="col-span-1 md:col-span-6 xl:col-span-12"
          background={
            <img
              src="/manage/institution-hero.png"
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
          }
        />
      </BentoGrid>
    </div>
  )
}
