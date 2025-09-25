// app/(locale)/(private)/institutions/[id]/components/CourseCard.tsx
"use client";

import { motion } from "framer-motion";
import { SubjectDTO } from "@/types/subject";
import { ChevronRight, Mail } from "lucide-react";

type Props = {
  subject: SubjectDTO;
  onOpen?: (subject: SubjectDTO) => void;
  onRemove?: (subject: SubjectDTO) => void; 
};

export default function CourseCard({ subject, onOpen, onRemove }: Props) {
  const bannerUrl = subject.banner?.url ?? null;
  const teacher = subject.teacher;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Banner */}
      <div
        className="h-20 w-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-indigo-600 dark:to-fuchsia-600"
        style={
          bannerUrl
            ? {
                backgroundImage: `url('${bannerUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
        aria-hidden
      />

      {/* Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {subject.name}
        </h3>

        {/* Teacher */}
        {teacher?.full_name && (
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            <div className="inline-flex h-6 w-6 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              {teacher?.profile_picture?.url ? (
                <img
                  src={teacher.profile_picture.url}
                  alt={teacher.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-200">
                  {getInitials(teacher.full_name)}
                </span>
              )}
            </div>
            <span className="truncate">{teacher.full_name}</span>

            {teacher.email && (
              <a
                href={`mailto:${teacher.email}`}
                className="ml-1 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                onClick={(e) => e.stopPropagation()}
                title={teacher.email}
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {shortenEmail(teacher.email)}
              </a>
            )}
          </div>
        )}

        {/* Description */}
        {subject.description && (
          <p className="mt-3 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
            {subject.description}
          </p>
        )}

        {/* Footer actions */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpen?.(subject)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:shadow-sm active:scale-[0.99] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            Abrir disciplina
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Placeholder para ação “Remover” somente quando fizer sentido (ex.: ClassSubjects) */}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove?.(subject)}
              className="rounded-xl px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function shortenEmail(email: string) {
  if (email.length <= 24) return email;
  const [user, domain] = email.split("@");
  const u = user.length > 12 ? `${user.slice(0, 12)}…` : user;
  return `${u}@${domain}`;
}
