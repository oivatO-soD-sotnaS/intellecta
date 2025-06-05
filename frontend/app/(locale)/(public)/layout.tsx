/* eslint-disable prettier/prettier */
import "@/styles/globals.css"

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col justify-between">
      <div>{children}</div>
      <p className="text-gray-500 text-xs mx-auto">
        &copy;2025 IFPR by Davyd & Otavio
      </p>
    </div>
  )
}
