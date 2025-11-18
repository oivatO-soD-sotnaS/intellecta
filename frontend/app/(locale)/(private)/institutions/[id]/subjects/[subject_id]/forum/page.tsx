// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/page.tsx

import SubjectForumClientMock from "./components/mock/SubjectForumClient"
import SubjectForumClient from "./SubjectForumClient"

type PageParams = {
  locale: string
  institution_id: string
  subject_id: string
}

export default async function SubjectForumPage(props: {
  params: Promise<PageParams>
}) {
  const { institution_id, subject_id } = await props.params

  // Aqui a página server só delega para o client.
  // Se você já tiver info de role na camada server, pode passar um canPost aqui.
  return (
    <SubjectForumClient
      institutionId={institution_id}
      subjectId={subject_id}
      // canPost={true} // TODO: ligar com a role de professor se quiser decidir no server
    />
  )
}
