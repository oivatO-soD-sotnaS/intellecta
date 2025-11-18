import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SubjectHeaderProps {
  institutionId: string
  // subject vem de useSubject – deixamos como any pra você ajustar depois caso tenha o tipo
  subject?: any
  isLoading?: boolean
}

export default function SubjectHeader({
  institutionId,
  subject,
  isLoading,
}: SubjectHeaderProps) {
  if (isLoading && !subject) {
    return (
      <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="relative h-32 w-full md:h-40">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
        <div className="space-y-3 px-6 pb-6 pt-4">
          <div className="-mt-12 flex items-end gap-4">
            <Skeleton className="h-20 w-20 rounded-full border-4 border-background" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-4 w-80" />
        </div>
      </section>
    )
  }

  if (!subject) return null

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
          <div className="h-full w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-background/0" />

        <div className="pointer-events-none absolute right-4 top-4 flex gap-2">
          <Badge
            variant="outline"
            className="pointer-events-auto border-emerald-200 bg-emerald-50/90 text-[11px] font-semibold uppercase tracking-wide text-emerald-800"
          >
            Disciplina
          </Badge>
        </div>
      </div>

      <div className="space-y-3 px-6 pb-6 pt-4">
        <div className="-mt-12 flex flex-wrap items-end gap-4">
          <Avatar className="h-20 w-20 border-4 border-background md:h-24 md:w-24">
            {profilePicture && (
              <AvatarImage src={profilePicture} alt={subjectName} />
            )}
            <AvatarFallback className="bg-emerald-600 text-lg font-semibold text-emerald-50">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="truncate text-xl font-semibold leading-tight md:text-2xl">
              {subjectName}
            </h1>
            <p className="truncate text-xs text-muted-foreground md:text-sm">
              {teacherName}
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground md:text-xs">
              <span className="rounded-full border border-border/70 px-2 py-[2px] font-mono">
                Instituição: {institutionId}
              </span>
              {subject.subject_id && (
                <span className="rounded-full border border-border/70 px-2 py-[2px] font-mono">
                  ID da disciplina: {subject.subject_id}
                </span>
              )}
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
