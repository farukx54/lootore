"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export default function ResponsiveImage({
  src,
  alt,
  className,
  width,
  height,
  sizes = "(max-width: 480px) 100vw, (max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
  quality = 75, // Reduced quality for better performance
  fill = false,
  objectFit = "cover",
}: ResponsiveImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {fill ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill={true}
          sizes={sizes}
          priority={priority}
          quality={quality}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "transition-all duration-300",
            objectFit === "contain" && "object-contain",
            objectFit === "cover" && "object-cover",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down",
          )}
        />
      ) : (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width || 1200}
          height={height || 800}
          sizes={sizes}
          priority={priority}
          quality={quality}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "w-full h-auto transition-all duration-300",
            objectFit === "contain" && "object-contain",
            objectFit === "cover" && "object-cover",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down",
          )}
        />
      )}
    </div>
  )
}
