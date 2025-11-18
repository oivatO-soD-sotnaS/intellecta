"use client";

import type { InstitutionSummary } from "@/types/institution";

import * as React from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import { addToast } from "@heroui/toast";
import { Search } from "lucide-react";

import { InstitutionCard } from "./InstitutionCard";
import { CreateInstitutionButton } from "./CreateInstitutionButton";
import { InstitutionModal } from "./InstitutionModal";
import { EmptyState } from "./EmptyState";

import { Card, CardContent } from "@/components/ui/card";
import { useInstitutionsOwned } from "@/hooks/institution/useInstitutionsOwned";
import { useInstitutionsSummaries } from "@/hooks/institution/useInstitutionSummaries";

/* ---------------- helpers fora do componente ---------------- */

const SKELETON_COUNT = 6;

function getErrorMessage(
  err: unknown,
  fallback = "Não foi possível carregar suas instituições.",
) {
  if (typeof err === "string") return err;
  if (err instanceof Error && err.message) return err.message;
  try {
    const any = err as any;

    if (any?.message) return String(any.message);
  } catch {}

  return fallback;
}

function SkeletonGrid() {
  return (
    <ul className="grid grid-cols-1 gap-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <li key={i} className="w-full">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="mt-2 h-3 w-1/5 rounded" />
              </div>
            </div>
            <Skeleton className="mt-4 h-36 w-full rounded-xl" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------- componente --------------------------- */

export default function InstitutionsSection() {
  const [tab, setTab] = React.useState<"all" | "owned">("all");
  const [q, setQ] = React.useState("");
  const [isModalOpen, setModalOpen] = React.useState(false);

  const allQuery = useInstitutionsSummaries();
  const ownedQuery = useInstitutionsOwned();

  // toasts de erro (HeroUI)
  React.useEffect(() => {
    if (allQuery.isError) {
      addToast({
        title: "Erro ao carregar instituições",
        description: getErrorMessage(allQuery.error),
        color: "danger",
        variant: "flat",
      });
    }
  }, [allQuery.isError]);

  React.useEffect(() => {
    if (ownedQuery.isError) {
      addToast({
        title: "Erro ao carregar instituições (proprietário)",
        description: getErrorMessage(ownedQuery.error),
        color: "danger",
        variant: "flat",
      });
    }
  }, [ownedQuery.isError]);

  const isLoading = tab === "all" ? allQuery.isLoading : ownedQuery.isLoading;
  const isError = tab === "all" ? allQuery.isError : ownedQuery.isError;

  const list = tab === "all" ? (allQuery.data ?? []) : (ownedQuery.data ?? []);

  const filtered: InstitutionSummary[] = React.useMemo(() => {
    const term = q.trim().toLowerCase();

    if (!term) return list;

    return list.filter(
      (i) =>
        i.name.toLowerCase().includes(term) ||
        i.email.toLowerCase().includes(term),
    );
  }, [list, q]);

  const handleCreate = React.useCallback(() => {
    // atualiza as listas e dá feedback
    Promise.allSettled([allQuery.refetch(), ownedQuery.refetch()]);
    addToast({
      title: "Instituição criada",
      description: "Sua instituição foi criada com sucesso.",
      color: "success",
      variant: "flat",
    });
  }, [allQuery, ownedQuery]);

  return (
    <Card className="border-border">
      <CardContent className="p-4 sm:p-5">
        {/* header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold sm:text-lg">
              Minhas Instituições
            </h3>
            <p className="text-sm text-muted-foreground">
              Gerencie e acesse rapidamente suas instituições.
            </p>
          </div>
          <CreateInstitutionButton onClick={() => setModalOpen(true)} />
        </div>

        {/* controles */}
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Tabs
            aria-label="Filtro de instituições"
            className="sm:col-span-1"
            selectedKey={tab}
            onSelectionChange={(k) => setTab(k as "all" | "owned")}
          >
            <Tab key="all" title="Todas" />
            <Tab key="owned" title="Proprietário" />
          </Tabs>

          <div className="sm:col-span-2">
            <Input
              classNames={{
                inputWrapper:
                  "bg-background border-border h-10 shadow-sm focus-within:ring-2 focus-within:ring-primary",
                input: "text-sm placeholder:text-muted-foreground/70",
              }}
              placeholder="Buscar por nome ou e-mail…"
              radius="full"
              size="sm"
              startContent={
                <Search className="h-4 w-4 text-muted-foreground" />
              }
              value={q}
              variant="bordered"
              onValueChange={setQ}
            />
          </div>
        </div>

        {/* conteúdo */}
        <div className="mt-4">
          {isLoading ? (
            <SkeletonGrid />
          ) : isError ? (
            <EmptyState
              description="Tente novamente em instantes."
              primaryText="Tentar novamente"
              title="Não foi possível carregar suas instituições."
              variant="error"
              onPrimaryClick={() =>
                tab === "all" ? allQuery.refetch() : ownedQuery.refetch()
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              description={
                tab === "owned"
                  ? "Crie a primeira e convide sua equipe."
                  : "Peça um convite ao administrador ou crie a sua agora mesmo."
              }
              primaryHref="/institutions/create"
              primaryText="Criar instituição"
              title={
                tab === "owned"
                  ? "Você ainda não criou instituições."
                  : "Você ainda não participa de nenhuma instituição."
              }
              variant="empty"
            />
          ) : (
            <ul className="grid grid-cols-1 gap-4">
              {filtered.map((i) => (
                <li key={i.institution_id} className="w-full">
                  <InstitutionCard className="w-full" institution={i} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <InstitutionModal
          isOpen={isModalOpen}
          onCreate={handleCreate}
          onOpenChange={setModalOpen}
        />
      </CardContent>
    </Card>
  );
}
