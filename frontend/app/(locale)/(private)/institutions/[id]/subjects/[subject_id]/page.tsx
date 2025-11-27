import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import SubjectPageClient from "./components/SubjectPageClient"

interface SubjectPageProps {
  params: {
    locale: string
    id: string
    subject_id: string
  }
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { locale, id, subject_id } = await params 
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    // Ajuste a rota de login conforme o seu app
    redirect(`/sign-in`)
  }

  return <SubjectPageClient institutionId={id} subjectId={subject_id} />
}
