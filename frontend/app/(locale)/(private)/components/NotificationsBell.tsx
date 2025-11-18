"use client";

import * as React from "react";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Badge } from "@heroui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Bell,
  Check,
  Eye,
  FileText,
  BookOpen,
  Users,
  Presentation,
  Clock,
  GraduationCap,
  Megaphone,
  Palette,
  Dumbbell,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Material 2 colors and elevations
const materialColors = {
  primary: "#6200ee",
  surface: "#ffffff",
  onSurface: "#333",
  divider: "rgba(0,0,0,0.12)",
  ripple: "rgba(0,0,0,0.15)",
  hover: "rgba(0,0,0,0.06)",
  card: "#fff",
  unread: "#e3f2fd",
};

// Simplified event type mapping
const getEventConfig = (type: string) => {
  const map: any = {
    exam: { icon: FileText, label: "Prova" },
    quiz: { icon: HelpCircle, label: "Quiz" },
    assignment: { icon: BookOpen, label: "Trabalho" },
    lecture: { icon: GraduationCap, label: "Aula" },
    workshop: { icon: Users, label: "Workshop" },
    seminar: { icon: Presentation, label: "Seminário" },
    presentation: { icon: Presentation, label: "Apresentação" },
    deadline: { icon: Clock, label: "Prazo" },
    holiday: { icon: Clock, label: "Feriado" },
    announcement: { icon: Megaphone, label: "Anúncio" },
    cultural: { icon: Palette, label: "Cultural" },
    sports: { icon: Dumbbell, label: "Esportes" },
  };
  return map[type] || { icon: Bell, label: "Outro" };
};

export default function NotificationsBellMaterial() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["notifications", "material"],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "10", offset: "0" });
      const res = await fetch(`/api/me/notifications?${params.toString()}`);
      if (!res.ok) throw new Error("Erro ao carregar notificações");
      return res.json();
    },
  });

  const markAsSeen = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/me/notifications/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Erro ao marcar como vista");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "material"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data?.records || [];
  const unread: number = notifications.filter((n: any) => !n.seen).length;

  return (
    <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="flat"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <Badge content={unread} color="primary">
              <span></span>
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 rounded-lg"
        style={{
          background: materialColors.surface,
          boxShadow:
            "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b flex justify-between items-center w-full">
          <div className="" style={{ borderColor: materialColors.divider }}>
            <h3 className="font-medium" style={{ color: materialColors.onSurface }}>
              Notificações
            </h3>
            <p className="text-xs opacity-70">{unread} não lidas</p>
          </div>
          <Link href="/notifications" className="underline text-primary flex gap-1 items-center">
            Ver todas
            <ArrowRight />
          </Link>
        </div>

        {/* List */}
        <div className="w-full max-h-96 overflow-y-auto">
          {isPending ? (
            <div className="p-4 text-sm opacity-70">Carregando...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-sm opacity-60">Sem notificações</div>
          ) : (
            notifications.map((n: any) => {
              const event = getEventConfig(n.event.type);
              const Icon = event.icon;

              return (
                <div
                  key={n.notification_id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition"
                  style={{
                    background: !n.seen ? materialColors.unread : materialColors.surface,
                  }}
                  onClick={() => !n.seen && markAsSeen.mutate(n.notification_id)}
                >
                  <div
                    className="p-2 rounded-full"
                    style={{ background: materialColors.hover }}
                  >
                    <Icon className="h-4 w-4" />
              </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">{n.event.title}</p>
                    {n.event.description && (
                      <p className="text-xs opacity-70 line-clamp-2">{n.event.description}</p>
                    )}
                    <p className="text-xs opacity-50 mt-1">{timeAgo(new Date(n.created_at))}</p>
              </div>

                  {!n.seen && (
                    <button
                      className="p-1 rounded-full hover:bg-black/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsSeen.mutate(n.notification_id);
                      }}
                    >
                      <Eye className="h-4 w-4 opacity-70" />
                    </button>
                  )}
            </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {unread > 0 && (
          <div
            className="px-4 py-2 border-t"
            style={{ borderColor: materialColors.divider }}
          >
            <Button
              fullWidth
              size="sm"
              startContent={<Check className="h-4 w-4" />}
              onPress={() => {
                notifications.forEach((n: any) => !n.seen && markAsSeen.mutate(n.notification_id));
              }}
            >
            Marcar todas como lidas
          </Button>
        </div>
        )}
      </PopoverContent>
    </Popover>
  );
}