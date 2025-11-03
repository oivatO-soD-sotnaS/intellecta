import EnrollmentManageClient from "./components/EnrollmentClient"

export default async function EnrollmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EnrollmentManageClient institutionId={id} />
}
