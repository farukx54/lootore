"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePageLoad } from "@/hooks/use-page-load"
import { usePreloadImages } from "@/hooks/use-preload-images"
import { LoadingAnimation } from "@/components/loading-animation"

export default function LoadingScreen() {
  const [showLoader, setShowLoader] = useState(true)
  const { isLoaded, loadProgress } = usePageLoad()

  // Preload critical images
  usePreloadImages()

  // Hide loader after page is loaded with a slight delay for smooth transition
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setShowLoader(false)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  return (
    <AnimatePresence mode="wait">
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          <div className="relative flex flex-col items-center">
            {/* Loading Animation */}
            <div className="mb-8">
              <LoadingAnimation />
            </div>

            {/* Loading Bar */}
            <div className="relative h-2 w-72 overflow-hidden rounded-full bg-gray-800 sm:w-80 md:w-96">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 10 }}
                className="absolute inset-0 bg-gradient-to-r from-[#9146FF] to-[#00FF00]"
              />
            </div>

            {/* Loading Text */}
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="mt-4 text-center text-sm text-gray-400"
            >
              {loadProgress >= 100 ? (
                "Launching LootOre..."
              ) : (
                <>
                  Preparing your gaming experience
                  <motion.span
                    animate={{ opacity: [0, 1, 1, 1, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, times: [0, 0.25, 0.5, 0.75, 1] }}
                  >
                    ...
                  </motion.span>
                </>
              )}
            </motion.p>

            {/* Decorative Elements */}
            <div className="absolute -z-10 opacity-20">
              <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#9146FF] blur-3xl" />
              <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#00FF00] blur-3xl" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
