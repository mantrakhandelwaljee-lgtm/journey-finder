"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const TRANSPORT_EMOJIS = ["🚗", "🚄", "✈️", "🚌", "🚢", "🚖", "🚡", "🛴", "🛵", "🏍️"]

interface EmojiLoaderProps {
  message?: string
}

export function EmojiLoader({ message = "Loading..." }: EmojiLoaderProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % TRANSPORT_EMOJIS.length)
    }, 500) // Change emoji every 500ms
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-12 w-full h-full min-h-[40vh]">
      <div className="relative h-20 w-20 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute text-6xl"
          >
            {TRANSPORT_EMOJIS[index]}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  )
}
