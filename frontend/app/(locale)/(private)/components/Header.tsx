"use client";

import * as React from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import UserMenu, { HeaderUser } from "./UserMenu";
import NotificationsBell, { NotificationItem } from "./NotificationsBell";
import Image from "next/image";


export default function Header({
  user,
  notifications = 0,
  items = [],
  onSignOut,
}: {
  user: HeaderUser;
  notifications?: number;
  items?: NotificationItem[];
  onSignOut?: () => void;
}) {
  return (
    <header
      className="
        sticky top-0 z-40 w-full
        h-20 
        border-b border-border
        bg-background/70 backdrop-blur
        supports-[backdrop-filter]:bg-background/50
      "
    >
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-3 px-3 sm:h-16 sm:gap-4 sm:px-4">
        <Link
          href="/home"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Image src="/IntellectaLogo.png" alt="Intellecta" width={70} height={70}/>
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            Intellecta
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1">
          <SearchBar placeholder="Buscar instituições, atividades..." />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationsBell count={notifications} items={items} />
          <UserMenu user={user} onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}
