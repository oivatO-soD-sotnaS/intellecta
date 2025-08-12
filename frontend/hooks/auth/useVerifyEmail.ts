// hooks/auth/useVerifyEmail.ts
import { useMutation } from "@tanstack/react-query"
import { verifyEmail } from "@/app/(locale)/(public)/sign-up/services/authService"

export function useVerifyEmail(
  onSuccess: () => void,
  onError: (msg: string) => void
) {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => onSuccess(),
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Falha ao verificar o código. Tente novamente."
      onError(msg)
    },
  })
}
