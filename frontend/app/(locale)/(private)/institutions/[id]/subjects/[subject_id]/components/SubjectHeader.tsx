import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SubjectHeaderProps {
  institutionId: string
  subject?: any
  isLoading?: boolean
  institutionName: string
}

export default function SubjectHeader({
  institutionId,
  subject,
  isLoading,
  institutionName,
}: SubjectHeaderProps) {
  if (isLoading || !subject) {
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

  const subjectName: string = subject.name ?? "Disciplina sem nome"
  const subjectDescription: string =
    subject.description ?? "Disciplina cadastrada na instituição."

  const teacherName: string =
    subject.teacher?.full_name ?? "Professor não informado"

  const banner =
    typeof subject.banner === "object"
      ? subject.banner?.url
      : (subject.banner ?? null)

  const profilePicture =
    typeof subject.profile_picture === "object"
      ? subject.profile_picture?.url
      : (subject.profile_picture ??
        (typeof subject.teacher?.profile_picture === "object"
          ? subject.teacher.profile_picture?.url
          : (subject.teacher?.profile_picture ?? null)))

  const initials = subjectName
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  
 const institutionLabel = institutionName ?? institutionId


  return (
    <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
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

        {/* overlay para deixar texto legível */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-background/0" />

        {/* badge "Disciplina" no canto superior direito */}
        <div className="pointer-events-none absolute right-4 top-4 flex gap-2">
          <Badge
            variant="outline"
            className="pointer-events-auto border-emerald-200 bg-emerald-50/90 text-[11px] font-semibold uppercase tracking-wide text-emerald-800"
          >
            Disciplina
          </Badge>
        </div>
      </div>

      {/* parte branca de baixo – igual header da turma */}
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
                Instituição: {institutionLabel}
              </span>
                <span className="rounded-full border border-border/70 px-2 py-[2px] font-mono">
                  Prof.{teacherName}
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
