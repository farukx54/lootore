"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface AccessibleButtonProps extends ButtonProps {
  ariaLabel?: string
  ariaDescribedBy?: string
  isLoading?: boolean
  loadingText?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, ariaLabel, ariaDescribedBy, isLoading, loadingText, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading}
        className={cn(
          "focus:ring-2 focus:ring-[#9146FF] focus:ring-offset-2 focus:ring-offset-black",
          "transition-all duration-200",
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="sr-only">{loadingText || "Yükleniyor..."}</span>
            {loadingText && <span aria-hidden="true">{loadingText}</span>}
          </div>
        ) : (
          children
        )}
      </Button>
    )
  },
)

AccessibleButton.displayName = "AccessibleButton"
