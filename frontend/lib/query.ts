// lib/query.ts
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query"
import { AppError } from "@/lib/http"
import { presentErrorToast } from "@/components/ErrorPresenter"

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const err =
        error instanceof AppError ? error : new AppError({ title: "Erro" })
      presentErrorToast(err)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const err =
        error instanceof AppError ? error : new AppError({ title: "Erro" })
      presentErrorToast(err)
    },
  }),
})
