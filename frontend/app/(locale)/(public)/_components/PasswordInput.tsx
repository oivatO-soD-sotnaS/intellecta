/* eslint-disable import/order */
import React, { useState } from "react"
import { Input } from "@heroui/input"
import { EyeSlashFilledIcon } from "./Icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "./Icons/EyeFilledIcon"

export interface PasswordInputProps {
  name?: string
  label?: string
  placeholder?: string
  isRequired?: boolean
  value?: string
  onChange?: (v: string) => void
  onBlur?: (e: any) => void
  isInvalid?: boolean
  errorMessage?: React.ReactNode
  className?: string
  variant?: "flat" | "faded" | "bordered" | "underlined" | undefined
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label = "Senha",
  placeholder = "",
  isRequired = false,
  value = "",
  onChange = () => {},
  onBlur,
  isInvalid = false,
  errorMessage,
  className = "",
  variant,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Input
      className={`w-full ${className}`}
      classNames={{
        label: "text-base font-medium text-gray-700 dark:text-gray-200 pb-3",
        inputWrapper:
          "h-16 rounded-lg px-4 flex items-center focus-within:border-indigo-500 dark:focus-within:border-indigo-400 transition-colors",
        input:
          "flex-1 text-base placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none",
      }}
      endContent={
        <button
          aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
          className="p-2 rounded-ful transition-colors"
          type="button"
          onClick={() => setIsVisible((v) => !v)}
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          ) : (
            <EyeFilledIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          )}
        </button>
      }
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      isRequired={isRequired}
      label={label}
      labelPlacement="outside"
      name={name}
      placeholder={placeholder}
      type={isVisible ? "text" : "password"}
      value={value}
      variant={variant}
      onValueChange={onChange}
      onBlur={onBlur}
    />
  )
}
