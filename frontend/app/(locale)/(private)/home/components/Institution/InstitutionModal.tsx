"use client";

import * as React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { useCreateInstitution } from "@/hooks/institution/useCreateInstitution";
import type { CreateInstitutionInput } from "@/types/institution";
import FileUpload, { FileUploadHandle } from "@/components/comp-547";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
};

export function InstitutionModal({ isOpen, onOpenChange, onCreate }: Props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Refs para capturar arquivos dos 2 uploads
  const profileRef = React.useRef<FileUploadHandle>(null);
  const bannerRef = React.useRef<FileUploadHandle>(null);

  const { mutateAsync, isPending } = useCreateInstitution();

  const resetForm = React.useCallback(() => {
    setName("");
    setDescription("");
    profileRef.current?.clear();
    bannerRef.current?.clear();
  }, []);

  const handleSubmit = React.useCallback(async () => {
    if (!name.trim() || !description.trim()) {
      addToast({
        title: "Preencha os campos obrigatórios",
        description: "Nome e descrição são obrigatórios.",
        color: "warning",
        variant: "flat",
      });
      return;
    }

    const profileFile = profileRef.current?.getRawFiles()?.[0] ?? null;
    const bannerFile = bannerRef.current?.getRawFiles()?.[0] ?? null;

    const payload: CreateInstitutionInput = {
      name: name.trim(),
      description: description.trim(),
      profilePictureFile: profileFile ?? undefined,
      bannerFile: bannerFile ?? undefined,
    };

    try {
      await mutateAsync(payload);
      addToast({
        title: "Instituição criada",
        description: "Sua instituição foi criada com sucesso.",
        color: "success",
        variant: "flat",
      });
      onCreate?.();
      resetForm();
      onOpenChange(false);
    } catch (err) {
      const msg =
        (err instanceof Error && err.message) ||
        (typeof err === "string" ? err : "Ocorreu um erro ao criar a instituição.");
      addToast({
        title: "Não foi possível criar",
        description: msg,
        color: "danger",
        variant: "flat",
      });
    }
  }, [name, description, mutateAsync, onCreate, onOpenChange, resetForm]);

  const canSubmit = name.trim().length > 0 && description.trim().length > 0 && !isPending;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      classNames={{
        base: "border border-border bg-card text-foreground",
        header: "border-b border-border",
        footer: "border-t border-border",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="text-base font-semibold">Criar nova instituição</ModalHeader>

        <ModalBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome da Instituição"
              value={name}
              onValueChange={setName}
              isRequired
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: "bg-background border-border" }}
              placeholder="Ex.: Instituto Intellecta"
            />
            {/* Campo de e-mail removido (backend usa o e-mail do usuário autenticado) */}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Descrição <span className="text-danger">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary"
              placeholder="Conte rapidamente sobre a instituição…"
            />
          </div>

          {/* Uploads opcionais */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-sm font-medium">Imagem de perfil (opcional)</div>
              <FileUpload
                ref={profileRef}
                accept="image/*"
                multiple={false}
                maxFiles={1}
                maxSizeMB={5}
                description="PNG, JPG até 5MB"
                dropzoneLabel="Selecionar imagem"
              />
            </div>

            <div>
              <div className="mb-1 text-sm font-medium">Banner (opcional)</div>
              <FileUpload
                ref={bannerRef}
                accept="image/*"
                multiple={false}
                maxFiles={1}
                maxSizeMB={8}
                description="PNG, JPG até 8MB • proporção 16:9 recomendada"
                dropzoneLabel="Selecionar banner"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={() => onOpenChange(false)} isDisabled={isPending}> 
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSubmit} isDisabled={!canSubmit} isLoading={isPending}>
            Criar instituição
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
