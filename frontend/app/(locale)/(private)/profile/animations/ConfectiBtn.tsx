"use client"

import React, { useRef } from "react"
import { animate } from "animejs"
import { Button } from "@heroui/button"

export function ConfettiButton() {
  const containerRef = useRef<HTMLDivElement>(null)

  const fireConfetti = () => {
    const container = containerRef.current!
    const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#A78BFA"]

    for (let i = 0; i < 50; i++) {
      const confetto = document.createElement("div")
      const size = Math.random() * 8 + 4

      Object.assign(confetto.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size * 0.4}px`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        top: "50%",
        left: "50%",
        borderRadius: "2px",
        pointerEvents: "none",
      })

      container.appendChild(confetto)

      const angle = Math.random() * Math.PI * 2
      const velocity = Math.random() * 120 + 80
      const gravity = 400

      animate(confetto, {
        translateX: [
          { value: Math.cos(angle) * velocity, duration: 800 },
          { value: Math.cos(angle) * velocity * 1.2, duration: 400 },
        ],
        translateY: [
          {
            value: Math.sin(angle) * velocity - 200,
            duration: 800,
            easing: "easeOutQuad",
          },
          { value: gravity * 0.4, duration: 400, easing: "easeInQuad" },
        ],
        rotate: () => Math.random() * 360,
        opacity: [
          { value: 1, duration: 100 },
          { value: 0, duration: 1100 },
        ],
        easing: "linear",
        duration: 1200,
        complete: () => {
          confetto.remove()
        },
      })
    }
  }


  return (
    <>
      {/* Container full-screen para os confetes */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      />
      {/* Seu botão em qualquer lugar */}
      <div className="relative z-50">
        <Button onPress={fireConfetti}>🎉 Celebrar</Button>
      </div>
    </>
  )
}
