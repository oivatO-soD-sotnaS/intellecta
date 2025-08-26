"use client";

import * as React from "react";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Badge } from "@heroui/badge";
import { Bell, CalendarDays, ClipboardList } from "lucide-react";

export type NotificationItem = {
  id: string | number;
  title: string;
  description?: string;
  timeAgo?: string;
  icon?: "bell" | "calendar" | "tasks";
};

const IconMap: Record<NonNullable<NotificationItem["icon"]>, React.ReactNode> = {
  bell: <Bell className="h-5 w-5 text-primary mt-1" />,
  calendar: <CalendarDays className="h-5 w-5 text-primary mt-1" />,
  tasks: <ClipboardList className="h-5 w-5 text-primary mt-1" />,
};

export default function NotificationsBell({
  count = 0,
  items = [],
  onMarkAllRead,
}: {
  count?: number;
  items?: NotificationItem[];
  onMarkAllRead?: () => void;
}) {
  const list =
    items.length > 0
      ? items
      : [
          {
            id: 1,
            title: "Prova de Física III",
            description: "Amanhã às 14:00",
            timeAgo: "2 horas atrás",
            icon: "calendar" as const,
          },
          {
            id: 2,
            title: "3 Atividades pendentes",
            description: "Turma 4º Ano • Física",
            timeAgo: "hoje",
            icon: "tasks" as const,
          },
        ];

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button className="relative p-2" variant="flat" radius="lg" isIconOnly>
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1" color="danger" size="sm">
              {count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <h4 className="mb-2 font-semibold">Notificações</h4>

        <div className="max-h-60 space-y-1 overflow-y-auto">
          {list.map((n) => (
            <div key={n.id} className="flex items-start gap-2 rounded p-2">
              <div aria-hidden>
                {n.icon ? IconMap[n.icon] : <Bell className="h-5 w-5 text-primary mt-1" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm">
                  <strong>{n.title}</strong>
                  {n.description ? ` — ${n.description}` : null}
                </p>
                {n.timeAgo ? (
                  <span className="text-xs text-muted-foreground">{n.timeAgo}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-right">
          <Button size="sm" variant="flat" onPress={onMarkAllRead}>
            Marcar todas como lidas
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
