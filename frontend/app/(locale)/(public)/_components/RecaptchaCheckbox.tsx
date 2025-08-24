/* eslint-disable jsx-a11y/label-has-associated-control */
// components/ui/RecaptchaCheckbox.tsx
"use client"

import React from "react"
import Image from "next/image"
import { Checkbox } from "@heroui/checkbox"

interface RecaptchaCheckboxProps {
  /** Nome do campo (opcional, só pra aria) */
  name?: string
  /** <<< Preferível para controlar via RHF */
  checked?: boolean
  /** compat: caso em algum lugar ainda use isSelected */
  isSelected?: boolean
  /** callback padrão boolean (compatível com RHF field.onChange) */
  onChange?: (checked: boolean) => void

  /** feedback */
  errorMessage?: string
  isInvalid?: boolean

  className?: string
}

export const RecaptchaCheckbox: React.FC<RecaptchaCheckboxProps> = ({
  name,
  checked,
  isSelected,
  onChange,
  errorMessage,
  isInvalid,
  className = "",
}) => {
  const selected = checked ?? isSelected ?? false

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-3 rounded-xl  bg-gray-50 px-4 py-3  dark:bg-gray-950">
        <Checkbox
          name={name}
          isSelected={selected}
          onValueChange={onChange}
          aria-invalid={isInvalid || undefined}
        >
          Sou humano
        </Checkbox>

        <div className="ml-auto flex items-center space-x-2">
          <div className="relative h-10 w-10">
            <Image
              fill
              alt="reCAPTCHA"
              className="object-contain"
              sizes="40px"
              src="/recaptcha.svg"
            />
          </div>
        </div>
      </div>

      {isInvalid && errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
