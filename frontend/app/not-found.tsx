"use client";

import { Button } from "@heroui/button";
import { SearchX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeSwitch } from "@/components/theme-switch";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-background to-muted/40">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center p-8 bg-card border rounded-2xl shadow-sm"
            >
                <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <SearchX className="w-7 h-7 text-blue-600" />
                </div>

                <h1 className="text-2xl font-semibold mb-2 text-foreground">
                    Página não encontrada
                </h1>

                <p className="text-muted-foreground mb-6">
                    A página que você procura não existe, foi movida ou está indisponível no momento.
                </p>

                <Link href="/home">
                    <Button
                        color="primary"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        Voltar
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
            </motion.div>

            <ThemeSwitch className="absolute top-4 right-4 z-50" />
        </div>
    );
}
