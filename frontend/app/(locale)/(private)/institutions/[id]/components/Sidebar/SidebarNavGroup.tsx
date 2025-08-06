"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MenuItem } from "../../schema/menuSchema"

interface SidebarNavGroupProps {
  items: MenuItem[]
  collapsed: boolean
}

export default function SidebarNavGroup({
  items,
  collapsed,
}: SidebarNavGroupProps) {
  const path = usePathname()

  return (
    <ul className="mt-4 space-y-1">
      {items.map((item) => {
        const isActive = path === item.href
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              className={`
                flex items-center px-4 py-2 rounded 
                ${isActive ? "bg-violet-100 font-medium" : "hover:bg-gray-100"}
              `}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
