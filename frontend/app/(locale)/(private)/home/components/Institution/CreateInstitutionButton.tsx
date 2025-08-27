"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";

type Props =
  | { asLink?: false; onClick?: () => void }
  | { asLink: true; href: string };

export function CreateInstitutionButton(props: Props) {
  if ("asLink" in props && props.asLink && props.href) {
    return (
      <Button as={Link} href={props.href} color="primary" startContent={<Plus className="h-4 w-4" />}>
        Criar instituição
      </Button>
    );
  }

  return (
    <Button onPress={("onClick" in props ? props.onClick : undefined)} color="primary" startContent={<Plus className="h-4 w-4" />}>
      Criar instituição
    </Button>
  );
}
