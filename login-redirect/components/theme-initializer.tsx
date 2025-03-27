"use client"

import { useEffect } from "react"
import { getDarkMode, setDarkMode } from "@/lib/theme-utils"

export function ThemeInitializer() {
  useEffect(() => {
    // Use a timeout to ensure this runs after React has fully initialized
    const timer = setTimeout(() => {
      try {
        const isDark = getDarkMode()
        setDarkMode(isDark)
      } catch (e) {
        console.error("Error initializing theme", e)
      }
    }, 100) // Small delay to ensure React is ready

    return () => clearTimeout(timer)
  }, [])

  return null
}