// components/SessionGuard.tsx
"use client";

import { useEffect, useState } from "react";
import SessionExpiredModal from "@/components/SessionExpiredModal";

export function SessionGuard() {
  const [open, setOpen] = useState(false);
  const [nextUrl, setNextUrl] = useState("/");

  useEffect(() => {
    const openModal = () => {
      setNextUrl(window.location.pathname + window.location.search);
      setOpen(true);
    };

    // 1) Se o cookie tiver sido setado (ex.: pelo apiClient ao receber 401)
    if (document.cookie.includes("session_expired=1")) {
      openModal();
    }

    // 2) (opcional) Sincroniza entre abas/requests via BroadcastChannel
    const bc = new BroadcastChannel("auth");
    bc.onmessage = (ev) => {
      if (ev.data === "expired") openModal();
    };

    return () => bc.close();
  }, []);

  return (
    <SessionExpiredModal defaultOpen={open} nextUrl={nextUrl} />
  );
}