/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@heroui/avatar";
import { useProfileForm } from "@/hooks/useProfileForm";

interface ProfileCardProps {
  name: string;
  role?: string;
  institutionsCount?: number;
  disciplinesCount?: number;
  avatarUrl?: string;
  avatarId?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  institutionsCount = 0,
  disciplinesCount = 0,
  avatarUrl,
  avatarId,
}) => {
  const { profilePictureId, profilePictureUrl } = useProfileForm();

  const src =
    profilePictureUrl ??
    (profilePictureId ? `/api/files/${profilePictureId}` : undefined) ??
    avatarUrl ??
    (avatarId ? `/api/files/${avatarId}` : undefined);

  return (
    <Card className="rounded-2xl shadow-lg w-full">
      <CardContent className="p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center space-x-4">
          {src ? (
            <Avatar className="w-14 h-14" size="lg" src={src} />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <UserIcon className="h-7 w-7 text-gray-500 dark:text-gray-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            {role ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {role}
              </p>
            ) : null}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="flex justify-between border-t border-b pt-4 pb-4">
          <div className="flex-1 text-center">
            <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {institutionsCount}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Instituições
            </span>
          </div>
          <div className="flex-1 text-center">
            <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {disciplinesCount}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Disciplinas
            </span>
          </div>
        </div>

        {/* Botão Editar */}
        <Link href="/profile">
          <Button className="w-full" color="primary" size="md" variant="solid">
            Editar Perfil
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
