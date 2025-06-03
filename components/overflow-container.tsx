"use client"

import { cn } from "@/lib/utils"
import type React from "react"

interface OverflowContainerProps {
  children: React.ReactNode
  className?: string
  allowHorizontalScroll?: boolean
  maxWidth?: string
  padding?: string
}

export default function OverflowContainer({
  children,
  className,
  allowHorizontalScroll = false,
  maxWidth = "max-w-full",
  padding = "px-4",
}: OverflowContainerProps) {
  return (
    <div
      className={cn(
        "w-full relative",
        maxWidth,
        padding,
        allowHorizontalScroll ? "overflow-x-auto overflow-x-auto-with-padding" : "overflow-x-hidden",
        className,
      )}
    >
      <div className={cn("w-full", allowHorizontalScroll ? "min-w-max" : "max-w-full")}>{children}</div>
    </div>
  )
}
