/* eslint-disable jsx-a11y/label-has-associated-control */
// components/ui/RecaptchaCheckbox.tsx
import React from "react"
import Image from "next/image"
import { Checkbox } from "@heroui/checkbox"

interface RecaptchaCheckboxProps {
  isSelected?: boolean
  onChange?: (isSelected: boolean) => void
  className?: string
}

export const RecaptchaCheckbox: React.FC<RecaptchaCheckboxProps> = ({
  isSelected = false,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`
        flex items-center justify-between
        bg-gray-50 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-sm
        p-4
        w-full
        ${className}
      `}
    >
      {/* Checkbox + label */}
      <label className="flex items-center space-x-3">
        <Checkbox
          classNames={{
            base: "rounded-sm border-gray-300 dark:border-gray-600",
            label: "text-sm font-medium text-gray-700 dark:text-gray-300",
          }}
          isSelected={isSelected}
          size="md"
          onValueChange={onChange}
        >
          Sou humano
        </Checkbox>
      </label>

      {/* reCAPTCHA text + icon */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 relative">
          <Image
            fill
            alt="reCAPTCHA"
            className="object-contain"
            sizes="50px"
            src="/recaptcha.svg"
          />
        </div>
      </div>
    </div>
  )
}
