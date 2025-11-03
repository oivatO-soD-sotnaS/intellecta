"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInstitutionUsers } from "@/hooks/institution/useInstitutionUsers"

type Props = {
  institutionId: string
  value?: string
  onChange: (teacherId: string) => void
  placeholder?: string
}

export default function TeacherSelect({
  institutionId,
  value,
  onChange,
  placeholder = "Selecione um professor",
}: Props) {
  const { data, isLoading } = useInstitutionUsers(institutionId)
  const teachers =
    (data ?? []).filter(
      (u) => u.role === "teacher" || u.role === "professor"
    ) ?? []

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={isLoading || teachers.length === 0}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {teachers.map((t) => {
          const avatarProps = t.user?.profile_picture?.url
            ? { src: t.user.profile_picture.url }
            : { name: t.user?.full_name ?? "?" }
          return (
            <SelectItem
              key={t.user_id ?? t.institution_user_id}
              value={t.user?.user_id ?? ""}
            >
              <div className="flex items-center gap-2">
                <Avatar {...avatarProps} className="h-6 w-6" radius="full" />
                <span>{t.user?.full_name ?? "Sem nome"}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
