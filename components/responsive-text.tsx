"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  truncate?: boolean
  lines?: number
}

export default function ResponsiveText({
  children,
  className,
  as: Component = "p",
  truncate = false,
  lines,
}: ResponsiveTextProps) {
  return (
    <Component
      className={cn(
        "max-w-full break-words-all text-balance",
        truncate && !lines && "truncate",
        lines && `line-clamp-${lines}`,
        className,
      )}
    >
      {children}
    </Component>
  )
}
