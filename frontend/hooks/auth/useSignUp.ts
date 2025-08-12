// hooks/auth/useSignUp.ts
import { signUp } from "@/app/(locale)/(public)/sign-up/services/authService"
import type { SignUpFormData } from "@/app/(locale)/(public)/_components/signUp/signUpForm.schema"
import { useMutation } from "@tanstack/react-query"

export function useSignUp(
  onSuccess: (email: string) => void,
  onError: (msg: string) => void
) {
  return useMutation<void, Error, SignUpFormData>({
    mutationFn: signUp,
    onSuccess: (_data, variables) => {
      onSuccess(variables.email.trim())
    },
    onError: (err) => {
      let errorMessage = "Erro desconhecido."

      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === "string") {
        errorMessage = err
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = (err as any).message
      }

      onError(errorMessage)
    },
  })
}
