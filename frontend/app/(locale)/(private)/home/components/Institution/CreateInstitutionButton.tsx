// components/ui/CreateInstitutionButton.tsx
import React from "react"
import { Button } from "@heroui/button"
import { PlusIcon } from "lucide-react"

interface CreateInstitutionButtonProps {
  onClick: () => void
}

export const CreateInstitutionButton: React.FC<
  CreateInstitutionButtonProps
> = ({ onClick }) => {
  return (
    <Button
      className={`
        flex items-center gap-2
        bg-gradient-to-r from-blue-500 to-purple-600
        hover:from-blue-600 hover:to-purple-700
        text-white font-semibold
        px-4 py-2
        rounded-full
        shadow-lg
        transition-all duration-200
      `}
      size="md"
      variant="solid"
      onClick={onClick}
    >
      <PlusIcon className="w-5 h-5" />
      Criar Instituição
    </Button>
  )
}
