// app/(locale)/(private)/profile/animations/profileAnimations.ts
import { createTimeline, animate } from "animejs"

export function runProfileLoadAnimation() {
  const tl = createTimeline({
    defaults: { ease: "outQuad", duration: 500 },
  })

  tl.add(
    ".profile-avatar",
    {
      opacity: [0, 1],
      scale: [0.8, 1],
      ease: "easeOutElastic(1,.6)",
      duration: 800,
    },
    0
  )
    .add(".profile-title", { opacity: [0, 1], translateY: [20, 0] }, "-=400")
    .add(
      ".form-field",
      { opacity: [0, 1], translateX: [30, 0], delay: (_el, i) => i * 100 },
      "-=300"
    )
}

export function runProfileShakeAnimation() {
  animate(".form-field.is-invalid", {
    translateX: [-5, 5, -5, 5, 0],
    duration: 400,
    ease: "inOutQuad",
  })
}
