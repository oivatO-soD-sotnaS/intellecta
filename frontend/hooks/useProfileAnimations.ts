"use client"
import React from "react"

export function useProfileAnimations(
  isLoading: boolean,
  user: any,
  errors: Record<string, unknown>
) {
  React.useEffect(() => {
    if (!isLoading && user) {
      // importa dinamicamente só quando precisar
      import("../animations/profileAnimations").then(
        ({ runProfileLoadAnimation }) => {
          runProfileLoadAnimation()
        }
      )
    }
  }, [isLoading, user])

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      import("../animations/profileAnimations").then(
        ({ runProfileShakeAnimation }) => {
          runProfileShakeAnimation()
        }
      )
    }
  }, [errors])
}
