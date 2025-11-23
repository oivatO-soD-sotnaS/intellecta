"use client";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useInstitution } from "../../layout";
import Image from "next/image";
import Today from "./Today";

type Props = {
  subtitle?: string;
};

export default function DashboardHeader({
  subtitle = "Gerencie sua instituição e acompanhe as atividades.",
}: Props) {
  const { data: me } = useCurrentUser();
  const { institution } = useInstitution();

  const firstName = me?.full_name?.split(" ")[0];
  const banner = institution?.banner?.url;
  const profile = institution?.profilePicture?.url;

  console.log(institution)

  return (
    <div className="relative w-full rounded-xl overflow-hidden border bg-card">
      {/* Banner */}
      {banner && (
        <div className="relative w-full h-28 sm:h-40">
          <Image
            src={banner}
            alt="Banner da instituição"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Conteúdo */}
      <div className="relative p-6 sm:p-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Foto da instituição */}
          {profile ? (
            <Image
              src={profile}
              alt={institution?.name}
              width={72}
              height={72}
              className="rounded-full border shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted border shadow-sm flex items-center justify-center text-muted-foreground text-xl font-semibold">
              {institution?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
              {institution?.name}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              {institution?.description || subtitle}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Olá, <span className="font-medium">{firstName}</span> 👋
            </p>
          </div>
        </div>

        {/* Data atual */}
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-xs text-muted-foreground">Hoje é</p>
          <Today className="text-sm font-medium text-primary" />
        </div>
      </div>
    </div>
  );
}
