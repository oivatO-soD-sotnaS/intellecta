// app/(locale)/(private)/home/components/DashboardBanner.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Mail, ClipboardList } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { TypingAnimation } from "@/components/ui/typing-animation";

type Stats = {
  activities: number;
  events: number;
  messages: number;
};

type Props = {
  name: string;
  nowISO?: string; // snapshot do servidor (recomendado p/ evitar hydration mismatch)
  stats?: Stats;
};

const fmtOpts: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
};

export default function DashboardBanner({
  name,
  nowISO,
  stats = { activities: 12, events: 7, messages: 15 },
}: Props) {
  // Data segura: se vier nowISO, formatamos a partir dele; senão, calculamos somente no client.
  const [formattedDate, setFormattedDate] = React.useState<string>("");

  React.useEffect(() => {
    const base = nowISO ? new Date(nowISO) : new Date();

    setFormattedDate(new Intl.DateTimeFormat("pt-BR", fmtOpts).format(base));
  }, [nowISO]);

  return (
    <section className="relative overflow-hidden rounded-2xl">
      {/* Glow/anel de gradiente externo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[2px] -z-10 rounded-[20px] opacity-80 blur-md"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
        }}
      />

      <div
        className="
          relative rounded-2xl
          mt-6
          sm:w-full
          md:w-full
          lg:max-w-9/12
          m-auto
          p-4 sm:p-6 lg:p-8
          shadow-2xl
          ring-1 ring-white/10
          text-white
          bg-primary
          before:absolute before:inset-0 before:-z-10 before:rounded-2xl
          before:bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-accent)_100%)]
          before:opacity-90
        "
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-12"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Texto esquerdo */}
          <div className="lg:col-span-7">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              <TypingAnimation>
                {`Olá, ${String(name ?? "")} 👋`}
              </TypingAnimation>
            </h2>
            <p className="mt-2 text-sm/6 text-white/85 flex flex-col gap-1">
              Bem-vinda de volta à sua plataforma educacional.
              <span suppressHydrationWarning>
                Hoje é {formattedDate || "\u00A0"} .
              </span>
            </p>
          </div>

          {/* Cards de métricas */}

        </motion.div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  label,
  sublabel,
  Icon,
}: {
  value: number;
  label: string;
  sublabel: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <Card
      className="
        rounded-2xl border-white/10 bg-white/10
        backdrop-blur-md text-white shadow-md
        hover:bg-white/12 transition-colors
      "
    >
      <CardContent className="flex items-center gap-3 p-3 sm:p-4">
        <div
          className="
            grid h-9 w-9 place-items-center rounded-xl
            bg-white/15 ring-1 ring-white/15
          "
        >
          <Icon aria-hidden className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-semibold tabular-nums">{value}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-white/70 sm:visible invisible font-black">
            {label}
          </div>
          <div className="text-[10px] text-white/60 sm:visible invisible font-black">
            {sublabel}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
