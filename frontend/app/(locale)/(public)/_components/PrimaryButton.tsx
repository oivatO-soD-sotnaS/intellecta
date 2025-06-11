// components/ui/PrimaryButton.tsx
import React from "react"
import { Button } from "@heroui/button"

interface PrimaryButtonProps {
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
  isLoading?: boolean
  isDisabled?: boolean
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  type = "button",
  isLoading = false,
  isDisabled = false,
  onClick,
  className = "",
  size = "lg",
  fullWidth = true,
}) => {
  return (
    <Button
      className={`
        bg-gradient-to-r from-blue-600 to-purple-600 
        text-white font-semibold
        hover:from-blue-700 hover:to-purple-700
        transition-all duration-200
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      isDisabled={isDisabled}
      isLoading={isLoading}
      radius="lg"
      size={size}
      type={type}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
