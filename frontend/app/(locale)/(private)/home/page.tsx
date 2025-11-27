// app/(locale)/(private)/home/page.tsx
import { cookies } from "next/headers";

import HomeClient from "./components/HomeClient";
import DashboardBanner from "./components/DashboardBanner";

import { SessionGuard } from "@/components/SessionGuar";

function parseJwt(token: string): { [key: string]: any } {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = Buffer.from(base64, "base64").toString("utf8");

  return JSON.parse(jsonPayload);
}

export default async function HomePage() {
  const token = (await cookies()).get("token")?.value;

  const nowISO = new Date().toISOString();

  if (!token) {
    return <SessionGuard />;
  }

  // 2) tenta extrair o sub (userId) do payload
  let userId: string;

  try {
    userId = parseJwt(token).sub;
    if (!userId) throw new Error("JWT sem sub");
  } catch (e) {
    console.error("JWT inválido:", e);

    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-red-600">
          Erro ao processar autenticação. Faça login novamente.
        </p>
      </div>
    );
  }

  let user: {
    user_id: string;
    full_name: string;
    email: string;
    profile_picture_id?: string;
  };

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Status " + res.status);
    user = await res.json();
  } catch (e) {
    console.error("Erro ao buscar usuário:", e);

    return <SessionGuard />
  }

  const firstName = user.full_name.split(" ")[0];

  return (
    <>
      <DashboardBanner
        name={firstName}
        nowISO={nowISO}
        stats={{ activities: 12, events: 7, messages: 15 }}
      />
      <HomeClient user={user} />
      <hr />
    </>
  );
}
