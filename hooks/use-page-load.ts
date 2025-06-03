"use client"

import { useState, useEffect } from "react"

export function usePageLoad() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    // Check if the page is already loaded
    if (document.readyState === "complete") {
      setIsLoaded(true)
      setLoadProgress(100)
      return
    }

    // Track loading progress
    let progressInterval: NodeJS.Timeout

    // Start with artificial progress
    progressInterval = setInterval(() => {
      setLoadProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 5, 90)
        return newProgress
      })
    }, 200)

    // Handle page load completion
    const handleLoad = () => {
      clearInterval(progressInterval)
      setLoadProgress(100)

      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoaded(true)
      }, 500)
    }

    window.addEventListener("load", handleLoad)

    return () => {
      clearInterval(progressInterval)
      window.removeEventListener("load", handleLoad)
    }
  }, [])

  return { isLoaded, loadProgress }
}
