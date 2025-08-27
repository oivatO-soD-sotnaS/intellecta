"use client";

import * as React from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { motion } from "framer-motion";

import { useInstitution } from "@/hooks/institution/useInstitution";
import { useUpdateInstitution } from "@/hooks/institution/useUpdateInstitution";
import type { UpdateInstitutionInput } from "@/types/institution";
import FileUpload, { FileUploadHandle } from "@/components/comp-547";

type Props = {
  institutionId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
};

export function EditInstitutionModal({ institutionId, isOpen, onOpenChange, onUpdated }: Props) {
  const { data, isLoading, isError, error } = useInstitution(institutionId, { enabled: isOpen });
  const { mutateAsync, isPending } = useUpdateInstitution(institutionId);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const profileRef = React.useRef<FileUploadHandle>(null);
  const bannerRef = React.useRef<FileUploadHandle>(null);

  // Inicializa campos quando abre e os dados chegam
  React.useEffect(() => {
    if (isOpen && data) {
      setName(data.name || "");
      setDescription(data.description || "");
    }
  }, [isOpen, data]);

  React.useEffect(() => {
    if (isError) {
      addToast({
        title: "Erro ao carregar instituição",
        description: (error as Error)?.message ?? "Tente novamente mais tarde.",
        color: "danger",
        variant: "flat",
      });
    }
  }, [isError]); // eslint-disable-line

  const initialProfile = React.useMemo(
    () =>
      data?.profilePicture
        ? [
            {
              id: data.profilePicture.file_id,
              name: data.profilePicture.filename,
              size: data.profilePicture.size,
              type: data.profilePicture.mime_type,
              url: data.profilePicture.url,
            },
          ]
        : undefined,
    [data]
  );

  const initialBanner = React.useMemo(
    () =>
      data?.banner
        ? [
            {
              id: data.banner.file_id,
              name: data.banner.filename,
              size: data.banner.size,
              type: data.banner.mime_type,
              url: data.banner.url,
            },
          ]
        : undefined,
    [data]
  );

  const handleSave = async () => {
    if (!name.trim() && !description.trim() && !profileRef.current?.getRawFiles()?.length && !bannerRef.current?.getRawFiles()?.length) {
      addToast({
        title: "Nada para atualizar",
        description: "Altere algum campo ou selecione uma imagem.",
        color: "warning",
        variant: "flat",
      });
      return;
    }

    const payload: UpdateInstitutionInput = {};
    if (name.trim() && name.trim() !== data?.name) payload.name = name.trim();
    if (description.trim() && description.trim() !== data?.description) payload.description = description.trim();

    const profileFile = profileRef.current?.getRawFiles()?.[0];
    const bannerFile = bannerRef.current?.getRawFiles()?.[0];
    if (profileFile) payload.profilePictureFile = profileFile;
    if (bannerFile) payload.bannerFile = bannerFile;

    try {
      await mutateAsync(payload);
      addToast({
        title: "Instituição atualizada",
        description: "Alterações salvas com sucesso.",
        color: "success",
        variant: "flat",
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (e) {
      addToast({
        title: "Não foi possível salvar",
        description: (e as Error)?.message ?? "Tente novamente.",
        color: "danger",
        variant: "flat",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      classNames={{ base: "border border-border bg-card text-foreground", header: "border-b border-border", footer: "border-t border-border" }}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="text-base font-semibold">Editar instituição</ModalHeader>

        <ModalBody>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-52 animate-pulse rounded-lg bg-muted" />
                <div className="h-52 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
              <div className="grid gap-4">
                <Input
                  label="Nome da Instituição"
                  value={name}
                  onValueChange={setName}
                  variant="bordered"
                  size="sm"
                  classNames={{ inputWrapper: "bg-background border-border" }}
                />

                <div>
                  <label className="mb-1 block text-sm font-medium">Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-sm font-medium">Imagem de perfil</div>
                    <FileUpload ref={profileRef} accept="image/*" multiple={false} maxFiles={1} maxSizeMB={5} initialFiles={initialProfile} />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium">Banner</div>
                    <FileUpload ref={bannerRef} accept="image/*" multiple={false} maxFiles={1} maxSizeMB={8} initialFiles={initialBanner} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={() => onOpenChange(false)} isDisabled={isPending}>
            Cancelar
          </Button>
          <Button color="warning" onPress={handleSave} isLoading={isPending}>
            Salvar alterações
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
