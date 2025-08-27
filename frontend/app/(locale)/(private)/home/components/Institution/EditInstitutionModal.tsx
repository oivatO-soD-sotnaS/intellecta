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
import { useUploadProfileAsset } from "@/hooks/files/useUploadProfileAsset";

type Props = {
  institutionId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
};

export function EditInstitutionModal({ institutionId, isOpen, onOpenChange, onUpdated }: Props) {
  const { data, isLoading, isError, error } = useInstitution(institutionId, { enabled: isOpen });
  const { mutateAsync: updateAsync, isPending: isUpdating } = useUpdateInstitution(institutionId);

  const { mutateAsync: uploadAsset, isPending: isUploading } = useUploadProfileAsset();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const profileRef = React.useRef<FileUploadHandle>(null);
  const bannerRef = React.useRef<FileUploadHandle>(null);

  const initialProfileId = React.useMemo(() => data?.profilePicture?.file_id ?? undefined, [data]);
  const initialBannerId = React.useMemo(() => data?.banner?.file_id ?? undefined, [data]);

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
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    // alterações textuais
    const changedName = data && trimmedName !== data.name ? trimmedName : undefined;
    const changedDesc = data && trimmedDesc !== (data.description ?? "") ? trimmedDesc : undefined;

    // estado dos uploads
    const profileRaw = profileRef.current?.getRawFiles?.() ?? [];
    const bannerRaw = bannerRef.current?.getRawFiles?.() ?? [];
    const profileFiles = profileRef.current?.getFiles?.() ?? [];
    const bannerFiles = bannerRef.current?.getFiles?.() ?? [];

    // remoções (limpou o slot)
    const initialProfileId = data?.profilePicture?.file_id;
    const initialBannerId = data?.banner?.file_id;
    const profileCleared = !!initialProfileId && profileFiles.length === 0;
    const bannerCleared = !!initialBannerId && bannerFiles.length === 0;

    // payload base
    const payload: UpdateInstitutionInput = {};
    if (changedName !== undefined) payload.name = changedName;
    if (changedDesc !== undefined) payload.description = changedDesc;
    if (profileCleared) payload.profilePictureId = null;
    if (bannerCleared) payload.bannerId = null;

    try {
      // 1) upload dos NOVOS arquivos (se houver)
      const uploads: Promise<void>[] = [];
      if (profileRaw[0]) {
        uploads.push(
          uploadAsset(profileRaw[0]).then((up) => {
            payload.profilePictureId = up.file_id;
          })
        );
      }
      if (bannerRaw[0]) {
        uploads.push(
          uploadAsset(bannerRaw[0]).then((up) => {
            payload.bannerId = up.file_id;
          })
        );
      }
      if (uploads.length) await Promise.all(uploads);

      // 2) o backend exige SEMPRE "name"
      //    – se o usuário não mudou o nome, mande o atual
      const effectiveName = (payload.name ?? data?.name ?? "").trim();
      if (!effectiveName) {
        addToast({
          title: "Nome obrigatório",
          description: "Informe o nome da instituição para salvar.",
          color: "warning",
          variant: "flat",
        });
        return;
      }
      payload.name = effectiveName;

      // (opcional) envie a descrição atual para manter simetria
      if (payload.description === undefined && (data?.description ?? "") !== "") {
        payload.description = data!.description!;
      }

      // nada mudou MESMO?
      const nothingChanged =
        (changedName === undefined && changedDesc === undefined) &&
        !profileCleared && !bannerCleared &&
        profileRaw.length === 0 && bannerRaw.length === 0;

      if (nothingChanged) {
        addToast({
          title: "Nada para atualizar",
          description: "Altere algum campo ou modifique as imagens para salvar.",
          color: "warning",
          variant: "flat",
        });
        return;
      }

      // 3) update JSON com os IDs resultantes
      await updateAsync(payload);


      onUpdated?.();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    }
  };

  const isSaving = isUpdating || isUploading;

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
                    <FileUpload
                      ref={profileRef}
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      maxSizeMB={5}
                      initialFiles={initialProfile}
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium">Banner</div>
                    <FileUpload
                      ref={bannerRef}
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      maxSizeMB={8}
                      initialFiles={initialBanner}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={() => onOpenChange(false)} isDisabled={isSaving}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={isSaving}>
            Salvar alterações
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
