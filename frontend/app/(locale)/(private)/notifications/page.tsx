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
import { Eye, Check, Filter, XCircle } from "lucide-react";

const eventTypes = [
  "exam", "quiz", "assignment", "lecture", "workshop", "seminar", "presentation",
  "deadline", "holiday", "announcement", "cultural", "sports", "other"
];

export default function NotificationsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  // Force API-required default params
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

  // FETCH QUERY
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * limit;
    setParam("offset", String(newOffset));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Notificações</h1>

      {/* FILTERS */}
      <Card className="p-5 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium flex items-center gap-2">
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
            onSelectionChange={(keys) =>
              setParam("event_type", Array.from(keys)[0] as string)
            }
          >
            {eventTypes.map((t) => (
              <SelectItem key={t}>{t}</SelectItem>
            ))}
          </Select>

          <Select
            label="Lida?"
            selectedKeys={getParam("seen") ? [getParam("seen")] : []}
            onSelectionChange={(keys) =>
              setParam("seen", Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="">Todas</SelectItem>
            <SelectItem key="true">Lidas</SelectItem>
            <SelectItem key="false">Não lidas</SelectItem>
          </Select>

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

          <Input
            type="date"
            label="Data do evento"
            value={getParam("event_date")}
            onValueChange={(v) => setParam("event_date", v)}
          />
        </div>
      </Card>

      {/* MARK ALL READ */}
      {unreadCount > 0 && (
        <Button
          color="primary"
          startContent={<Check />}
          onPress={() =>
            notifications.forEach((n: any) => !n.seen && markAsSeen.mutate(n.notification_id))
          }
        >
          Marcar todas como lidas ({unreadCount})
        </Button>
      )}

      {/* TABLE */}
      <Card className="p-4">
        <Table aria-label="Lista de notificações">
          <TableHeader>
            <TableColumn>Título</TableColumn>
            <TableColumn>Descrição</TableColumn>
            <TableColumn>Tipo</TableColumn>
            <TableColumn>Recebida</TableColumn>
            <TableColumn>Visto</TableColumn>
          </TableHeader>

          <TableBody
            isLoading={isPending}
            emptyContent="Nenhuma notificação encontrada"
          >
            {notifications.map((n: any) => (
              <TableRow key={n.notification_id}>
                <TableCell className={n.seen ? "" : "font-semibold"}>
                  {n.event.title}
                </TableCell>

                <TableCell className="opacity-70">
                  {n.event.description || "—"}
                </TableCell>

                <TableCell>{n.event.type}</TableCell>

                <TableCell>{timeAgo(new Date(n.created_at))}</TableCell>

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
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <div className="py-4 flex justify-between items-center">
          <p className="text-sm opacity-70">
            Página {currentPage} de {totalPages} — {totalRecords} notificações
          </p>

          <Pagination
            page={currentPage}
            total={totalPages}
            showControls
            onChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
}
