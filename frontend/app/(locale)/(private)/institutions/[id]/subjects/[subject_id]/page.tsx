import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import SubjectPageClient from "./components/SubjectPageClient"

interface SubjectPageProps {
  params: {
    locale: string
    institution_id: string
    subject_id: string
  }
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { locale, institution_id, subject_id } = params
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    // Ajuste a rota de login conforme o seu app
    redirect(`/${locale}/signin`)
  }

  return (
    <SubjectPageClient institutionId={institution_id} subjectId={subject_id} />
  )
}
