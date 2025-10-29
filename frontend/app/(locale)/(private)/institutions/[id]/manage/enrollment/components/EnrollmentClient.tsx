// app/(locale)/(private)/institutions/[id]/manage/enrollment/components/EnrollmentClient.tsx

"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users2, UserPlus, GraduationCap } from "lucide-react"
import { ClassSummary, ClassUser, InstitutionUser } from "./types"
import { MOCK_CLASS_USERS_BY_CLASS, MOCK_CLASSES, MOCK_INSTITUTION_USERS } from "./mocks"
import ClassSelect from "./ClassSelect"
import AddUsersPanel from "./AddUsersPanel"
import RosterTable from "./RosterTable"
import UserDetailsSheet from "./UserDetailsSheet"

export default function EnrollmentClient({
  institutionId,
}: {
  institutionId: string
}) {
  // Mocks
  const classes: ClassSummary[] = MOCK_CLASSES
  const allInstitutionUsers: InstitutionUser[] = MOCK_INSTITUTION_USERS

  const [classId, setClassId] = useState<string>(classes[0]?.class_id ?? "")
  const [rosters, setRosters] = useState<Record<string, ClassUser[]>>(
    MOCK_CLASS_USERS_BY_CLASS
  )
  const [details, setDetails] = useState<ClassUser | null>(null)

  const currentRoster = rosters[classId] ?? []

  const currentUserIds = useMemo(
    () => new Set(currentRoster.map((cu) => cu.user.user_id)),
    [currentRoster]
  )

  const availableInstitutionUsers = useMemo(
    () =>
      allInstitutionUsers.filter((iu) => !currentUserIds.has(iu.user.user_id)),
    [allInstitutionUsers, currentUserIds]
  )

  // KPIs
  const kpis = useMemo(() => {
    const total = currentRoster.length
    const admins = currentRoster.filter((cu) => cu.role === "admin").length
    const profs = currentRoster.filter((cu) => cu.role === "professor").length
    const alunos = currentRoster.filter((cu) => cu.role === "aluno").length
    return { total, admins, profs, alunos }
  }, [currentRoster])

  // Handlers (mock)
  const addUsersToClass = (userIds: string[]) => {
    if (!classId || !userIds.length) return
    const now = new Date().toISOString()
    const selected = allInstitutionUsers.filter((iu) =>
      userIds.includes(iu.user.user_id)
    )
    const toAppend: ClassUser[] = selected.map((iu) => ({
      class_users_id: `mock-${classId}-${iu.user.user_id}-${Date.now()}`,
      joined_at: now,
      class_id: classId,
      user_id: iu.user.user_id,
      role: iu.role, 
      user: iu.user,
    }))
    setRosters((prev) => ({
      ...prev,
      [classId]: [...(prev[classId] ?? []), ...toAppend],
    }))
  }

  const removeFromClass = (class_users_id: string) => {
    setRosters((prev) => ({
      ...prev,
      [classId]: (prev[classId] ?? []).filter(
        (cu) => cu.class_users_id !== class_users_id
      ),
    }))
  }

  const openDetails = (row: ClassUser) => setDetails(row)
  const closeDetails = () => setDetails(null)

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users2 className="h-4 w-4" /> Membros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{kpis.total}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Professores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{kpis.profs}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{kpis.alunos}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{kpis.admins}</p>
          </CardContent>
        </Card>
      </div>

      {/* Seleção de turma */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Selecionar Turma</CardTitle>
          <CardDescription>
            Escolha a turma para gerenciar matrículas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClassSelect
            classes={classes}
            value={classId}
            onChange={setClassId}
          />
        </CardContent>
      </Card>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        <AddUsersPanel
          institutionUsers={availableInstitutionUsers}
          onAdd={addUsersToClass}
        />

        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Membros da turma</CardTitle>
                <CardDescription>
                  Gerencie a lista de usuários da turma selecionada
                </CardDescription>
              </div>
            </div>
            <Separator className="mt-3" />
          </CardHeader>
          <CardContent>
            <RosterTable
              data={currentRoster}
              onRemove={removeFromClass}
              onOpen={openDetails}
            />
          </CardContent>
        </Card>
      </div>

      <UserDetailsSheet
        open={!!details}
        onOpenChange={(o) => !o && closeDetails()}
        classUser={details}
      />
    </div>
  )
}
