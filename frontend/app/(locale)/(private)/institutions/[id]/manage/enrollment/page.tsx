// app/(locale)/(private)/institutions/[id]/manage/enrollment/page.tsx
import EnrollmentClient from "./components/EnrollmentClient"

export default function Page({ params }: { params: { id: string } }) {
  return <EnrollmentClient institutionId={params.id} />
}
