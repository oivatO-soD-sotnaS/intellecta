// app/(locale)/(private)/institutions/[id]/classes/[classId]/page.tsx
import ClassPageClient from "./components/ClassPageClient"

type PageProps = {
  params: Promise<{
    id: string
    classId: string
  }>
}

export default async function ClassPage(props: PageProps) {
  const { id, classId } = await props.params

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <ClassPageClient institutionId={id} classId={classId} />
    </div>
  )
}
