"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EmojiLoader } from "./emoji-loader"

export function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
        >
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-primary">JourneyFinder</h2>
          </div>
          <EmojiLoader message="Getting things ready..." />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
