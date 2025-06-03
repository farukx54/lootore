"use client"

import { motion } from "framer-motion"
import { Gift, Monitor, Coins } from "lucide-react"

export function LoadingAnimation() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="relative h-36 w-36 rounded-full border border-gray-800 sm:h-40 sm:w-40"
        >
          {/* Orbiting Icons */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
          >
            <Monitor className="h-6 w-6 text-[#9146FF]" />
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 1.6 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
          >
            <Gift className="h-6 w-6 text-[#00FF00]" />
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 3.3 }}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Coins className="h-6 w-6 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Center Logo Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
        className="z-10 flex h-24 w-24 items-center justify-center rounded-full bg-black sm:h-28 sm:w-28"
      >
        <span className="text-lg font-extrabold sm:text-xl">
          <span className="animate-gradient-text bg-gradient-to-r from-[#9146FF] via-white to-[#00FF00] bg-clip-text text-transparent">
            LootOre
          </span>
        </span>
      </motion.div>
    </div>
  )
}
