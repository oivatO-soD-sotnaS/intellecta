import { Card, CardBody } from "@heroui/card"
import { BookOpen, ClipboardPenLine } from "lucide-react"
import type { SubjectDto } from "../schema/subjectSchema"

interface CourseCardProps {
  subject: SubjectDto
}

export default function CourseCard({ subject }: CourseCardProps) {
  return (
    <Card className="rounded-2xl hover:shadow-lg transition-shadow">
      <CardBody className="p-4">
        <h2 className="text-lg font-semibold mb-1">{subject.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{subject.teacherName}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <ClipboardPenLine className="w-4 h-4" />
          <span>{subject.activitiesCount} atividades</span>
          <BookOpen className="w-4 h-4" />
          <span>{subject.materialsCount} materiais</span>
        </div>
      </CardBody>
    </Card>
  )
}
