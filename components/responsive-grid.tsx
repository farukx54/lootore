"use client"

import { cn } from "@/lib/utils"
import type React from "react"

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: {
    default: number
    sm?: number
    md?: number
    lg?: number
  }
}

export default function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  gap = { default: 4, md: 6 },
}: ResponsiveGridProps) {
  // Generate the grid columns classes
  const gridColsClasses = [
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean)

  // Generate the gap classes
  const gapClasses = [
    `gap-${gap.default}`,
    gap.sm && `sm:gap-${gap.sm}`,
    gap.md && `md:gap-${gap.md}`,
    gap.lg && `lg:gap-${gap.lg}`,
  ].filter(Boolean)

  return <div className={cn("grid w-full max-w-full", ...gridColsClasses, ...gapClasses, className)}>{children}</div>
}
