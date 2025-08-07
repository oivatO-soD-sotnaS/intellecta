"use client"

import React from "react"

import {
  institutionUpdateSchema,
  InstitutionDto,
} from "../schema/institutionSchema"
import { useUpdateInstitution } from "@/hooks/institution/useUpdateInstitution"
import { Form } from "@heroui/form"
import { Button } from "@heroui/button"

interface SettingsProps {
  institution: InstitutionDto
}

export default function Settings({ institution }: SettingsProps) {
  const form = useForm<React.infer<typeof institutionUpdateSchema>>({
    resolver: zodResolver(institutionUpdateSchema),
    defaultValues: {
      name: institution.name,
      description: institution.description ?? "",
    },
  })

  const mutation = useUpdateInstitution(institution.id)

  function onSubmit(values: React.infer<typeof institutionUpdateSchema>) {
    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Instituição</FormLabel>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo e Banner só após implementar upload de arquivos */}
        {/* 
        <FormField name="profile_picture_id">…<FileInput />…
        <FormField name="banner_id">…<FileInput />…
        */}

        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Salvando..." : "Salvar mudanças"}
        </Button>
      </form>
    </Form>
  )
}
