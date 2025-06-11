/* eslint-disable import/order */
// components/ui/PasswordInput.tsx
import React, { useState } from "react"
import { Input } from "@heroui/input"
import { EyeSlashFilledIcon } from "./Icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "./Icons/EyeFilledIcon"

export const PasswordInput: React.FC<{
  name?: string
  label?: string
  placeholder?: string
  isRequired?: boolean
  value?: string
  onChange?: (v: string) => void
  isInvalid?: boolean
  errorMessage?: React.ReactNode
}> = ({
  name,
  label = "Senha",
  placeholder = "Digite sua senha",
  isRequired = false,
  value = "",
  onChange = () => {},
  isInvalid = false,
  errorMessage,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Input
      className="w-full"
      classNames={{
        label: "text-base font-medium text-gray-700 dark:text-gray-200 pb-3",
        inputWrapper:
          "h-16 bg-gray-50 dark:bg-gray-700 " +
          "border border-gray-300 dark:border-gray-600 " +
          "rounded-lg px-4 flex items-center " +
          "focus-within:border-indigo-500 dark:focus-within:border-indigo-400 " +
          "transition-colors",
        input:
          "flex-1 text-base placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none",
      }}
      endContent={
        <button
          aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isRequired={isRequired}
      label={label + (isRequired ? "" : "")}
      labelPlacement="outside"
      name={name}
      placeholder={placeholder}
      type={isVisible ? "text" : "password"}
      value={value}
      variant="bordered"
      onValueChange={onChange}
    />
  )
}
