import type { Metadata } from "next";
import "../../../styles/globals.css";
import { ThemeSwitch } from "@/components/theme-switch";

export const metadata: Metadata = {
  title: "Intellecta",
  description: "Sua plataforma educacional integrada",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
    {children}
    <ThemeSwitch className="absolute top-4 right-4 z-50" />
    </>

}
