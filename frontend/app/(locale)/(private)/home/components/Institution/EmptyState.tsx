"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Building2, AlertTriangle } from "lucide-react";

type Props = {
  variant: "empty" | "error";
  title: string;
  description?: string;
  primaryText: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
};

export function EmptyState({
  variant,
  title,
  description,
  primaryText,
  primaryHref,
  onPrimaryClick,
}: Props) {
  const Icon = variant === "error" ? AlertTriangle : Building2;
  const asLink = Boolean(primaryHref);
  const Comp: any = asLink ? Link : "button";
  const compProps: any = asLink ? { href: primaryHref } : { onClick: onPrimaryClick, type: "button" };

  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-xl border p-8 text-center",
        variant === "error"
          ? "border-amber-300/30 bg-amber-50/10"
          : "border-dashed border-border bg-background",
      ].join(" ")}
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h4 className="mt-3 text-sm font-medium">{title}</h4>
      {description ? (
        <p className="mt-1 max-w-md text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
