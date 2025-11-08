// hooks/useErrorFeedback.ts
"use client"

import { addToast } from "@heroui/toast"
import { HttpError, friendlyMessage } from "@/lib/http-errors"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

type Opts<TFieldValues extends FieldValues> = {
  ctx?: "signin" | string
  setFieldError?: UseFormSetError<TFieldValues>
  passwordField?: Path<TFieldValues>
}

export function useErrorFeedback<
  TFieldValues extends FieldValues = FieldValues,
>() {
  function notifyError(err: unknown, opts?: Opts<TFieldValues>) {
    const { title, description } = friendlyMessage(err, opts?.ctx)

    addToast({
      title,
      description,
      color: "danger",
      variant: "flat",
    })

    if (
      opts?.ctx === "signin" &&
      opts.setFieldError &&
      err instanceof HttpError &&
      err.status === 422
    ) {
      const pwdField =
        (opts.passwordField as Path<TFieldValues> | undefined) ??
        ("password" as Path<TFieldValues>)
      opts.setFieldError(pwdField, {
        type: "server",
        message: "Senha incorreta.",
      })
    }
  }

  function notifySuccess(title: string, description?: string) {
    addToast({
      title,
      description,
      color: "success",
      variant: "flat",
    })
  }

  return { notifyError, notifySuccess }
}
