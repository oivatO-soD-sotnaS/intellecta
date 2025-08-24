// app/(locale)/(public)/_components/signUp/signUpForm.schema.ts
import { z } from "zod"

export const signUpFormSchema = z.object({
  email: z.string().email({ message: "Digite um e-mail válido." }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter ao menos 8 caracteres." })
    .regex(/[A-Z]/, {
      message: "A senha deve incluir pelo menos 1 letra maiúscula.",
    })
    .regex(/[a-z]/, {
      message: "A senha deve incluir pelo menos 1 letra minúscula.",
    })
    .regex(/[0-9]/, { message: "A senha deve incluir pelo menos 1 número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "A senha deve incluir pelo menos 1 símbolo.",
    }),
  isHuman: z.boolean().refine((value) => value === true, {
    message: "Você deve confirmar que não é um robô.",
  }),
})

export type SignUpFormData = z.infer<typeof signUpFormSchema>
