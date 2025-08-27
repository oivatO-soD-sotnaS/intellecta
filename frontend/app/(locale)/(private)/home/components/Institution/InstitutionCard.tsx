"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { addToast } from "@heroui/toast";

import {
  MoreVertical, MapPin, Users, BookOpen, CalendarDays, Clock, Pencil, Trash2, Settings
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDatePtBR, formatNumber, timeAgo } from "@/lib/format";

import { useInstitutionSummary } from "@/hooks/institution/useInstitutionSummary";
import { EditInstitutionModal } from "./EditInstitutionModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

/** props básicas vindas da lista */
export type Institution = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null; // avatar
  isOwner?: boolean;
  bannerUrl?: string | null;
};

type Props = { institution: Institution; className?: string };

export function InstitutionCard({ institution, className }: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const { data: summary, isLoading, isError, error } = useInstitutionSummary(institution.id);



  const banner = summary?.banner?.url ?? institution.bannerUrl ?? undefined;
  const avatar = institution.imageUrl ?? summary?.profilePicture?.url ?? undefined;
  const role = summary?.role || (institution.isOwner ? "admin" : undefined);
  const status = summary?.status || "active";
  const members = formatNumber(summary?.membersCount);
  const subjects = formatNumber(summary?.subjectsCount);
  const created = formatDatePtBR(summary?.createdAt);
  const lastAct = timeAgo(summary?.lastActivityAt);

  return (
    <>
      <Card className={cn("overflow-hidden border-border bg-card shadow-md", className)}>
        {/* Banner */}
        <div className="relative h-44 w-full sm:h-52 md:h-56">
          {banner ? (
            // imagem de fundo
            // eslint-disable-next-line @next/next/no-img-element
            <img src={banner} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500" />
          )}
          {/* overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/30" />

          {/* badges topo */}
          <div className="absolute left-3 top-3 flex gap-2">
            {role && (
              <Badge color="danger" size="sm" variant="solid">
                {role === "admin" ? "Admin" : "Membro"}
              </Badge>
            )}
          </div>
          <div className="absolute right-3 top-3">
            <Popover isOpen={menuOpen} onOpenChange={setMenuOpen} placement="left-start">
              <PopoverTrigger>
                <Button isIconOnly size="sm" variant="flat" className="bg-border opacity-55 hover:opacity-100 backdrop-blur">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1">
                <div className="grid">
                  <Button variant="light" color="warning" className="justify-start gap-2" onPress={() => { setMenuOpen(false); setEditOpen(true); }}>
                    <Pencil className="h-4 w-4" /> Editar instituição
                  </Button>
                  <Button variant="light" className="justify-start gap-2" isDisabled>
                    {/* reservar para “Selecionar instituição” */}
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-border text-[10px]">✓</span>
                    Selecionar instituição
                  </Button>

                  <Button variant="light" className="justify-start gap-2">
                    <Settings  className="h-4 w-4"/> 
                  <Link
                      href={`/institutions/${institution.id}/settings`}
                      className="ml-3 hidden text-xs text-muted-foreground underline-offset-2 hover:underline sm:inline "
                    >
                      Configurações
                  </Link>
                </Button>
                <Button variant="light" color="danger" className="justify-start gap-2" onPress={() => { setMenuOpen(false); setDeleteOpen(true); }}>
                    <Trash2 className="h-4 w-4" /> Deletar instituição
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <CardContent className="p-4">
          {/* avatar sobreposto */}
          <div className="relative -mt-10 mb-3 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-xl ring-2 ring-background">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={institution.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <span className="text-base font-semibold">{institution.name?.[0]?.toUpperCase() ?? "I"}</span>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold">{institution.name}</h3>
                {status === "active" && (
                  <Badge size="sm" variant="solid" color="success">Ativa</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">Instituto</div>
            </div>
          </div>

          {/* infos */}
          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <Info icon={<MapPin className="h-3.5 w-3.5" />} text={summary?.city && summary?.state ? `${summary.city}, ${summary.state}` : "—"} />
            <Info icon={<Users className="h-3.5 w-3.5" />} text={`${members} membros`} />
            <Info icon={<BookOpen className="h-3.5 w-3.5" />} text={`${subjects} disciplinas`} />
            <Info icon={<CalendarDays className="h-3.5 w-3.5" />} text={`Criado em ${created}`} />
            <Info icon={<Clock className="h-3.5 w-3.5" />} text={lastAct !== "—" ? lastAct : "Sem atividade recente"} className="sm:col-span-2" />
          </div>


          {/* progresso */}
          {/* {typeof progress === "number" && (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress aria-label="Progresso da instituição" value={progress} className="h-2" />
            </div>
          )} */}

          {/* CTA */}
          <div className="mt-5">
            <Link
              href={`/institutions/${institution.id}`}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:w-full"
            >
              Acessar
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <EditInstitutionModal
        institutionId={institution.id}
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={() => {}}
      />
      <ConfirmDeleteModal
        institutionId={institution.id}
        name={institution.name}
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => {}}
      />
    </>
  );
}

/* sub */
function Info({ icon, text, className }: { icon: React.ReactNode; text: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-foreground/70">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}
