// app/api/files/upload-profile-assets/route.ts
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("token")?.value

  const form = await req.formData()

  const forward = new FormData()

  form.forEach((value, key) => {
    if (value instanceof File) {
      console.log("FILE:", key, value.name, value.type, value.size)

      forward.append(key, value, value.name)
    } else {
      console.log("FIELD:", key, value)
      forward.append(key, value)
    }
  })

  return fetch("http://api.intellecta/files/upload-profile-assets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: forward,
  })
}
