"use client";

import * as React from "react";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { Kbd } from "@heroui/kbd";

export default function SearchBar({
  placeholder = "Buscar...",
  onSubmit,
}: {
  placeholder?: string;
  onSubmit?: (value: string) => void;
}) {
  const [q, setQ] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(q.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        value={q}
        onValueChange={setQ}
        placeholder={placeholder}
        aria-label="Pesquisar"
        radius="full"
        variant="bordered"
        size="sm"
        classNames={{
          inputWrapper:
            "bg-card border-border shadow-sm h-10 sm:h-11 focus-within:ring-2 focus-within:ring-primary",
          input: "text-sm placeholder:text-muted-foreground/70",
        }}
        startContent={<Search className="h-4 w-4 text-muted-foreground" />}
        endContent={
          <Kbd keys={["ctrl",]} className="hidden sm:inline rounded-md border border-border bg-muted/60 px-1.5 py-[2px] text-[10px] text-muted-foreground">
            k
          </Kbd>
        }
      />
    </form>
  );
}
