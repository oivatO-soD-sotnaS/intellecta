// Updated NotificationsPage with new filters, enriched table UI, event info, and color badges

"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { Card } from "@heroui/card";

import { timeAgo } from "@/lib/format";
import {
  Eye,
  Check,
  Filter,
  XCircle,
  CalendarDays,
  Clock,
  Tag,
  ClipboardList,
} from "lucide-react";

const eventTypes = [
  "exam",
  "quiz",
  "assignment",
  "lecture",
  "workshop",
  "seminar",
  "presentation",
  "deadline",
  "holiday",
  "announcement",
  "cultural",
  "sports",
  "other",
];

// mapping colors for event types
const typeColors: Record<string, string> = {
  exam: "bg-red-100 text-red-700",
  quiz: "bg-blue-100 text-blue-700",
  assignment: "bg-emerald-100 text-emerald-700",
  lecture: "bg-indigo-100 text-indigo-700",
  workshop: "bg-amber-100 text-amber-700",
  seminar: "bg-purple-100 text-purple-700",
  presentation: "bg-pink-100 text-pink-700",
  deadline: "bg-orange-100 text-orange-700",
  holiday: "bg-green-100 text-green-700",
  announcement: "bg-gray-100 text-gray-700",
  cultural: "bg-fuchsia-100 text-fuchsia-700",
  sports: "bg-teal-100 text-teal-700",
  other: "bg-slate-100 text-slate-700",
};

export default function NotificationsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  const enforceDefaults = () => {
    const newParams = new URLSearchParams(params.toString());
    if (!newParams.get("limit")) newParams.set("limit", "10");
    if (!newParams.get("offset")) newParams.set("offset", "0");
    return newParams;
  };

  const safeParams = enforceDefaults();

  const getParam = (key: string) => safeParams.get(key) || "";

  const setParam = (key: string, value: string) => {
    const newParams = enforceDefaults();
    if (!value) newParams.delete(key);
    else newParams.set(key, value);
    router.push(`/notifications?${newParams.toString()}`);
  };

  const limit = Number(getParam("limit"));
  const offset = Number(getParam("offset"));

  // Fetch
  const { data, isPending } = useQuery({
    queryKey: ["notifications", safeParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/me/notifications?${safeParams.toString()}`);
      if (!res.ok) throw new Error("Erro ao buscar notificações");
      return res.json();
    },
  });

  const notifications = data?.records || [];
  const totalRecords = data?.paging?.total_records || 0;

  const totalPages = Math.ceil(totalRecords / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const unreadCount = notifications.filter((n: any) => !n.seen).length;

  const markAsSeen = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/me/notifications/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Erro ao marcar notificação");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const handlePageChange = (page: number) => setParam("offset", String((page - 1) * limit));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Notificações</h1>

      {/* FILTERS */}
      <Card className="p-5 space-y-5 shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filtros
          </h2>

          <Button
            variant="light"
            startContent={<XCircle />}
            onPress={() => router.push("/notifications?limit=10&offset=0")}
          >
            Limpar filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Título"
            value={getParam("title")}
            onValueChange={(v) => setParam("title", v)}
          />

          <Input
            label="Descrição"
            value={getParam("event_description")}
            onValueChange={(v) => setParam("event_description", v)}
          />

          <Select
            label="Tipo de evento"
            selectedKeys={getParam("event_type") ? [getParam("event_type")] : []}
            onSelectionChange={(keys) => setParam("event_type", Array.from(keys)[0] as string)}
          >
            {eventTypes.map((t) => (
              <SelectItem key={t}>{t}</SelectItem>
            ))}
          </Select>

          <Select
            label="Lida?"
            selectedKeys={getParam("seen") ? [getParam("seen")] : []}
            onSelectionChange={(keys) => setParam("seen", Array.from(keys)[0] as string)}
          >
            <SelectItem key="">Todas</SelectItem>
            <SelectItem key="true">Lidas</SelectItem>
            <SelectItem key="false">Não lidas</SelectItem>
          </Select>

          <Input
            type="date"
            label="Data do evento"
            value={getParam("event_date")}
            onValueChange={(v) => setParam("event_date", v)}
          />

          <Input
            type="date"
            label="Criadas a partir"
            value={getParam("created_at_from")}
            onValueChange={(v) => setParam("created_at_from", v)}
          />

          <Input
            type="date"
            label="Criadas até"
            value={getParam("created_at_to")}
            onValueChange={(v) => setParam("created_at_to", v)}
          />
        </div>
      </Card>

      {unreadCount > 0 && (
        <Button
          color="primary"
          startContent={<Check />}
          onPress={() => notifications.forEach((n: any) => !n.seen && markAsSeen.mutate(n.notification_id))}
        >
          Marcar todas como lidas ({unreadCount})
        </Button>
      )}

      {/* TABLE */}
      <Card className="p-4 shadow-md border border-gray-200">
        <Table aria-label="Lista de notificações">
          <TableHeader>
            <TableColumn>Evento</TableColumn>
            <TableColumn>Descrição</TableColumn>
            <TableColumn>Tipo</TableColumn>
            <TableColumn>Período</TableColumn>
            <TableColumn>Criado</TableColumn>
            <TableColumn><></></TableColumn>
          </TableHeader>

          <TableBody isLoading={isPending} emptyContent="Nenhuma notificação encontrada">
            {notifications.map((n: any) => {
              const event = n.event;
              return (
                <TableRow key={n.notification_id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 opacity-70" />
                    {event.title}
                  </TableCell>

                  <TableCell className="opacity-80">{event.description || "—"}</TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        typeColors[event.type] || typeColors.other
                      }`}
                    >
                      <Tag className="inline-block w-3 h-3 mr-1" />
                      {event.type}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm flex flex-col gap-1">
                    <span className="flex items-center gap-1 opacity-80">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(event.event_start).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 opacity-80">
                      <Clock className="w-4 h-4" />
                      {new Date(event.event_end).toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell className="opacity-70 text-sm">
                    {timeAgo(new Date(event.created_at))}
                  </TableCell>

                  <TableCell>
                    {!n.seen && (
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => markAsSeen.mutate(n.notification_id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="py-4 flex justify-between items-center">
          <p className="text-sm opacity-70">
            Página {currentPage} de {totalPages} — {totalRecords} notificações
          </p>

          <Pagination page={currentPage} total={totalPages} showControls onChange={handlePageChange} />
        </div>
      </Card>
    </div>
  );
}
