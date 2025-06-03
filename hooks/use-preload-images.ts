"use client"

import { useEffect } from "react"

// List of critical images to preload
const CRITICAL_IMAGES = [
  "/neon-fracture.png",
  "/digital-weave.png",
  "/neon-city-stream.png",
  "/intense-fps-action.png",
  "/epic-moba-battle.png",
  "/intense-battle-royale.png",
]

export function usePreloadImages() {
  useEffect(() => {
    // Preload critical images
    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])
}
