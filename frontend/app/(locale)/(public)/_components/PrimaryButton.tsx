import React from "react"
import { Button } from "@heroui/button"

export interface PrimaryButtonProps {
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
  /** Associa o botão a um <form id="..."> externo */
  form?: string
  isLoading?: boolean
  isDisabled?: boolean
  onPress?: () => void
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
  disableRipple?: boolean
  disableAnimation?: boolean
}

const baseClasses = `
  bg-gradient-to-r from-blue-600 to-purple-600
  text-white font-semibold
  hover:from-blue-700 hover:to-purple-700
  transition-all duration-200
`

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  type = "button",
  form,
  isLoading = false,
  isDisabled = false,
  onPress,
  onClick, // compat
  className = "",
  size = "lg",
  fullWidth = true,
  onMouseEnter,
  onMouseLeave,
  disableRipple = true,
  disableAnimation = false,
}) => {
  const handlePress = onPress ?? onClick

  // 🔒 Se for submit (ou tiver `form`), usamos <button> N A T I V O
  // para garantir que o comportamento padrão do navegador (submit) ocorra,
  // sem interferência do react-aria/pressable.
  const mustBeNative = type === "submit" || !!form

  if (mustBeNative) {
    return (
      <button
        type={type}
        form={form}
        disabled={isDisabled || isLoading}
        onClick={handlePress}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-busy={isLoading || undefined}
        className={`${baseClasses} ${fullWidth ? "w-full" : ""} ${
          // arredondado grande para manter o visual
          size === "lg"
            ? "h-12 px-6 text-medium rounded-full"
            : size === "md"
              ? "h-10 px-5 text-sm rounded-full"
              : "h-9 px-4 text-sm rounded-full"
        } ${className}`}
      >
        {children}
      </button>
    )
  }

  // Caso NÃO seja submit nem tenha form, podemos usar a HeroUI normalmente
  return (
    <Button
      className={`${baseClasses} ${fullWidth ? "w-full" : ""} ${className}`}
      isDisabled={isDisabled}
      isLoading={isLoading}
      radius="lg"
      size={size}
      type={type}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disableRipple={disableRipple}
      disableAnimation={disableAnimation}
      onPress={handlePress}
      aria-busy={isLoading || undefined}
    >
      {children}
    </Button>
  )
}
