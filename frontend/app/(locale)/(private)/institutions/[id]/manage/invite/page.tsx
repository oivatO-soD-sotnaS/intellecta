// app/(locale)/(private)/institutions/[id]/manage/invite/page.tsx

import InviteManageClient from "./components/InviteManageClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params
  return <InviteManageClient institutionId={id} />
}
