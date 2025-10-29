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

export default function BentoManageGrid({
  institutionId,
}: {
  institutionId: string
}) {
  const router = useRouter()
  const base = `/institutions/${institutionId}/manage`

  return (
    <div className=" mx-auto px-4 md:px-6 py-4 overflow-x-hidden overflow-y-visible">
      {/* 
        - grid-cols: 12 colunas no desktop (mais controle de tamanho)
        - auto-rows usa clamp para reduzir a altura e evitar overflow vertical
        - ajuste fino: se ainda houver scroll, abaixe 18vh -> 16vh
      */}
      <BentoGrid className="grid-cols-1 md:grid-cols-6 xl:grid-cols-12 auto-rows-[clamp(140px,18vh,200px)] gap-4">
        {/* HERO — largura total, mais baixo, 100% width */}
        <BentoCard
          name="Convidar pessoas"
          description="Envie convites, gere links e acompanhe pendências."
          Icon={Users2}
          cta="Expandir"
          onExpand={() => router.push(`${base}/invite`)}
          className="col-span-1 md:col-span-6 xl:col-span-12 [grid-row:span_2]" // ocupa 2 "linhas" do auto-rows
          background={
            <div className="relative h-[clamp(180px,22vh,260px)] w-full">
              <Image
                src="/manage/people-hero.png"
                alt=""
                fill
                className="object-cover opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent" />
            </div>
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
          name="Papéis de Usuário"
          description="Remova membros da instituição ou altere seus papéis (aluno, professor, admin)."
          Icon={UserCog}
          cta="Expandir"
          onExpand={() => router.push(`${base}/people`)}
          className="col-span-1 md:col-span-2 xl:col-span-4"
          background={
            <img
              src="/manage/roles-hero.png"
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
          }
        />
        <BentoCard
          name="Eventos"
          description="Calendário institucional e de disciplinas."
          Icon={CalendarDays}
          cta="Expandir"
          onExpand={() => router.push(`${base}/events`)}
          className="col-span-1 md:col-span-2 xl:col-span-4"
          background={
            <img
              src="/manage/events-hero.png"
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
          className="col-span-1 md:col-span-2 xl:col-span-4"
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
