// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/page.tsx

import SubjectForumClient from "./SubjectForumClient"

type PageParams = {
  locale: string
  id: string
  subject_id: string
}

export default async function SubjectForumPage(props: {
  params: Promise<PageParams>
}) {
  const params = await props.params
  const { id, subject_id } = params



  return (
    <SubjectForumClient
      institutionId={id}
      subjectId={subject_id}
      canPost={true}
    />
  )
}