/* eslint-disable react/jsx-sort-props */
// components/ui/InputField.tsx
import React, { useMemo } from "react"
import { Input } from "@heroui/input"

interface InputFieldProps {
  name?: string
  label: string
  placeholder: string
  type?: string
  isRequired?: boolean
  value?: string
  onChange?: (value: string) => void
  errorMessage?: React.ReactNode
  isInvalid?: boolean
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  className?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  isRequired = false,
  value = "",
  onChange = () => {},
  errorMessage,
  isInvalid = false,
  startContent,
  endContent,
  className = "",
}) => {
  // Só para tipo email: valida com regex
  const emailRegex = useMemo(
    () => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    []
  )
  const emailInvalid =
    type === "email" && value !== "" && !emailRegex.test(value)

  return (
    <Input
      className={`w-full ${className}`}
      classNames={{
        label: "text-base font-medium text-gray-700 dark:text-gray-200 pb-3",
        inputWrapper:
          "h-16 bg-gray-50 dark:bg-gray-700 " +
          "border border-gray-300 dark:border-gray-600 " +
          "rounded-lg px-4 flex items-center " +
          "focus-within:border-indigo-500 dark:focus-within:border-indigo-400 " +
          "transition-colors",
        input:
          "flex-1 text-base placeholder-gray-400 dark:placeholder-gray-500 " +
          "bg-transparent focus:outline-none",
      }}
      endContent={endContent}
      errorMessage={
        isInvalid
          ? errorMessage
          : emailInvalid
            ? "Por favor, insira um email válido."
            : undefined
      }
      label={label + (isRequired ? "" : "")}
      labelPlacement="outside"
      name={name}
      placeholder={placeholder}
      startContent={startContent}
      type={type}
      onValueChange={onChange}
      isRequired={isRequired}
      // combina a prop com validação de e-mail:
      isInvalid={isInvalid || emailInvalid}
      value={value}
      // mostra a mensagem custom ou a de e-mail
      variant="bordered"
    />
  )
}
