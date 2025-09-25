// app/(locale)/(private)/institutions/[id]/dashboard/components/Today.tsx

"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo", 
});

export default function Today({ className }: { className?: string }) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    setText(fmt.format(new Date()));
  }, []);

  return <p className={className}>{text}</p>;
}
