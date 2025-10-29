"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import AppAvatar from "@/app/(locale)/(private)/components/AppAvatar"
import { Subject } from "../types"

export default function SubjectOverview({
  subject,
  onUpdate,
}: {
  subject: Subject
  onUpdate: (s: Subject) => void
}) {
  const [name, setName] = useState(subject.name)
  const [desc, setDesc] = useState(subject.description ?? "")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-medium">Professor responsável</div>
          <div className="flex items-center gap-3">
            <AppAvatar
              src={subject.teacher.profile_picture?.url}
              name={subject.teacher.full_name}
              size="lg"
            />
            <div className="text-sm">
              <div className="font-medium">{subject.teacher.full_name}</div>
              <div className="text-muted-foreground">
                {subject.teacher.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-2">
            <Label>Nome da disciplina</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button
              className="rounded-xl"
              onClick={() => onUpdate({ ...subject, name, description: desc })}
            >
              Salvar (mock)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
