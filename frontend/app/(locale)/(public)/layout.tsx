import type { Metadata } from "next";
import "../../../styles/globals.css";

export const metadata: Metadata = {
  title: "Intellecta",
  description: "Sua plataforma educacional integrada",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>

}
