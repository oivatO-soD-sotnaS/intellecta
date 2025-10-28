// app/(locale)/(private)/institutions/[id]/manage/page.tsx

import BentoManageGrid from "./_components/BentoManageGrid";

export default async function ManageLanding({ params }: { params: Promise<{ id: string }> } ) {
  const {id} = await params;

  return <BentoManageGrid institutionId={id} />
}
