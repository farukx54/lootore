"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: string
  preventOverflow?: boolean
}

export default function ResponsiveContainer({
  children,
  className,
  maxWidth = "max-w-7xl",
  preventOverflow = true,
}: ResponsiveContainerProps) {
  // Determine if this container is within the rewards redemption section
  const isRedemptionSection = className?.includes("rewards-redemption-section")

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 relative",
        preventOverflow && !isRedemptionSection && "overflow-hidden",
        maxWidth,
        className,
      )}
    >
      <div
        className="w-full max-w-full"
        style={{
          overflow: isRedemptionSection ? "visible" : preventOverflow ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  )
}
