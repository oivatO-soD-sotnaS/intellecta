import axios from "axios"
import { SignUpFormData } from "../schemas/signUp.schema"

export async function signUp(data: SignUpFormData): Promise<void> {
  await axios.post("/api/sign-up", {
    full_name: data.fullName.trim(),
    email: data.email.trim(),
    password: data.password,
  })
}

export async function verifyEmail(payload: {
  email: string
  verification_code: string
}): Promise<void> {
  await axios.post("/api/verify-email", payload)
}
