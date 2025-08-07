// app/(locale)/(private)/institution/[id]/components/Overview.tsx
import { Card, CardBody } from "@heroui/card"
import type { InstitutionSummaryDto } from "../schema/institutionSchema"

interface OverviewProps {
  summary: InstitutionSummaryDto
}

export default function Overview({ summary }: OverviewProps) {

  console.log("Overview Summary: ", summary);
  
  const items = [
    { label: "Disciplinas", value: summary.subjectsCount },
    { label: "Usuários", value: summary.usersCount },
    { label: "Eventos", value: summary.eventsCount },
  ]

  console.log("Overview Items: ", items)


  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map(({ label, value }) => (
        <Card key={label} className="rounded-2xl">
          <CardBody className="flex flex-col items-center py-6">
            <span className="text-3xl font-bold">{value}</span>
            <span className="mt-1 text-sm text-gray-500">{label}</span>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
