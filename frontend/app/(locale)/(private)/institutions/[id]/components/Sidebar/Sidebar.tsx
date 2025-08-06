// app/(locale)/(private)/institution/[id]/components/Sidebar/Sidebar.tsx
"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { useSidebarStore } from "@/store/sidebarStore"
import SidebarHeader from "./SidebarHeader"
import SidebarNavGroup from "./SidebarNavGroup"

// 📌 Import correto:
import { menuItems } from "../../schema/menuItems"

export default function Sidebar() {
  const params = useParams()
  const institutionId = Array.isArray(params.id) ? params.id[0] : params.id
  if (!institutionId) return null

  const { collapsed } = useSidebarStore()

  const itemsWithId = menuItems.map((item) => ({
    ...item,
    href: item.href.replace("[id]", institutionId),
  }))

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      className="h-full bg-white border-r overflow-hidden flex flex-col"
    >
      <SidebarHeader />
      <nav className="flex-1 overflow-y-auto">
        <SidebarNavGroup items={itemsWithId} collapsed={collapsed} />
      </nav>
    </motion.aside>
  )
}
