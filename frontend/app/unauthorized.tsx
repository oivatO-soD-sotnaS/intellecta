"use client";

import { Button } from "@heroui/button";
import { AlertTriangle, LogIn } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeSwitch } from "@/components/theme-switch";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-background to-muted/40">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center p-8 bg-card border rounded-2xl shadow-sm"
            >
                <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>

                <h1 className="text-2xl font-semibold mb-2 text-foreground">
                Sessão expirada
                </h1>

                <p className="text-muted-foreground mb-6">
                Seu token de autenticação expirou.  
                Faça login novamente para continuar usando a plataforma.
                </p>

                <Link href="/sign-in">
                <Button
                    color="primary"
                    className="w-full flex items-center justify-center gap-2"
                >
                    Fazer login novamente
                    <LogIn className="w-4 h-4" />
                </Button>
                </Link>
            </motion.div>
            <ThemeSwitch className="absolute top-4 right-4 z-50" />
        </div>
    );
}
