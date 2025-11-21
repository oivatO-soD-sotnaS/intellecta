// app/(locale)/(private)/institutions/[id]/manage/people/components/PeopleHeader.tsx
import { ArrowLeft, Users, MailPlus } from "lucide-react"
import Back from "../../_components/Back";

interface PeopleHeaderProps {
  institutionId: string
  total: number
  counts: { admin: number; teacher: number; student: number }
  onInviteClick?: () => void
  showInviteForm?: boolean
}

export default function PeopleHeader({
  total,
  counts,
  onInviteClick,
  showInviteForm = false,
  institutionId
}: PeopleHeaderProps) {

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Back hrefFallback={`/institutions/${institutionId}/manage`}/>

        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Pessoas</h1>
            <p className="text-foreground/50">
              {total} membros • {counts.admin} admin • {counts.teacher} teacher • {counts.student} student
            </p>
          </div>
        </div>
      </div>

      {onInviteClick && (
        <button
          onClick={onInviteClick}
          className={`
            inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
            ${showInviteForm
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
            }
          `}
        >
          <MailPlus className="h-4 w-4" />
          {showInviteForm ? "Ver Lista" : "Convidar Pessoas"}
        </button>
      )}
    </div>
  )
}