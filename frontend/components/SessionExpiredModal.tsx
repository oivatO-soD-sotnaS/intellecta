// components/SessionExpiredModal.tsx
"use client";

import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { useEffect, useState } from "react";


type Props = {
  defaultOpen?: boolean;
  nextUrl?: string;
};

export default function SessionExpiredModal({
  defaultOpen = false,
  nextUrl = "/sign-in",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  // ao fechar, limpamos a flag do cookie
  useEffect(() => {
    if (!open) {
      document.cookie = "session_expired=; Max-Age=0; Path=/";
    }
  }, [open]);

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      backdrop="blur"
      classNames={{
        base:
          "bg-content1/80 backdrop-blur-xl border border-white/10 shadow-2xl",
        header: "border-b border-white/10",
        footer: "border-t border-white/10",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-base font-semibold">
              Sessão expirada
            </ModalHeader>
            <ModalBody className="text-sm text-foreground/80">
              Sua sessão expirou por inatividade ou login em outro dispositivo.
              Faça login novamente para continuar.
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setOpen(false)}>
                Fechar
              </Button>
              <Button
                color="primary"
                as={"a"}
                href={`/auth/login?next=${encodeURIComponent(nextUrl)}`}
              >
                Entrar novamente
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
