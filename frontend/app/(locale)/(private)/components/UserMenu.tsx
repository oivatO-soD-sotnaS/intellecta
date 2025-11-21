"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Avatar } from "@heroui/avatar";
import { ChevronDown } from "lucide-react";

import { useSignOut } from "@/hooks/auth/useSignOut";
import { useProfileForm } from "@/hooks/useProfileForm";

export type HeaderUser = {
  name: string;
  email: string;
  avatarUrl?: string;
  avatarId?: string;
};

export default function UserMenu({ user }: { user: HeaderUser }) {
  const { mutate: signOut, isPending } = useSignOut();

  const { profilePictureId, profilePictureUrl } = useProfileForm();

  const src =
    profilePictureUrl ??
    (profilePictureId ? `/api/files/${profilePictureId}` : undefined) ??
    user.avatarUrl ??
    (user.avatarId ? `/api/files/${user.avatarId}` : undefined);

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button className="flex items-center gap-2" radius="lg" variant="flat">
          <Avatar
            showFallback
            alt={user?.name ?? "Usuário"}
            size="sm"
            src={src}
          />
          <span className="hidden text-sm sm:inline">
            {user?.name || "Usuário"}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-3">
        <div className="mb-3 flex items-center gap-2">
          <Avatar
            showFallback
            alt={user?.name ?? "Usuário"}
            className="shrink-0"
            size="md"
            src={src}
          />
          <div
            className="min-w-0 flex-1"
            style={{ maxWidth: "calc(14rem - 5rem)" }}
          >
            <p className="truncate font-medium text-sm">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <ul className="space-y-1 w-full">
          <li>
            <Link href="/profile">
              <Button as="span" className="w-full justify-start" variant="flat">
                Meu Perfil
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/events">
              <Button as="span" className="w-full justify-start" variant="flat">
                Eventos de usuário
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/invites">
              <Button as="span" className="w-full justify-start" variant="flat">
                Convites
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className="w-full justify-start text-danger"
              isLoading={isPending}
              variant="flat"
              onPress={() => signOut()}
            >
              {isPending ? "Saindo..." : "Sair"}
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
