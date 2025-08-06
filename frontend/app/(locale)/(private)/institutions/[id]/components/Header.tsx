// app/(locale)/(private)/institution/[id]/components/Header.tsx
import Image from "next/image"
import { Card, CardBody } from "@heroui/card"
import type {
  InstitutionDto,
  InstitutionSummaryDto,
} from "../schema/institutionSchema"

interface InstitutionHeaderProps {
  institution: InstitutionDto
  summary: InstitutionSummaryDto
}

export default function InstitutionHeader({
  institution,
  summary,
}: InstitutionHeaderProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      {institution.bannerUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={institution.bannerUrl}
            alt={`${institution.name} banner`}
            fill
            className="object-cover"
          />
        </div>
      )}

      <CardBody  className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center">
          {institution.profilePictureUrl && (
            <Image
              src={institution.profilePictureUrl}
              alt={`${institution.name} logo`}
              width={64}
              height={64}
              className="rounded-full object-cover mr-4"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{institution.name}</h1>
            {institution.description && (
              <p className="mt-1 text-sm text-gray-600">
                {institution.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-6 text-center lg:mt-0">
          <div>
            <span className="block text-xl font-semibold">
              {summary.subjectsCount}
            </span>
            <span className="block text-sm text-gray-500">Disciplinas</span>
          </div>
          <div>
            <span className="block text-xl font-semibold">
              {summary.usersCount}
            </span>
            <span className="block text-sm text-gray-500">Usuários</span>
          </div>
          <div>
            <span className="block text-xl font-semibold">
              {summary.eventsCount}
            </span>
            <span className="block text-sm text-gray-500">Eventos</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
