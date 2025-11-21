"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Badge } from "@/components/ui/badge";
import { useSubject } from "@/hooks/subjects/useSubject";
import { useRouter } from "next/navigation";

import { BookOpen, Clock, FileText } from "lucide-react";

// Assignment color
const assignmentColor =
  "bg-blue-100 text-blue-900 border-blue-200 hover:bg-blue-200";

const getAssignmentConfig = () => ({
  icon: BookOpen,
  label: "Trabalho",
  color: assignmentColor,
});

// Deadline + status
const parseDate = (deadline: string) => {
  const date = new Date(deadline);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const isLate = date.getTime() < today.getTime();

  let status: "today" | "tomorrow" | "late" | "none" = "none";

  if (isLate) status = "late";
  if (isToday) status = "today";
  if (isTomorrow) status = "tomorrow";

  return { date, status };
};

const statusLabel: Record<string, string> = {
  today: "Entrega hoje",
  tomorrow: "Entrega amanhã",
  late: "Atrasado",
  none: "",
};

const statusColor: Record<string, string> = {
  today: "bg-red-500/10 text-red-700 border-red-500/40",
  tomorrow: "bg-yellow-500/10 text-yellow-700 border-yellow-500/40",
  late: "bg-red-500/10 text-red-700 border-red-500/40",
  none: "hidden",
};

type Assignment = {
  assignment_id: string;
  title: string;
  description: string;
  deadline: string;
  subject_id: string;
  attachment: any | null;
};

export const AssignmentItem = ({
  assignment,
  institutionId,
}: {
  assignment: Assignment;
  institutionId: string;
}) => {
  const router = useRouter();
  const { date, status } = parseDate(assignment.deadline);
  const { icon: Icon, label, color } = getAssignmentConfig();

  const { data: subject } = useSubject(institutionId, assignment.subject_id);

  return (
    <Card
      shadow="sm"
      radius="lg"
      className="border bg-card transition-all hover:shadow-md"
    >
      {/* HEADER - Deadline */}
      <CardHeader className="flex justify-between items-center bg-muted/40 px-5 py-3 border-b">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{date.toLocaleDateString("pt-BR")}</span>
        </div>

        {status !== "none" && (
          <Badge className={`text-xs border ${statusColor[status]} hover:${statusColor[status]}`}>
            {statusLabel[status]}
          </Badge>
        )}
      </CardHeader>

      {/* BODY */}
      <CardBody className="flex flex-col gap-4 px-5 py-4">

        {/* Título + ícone */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2">
            <Icon className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {assignment.title}
          </h3>
        </div>

        {/* Disciplina */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary">
            {subject?.name ?? "Carregando disciplina..."}
          </span>

          {subject?.teacher && (
            <span className="text-xs text-muted-foreground mt-0.5">
              Professor(a): {subject.teacher.full_name}
            </span>
          )}
        </div>

        {/* Descrição */}
        {assignment.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {assignment.description}
          </p>
        )}

        {/* Attachment */}
        {assignment.attachment && (
          <div className="flex items-center gap-1 text-sm text-primary cursor-pointer hover:underline">
            <FileText className="w-4 h-4" />
            Ver anexo
          </div>
        )}

        {/* Type badge */}
        <Badge className={`w-fit text-xs border ${color}`}>{label}</Badge>
      </CardBody>

      {/* FOOTER - Ver Mais */}
      <CardFooter className="px-5 pb-4 pt-0 flex justify-end">
        <Button
          variant="flat"
          color="success"
          className="w-full"
          onPress={() =>
            router.push(
              `/institutions/${institutionId}/assignments/${assignment.assignment_id}`
            )
          }
        >
          Ver mais
        </Button>
      </CardFooter>
    </Card>
  );
};
