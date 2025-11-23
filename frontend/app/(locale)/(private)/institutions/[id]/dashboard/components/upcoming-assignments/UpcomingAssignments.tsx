"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AssignmentItem } from "./assignment-item";

type Assignment = {
  assignment_id: string;
  title: string;
  description: string;
  deadline: string;
  subject_id: string;
  attachment: any | null;
};

// Skeleton
const AssignmentSkeleton = () => (
  <div className="flex items-start gap-4 rounded-lg p-3">
    <Skeleton className="h-12 w-12 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

// Componente principal
export default function UpcomingAssignments({
  institutionId,
}: {
  institutionId: string;
}) {
  const {
    data: assignments = [],
    isPending,
    error,
  } = useQuery<Assignment[]>({
    queryKey: ["institution", institutionId, "upcomingAssignments"],
    queryFn: async () => {
      const res = await fetch(
        `/api/institutions/${institutionId}/upcoming-assignments`
      );

      if(res.status === 404) return []
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    },
  });

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          Próximos Trabalhos
          {assignments.length > 0 && (
            <Badge className="ml-2" variant="secondary">
              {assignments.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      {/* LOADING */}
      {isPending && (
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <AssignmentSkeleton key={i} />
          ))}
        </CardContent>
      )}

      {/* ERROR */}
      {error && (
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar os trabalhos. Tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </CardContent>
      )}

      {/* EMPTY */}
      {!isPending && !error && assignments.length === 0 && (
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="font-semibold mb-2">Nenhum trabalho próximo</h3>

            <p className="text-sm text-muted-foreground mb-4">
              Nenhuma trabalho previsto para os próximos dias.
            </p>

            <Link
              href="/assignments"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              Ver todos os trabalhos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      )}

      {/* LISTA */}
      {assignments.length > 0 && (
        <>
          <CardContent className="max-h-96 overflow-y-scroll space-y-3">
            {assignments.slice(0, 5).map((assignment) => (
              <AssignmentItem
                key={assignment.assignment_id}
                assignment={assignment}
                institutionId={institutionId}
              />
            ))}
          </CardContent>

          <CardFooter>
            <div className="mt-4 pt-4 border-t w-full">
              <Link
                href="/assignments"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
              >
                Ver todos os trabalhos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
