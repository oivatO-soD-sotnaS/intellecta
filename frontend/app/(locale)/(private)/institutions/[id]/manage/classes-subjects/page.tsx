// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/page.tsx
import ClassesSubjectsClient from "./components/ClassesSubjectsClient"

export default function Page({ params }: { params: { id: string } }) {
  return <ClassesSubjectsClient institutionId={params.id} />
}
