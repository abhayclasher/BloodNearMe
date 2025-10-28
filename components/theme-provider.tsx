"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always set dark theme
    document.documentElement.setAttribute("data-theme", "dark")
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <div data-theme-context="dark">
      {children}
    </div>
  )
}
