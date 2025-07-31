"use client"

import React from "react"
import Link from "next/link"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover"
import { Avatar } from "@heroui/avatar"
import { Bell, ChevronDown } from "lucide-react"
import { Badge } from "@heroui/badge"
import clsx from "clsx"

import { ThemeSwitch } from "@/components/theme-switch"

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

export const Header: React.FC<HeaderProps> = ({ className, ...htmlProps }) => {
  return (
    <header
      className={clsx(
        "sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm w-full",
        className
      )}
      {...htmlProps}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center space-x-2" href="/home">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Intellecta
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 mx-6 max-w-lg">
          <Input
            classNames={{
              inputWrapper: "rounded-full px-4",
            }}
            label=""
            placeholder="Buscar instituições, atividades..."
            variant="faded"
          />
        </div>

        {/* Actions: notifications + user */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="relative p-2" variant="flat">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <Badge
                  className="absolute -top-1 -right-1"
                  color="danger"
                  size="sm"
                >
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <h4 className="font-semibold mb-2">Notificações</h4>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {/* Mapeie aqui sua lista de notificações */}
                <div className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <Bell className="h-5 w-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-sm">
                      <strong>Prova de Física III</strong> - Amanhã às 14:00
                    </p>
                    <span className="text-xs text-gray-500">2 horas atrás</span>
                  </div>
                </div>
                {/* ... */}
              </div>
              <div className="mt-3 text-right">
                <Button size="sm" variant="flat">
                  Marcar todas como lidas
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Menu do Usuário */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex items-center space-x-2" variant="flat">
                <Avatar alt="Ana Silva" size="sm" src="#" />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Ana Silva
                </span>
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="flex items-center gap-2 mb-3">
                <Avatar alt="Ana Silva" size="md" src="#" />
                <div>
                  <p className="font-medium">Ana Silva</p>
                  <p className="text-xs text-gray-500">ana.silva@email.com</p>
                </div>
              </div>
              <ul className="space-y-1">
                <li>
                  <Button className="w-full justify-start" variant="flat">
                    Meu Perfil
                  </Button>
                </li>
                <li>
                  <Button className="w-full justify-start" variant="flat">
                    Configurações
                  </Button>
                </li>
                <li>
                  <Button className="w-full justify-start" variant="flat">
                    Ajuda
                  </Button>
                </li>
                <li>
                  <Button
                    className="w-full justify-start text-danger"
                    variant="flat"
                  >
                    Sair
                  </Button>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* ThemeSwitch */}
      <ThemeSwitch className="absolute top-4 right-4 z-50" />
    </header>
  )
}
