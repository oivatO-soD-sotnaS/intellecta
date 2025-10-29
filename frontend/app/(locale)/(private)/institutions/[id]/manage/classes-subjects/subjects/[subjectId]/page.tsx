import { use } from "react"
import SubjectDetailsClient from "../../components/subject/SubjectDetailsClient";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; subjectId: string }>
}) {
  const { id, subjectId } = use(params)
  return <SubjectDetailsClient institutionId={id} subjectId={subjectId} />
}