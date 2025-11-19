import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SubjectHeaderProps {
  institutionId: string
  subject?: any
  isLoading?: boolean
}

export default function SubjectHeaderMock({
  institutionId,
  subject,
  isLoading,
}: SubjectHeaderProps) {
  // 👉 Se estiver carregando, mostra só o skeleton
  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="relative h-32 w-full md:h-40">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
        <div className="space-y-3 px-6 pb-6 pt-4">
          <div className="-mt-10 flex items-end gap-4">
            <Skeleton className="h-16 w-16 rounded-xl border-4 border-background" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-3 w-80" />
        </div>
      </section>
    )
  }

  // 🔥 MOCK: se não tiver subject, usamos valores de exemplo
  const subjectName: string =
    subject?.name ?? "Matemática I — Funções Afim e Quadrática"

  const subjectDescription: string =
    subject?.description ??
    "Disciplina introdutória focada em funções afim e quadrática, com aplicações em problemas do cotidiano e exercícios de fixação."

  const teacherName: string =
    subject?.teacher?.full_name ?? "Prof. Jorge Amado"

  // banner mockado (ou o real se vier no subject)
  const banner: string | null =
    typeof subject?.banner === "object"
      ? subject?.banner?.url
      : (subject?.banner ?? null) // se quiser, depois troca por uma imagem real

  // profile_picture mockado (ou o real se vier)
  const profilePicture: string | null =
    typeof subject?.profile_picture === "object"
      ? subject?.profile_picture?.url
      : (subject?.profile_picture ??
        (typeof subject?.teacher?.profile_picture === "object"
          ? subject?.teacher?.profile_picture?.url
          : (subject?.teacher?.profile_picture ?? null)))

  const initials = subjectName
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const subjectIdLabel: string =
    subject?.subject_id ?? "00000000-0000-0000-0000-000000000000"

  return (
    <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      {/* faixa de cima: banner ou gradiente */}
      <div className="relative h-32 w-full md:h-40">
        {banner ? (
          <Image
            src={banner}
            alt={`Banner da disciplina ${subjectName}`}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-200" />
        )}

        {/* overlay para leitura do texto */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-background/0" />

        {/* badge "Disciplina" */}
        <div className="pointer-events-none absolute right-4 top-4 flex gap-2">
          <Badge
            variant="outline"
            className="pointer-events-auto border-emerald-200 bg-emerald-50/90 text-[11px] font-semibold uppercase tracking-wide text-emerald-800"
          >
            Disciplina
          </Badge>
        </div>
      </div>

      {/* parte inferior */}
      <div className="space-y-3 px-6 pb-6 pt-4">
        <div className="-mt-10 flex flex-wrap items-end gap-4">
          <Avatar className="h-16 w-16 rounded-xl border-4 border-background md:h-20 md:w-20">
            {profilePicture && (
              <AvatarImage src={profilePicture} alt={subjectName} />
            )}
            <AvatarFallback className="rounded-xl bg-emerald-50 text-base font-semibold text-emerald-700">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-semibold leading-tight md:text-2xl">
                {subjectName}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground md:text-xs">
              <span className="rounded-full border border-border/70 px-2 py-[2px] font-mono">
                Instituição: IFPR Campus Foz do Iguaçu
              </span>
              <span className="rounded-full border border-border/70 px-2 py-[2px] font-mono">
                {teacherName}
              </span>
            </div>
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {subjectDescription}
        </p>
      </div>
    </section>
  )
}
