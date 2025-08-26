"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Avatar } from "@heroui/avatar";
import { ChevronDown } from "lucide-react";
import { useSignOut } from "@/hooks/auth/useSignOut";

export type HeaderUser = {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
};



export default function UserMenu({
  user,
  onSignOut,
}: {
  user: HeaderUser;
  onSignOut?: () => void;
}) {

const { mutate: signOut, isPending } = useSignOut();


  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant="flat" radius="lg" className="flex items-center gap-2">
          <Avatar
            alt={user?.name ?? "Usuário"}
            size="sm"
            src={user?.avatarUrl || "#"}
          />
          <span className="hidden text-sm sm:inline">{user?.name || "Usuário"}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56">
        <div className="mb-3 flex items-center gap-2">
          <Avatar alt={user?.name ?? "Usuário"} size="md" src={user?.avatarUrl || "#"} />
          <div className="min-w-0">
            <p className="truncate font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <ul className="space-y-1">
          <li>
            <Link href="/profile">
              <Button as="span" className="w-full justify-start" variant="flat">
                Meu Perfil
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <Button as="span" className="w-full justify-start" variant="flat">
                Configurações
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/help">
              <Button as="span" className="w-full justify-start" variant="flat">
                Ajuda
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className="w-full justify-start text-danger"
              variant="flat"
              onPress={() => signOut()}
              isLoading={isPending}
            >
              {isPending ? "Saindo..." : "Sair"}
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
