"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface WordDropRevealProps {
  children: React.ReactNode
  words: string[]
  className?: string
  startDelay?: number
}

// Anchor-style card colors — warm palette variants
const cardStyles = [
  { bg: "#2B3A2E", text: "#FFFDF9", width: "180px" },   // Deep forest green
  { bg: "#FFFDF9", text: "#2B211B", width: "170px", border: "#D4C4B5" },  // Cream outlined
  { bg: "#E8C9AD", text: "#5A3E2B", width: "160px" },   // Warm peach
  { bg: "#B77B5D", text: "#FFFDF9", width: "155px" },   // Terracotta
  { bg: "#2B211B", text: "#FFFDF9", width: "200px" },   // Deep espresso
]

// Organic scattered positions (percentage-based, like Anchor's layout)
// Each card has: x offset from center, y offset, rotation
const cardPositions = [
  { x: -120, y: -30, rotate: -6 },    // Top-left, tilted
  { x: 100,  y: -20, rotate: 4 },     // Top-right
  { x: -30,  y: 10,  rotate: -2 },    // Center-left
  { x: -140, y: 50,  rotate: 3 },     // Bottom-left
  { x: 80,   y: 45,  rotate: -3 },    // Bottom-right
]

export function WordDropReveal({ children, words, className = "", startDelay = 0 }: WordDropRevealProps) {
  const [started, setStarted] = useState(false)
  const [droppedCount, setDroppedCount] = useState(0)

  const totalCards = words.length
  const allDropped = droppedCount >= totalCards

  // Start the drop sequence after startDelay
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay * 1000)
    return () => clearTimeout(timer)
  }, [startDelay])

  // Drop cards one by one
  useEffect(() => {
    if (!started || droppedCount >= totalCards) return
    const timer = setTimeout(() => {
      setDroppedCount(prev => prev + 1)
    }, 320)
    return () => clearTimeout(timer)
  }, [started, droppedCount, totalCards])

  return (
    <div className={`relative ${className}`}>

      {/* Headline — hidden initially, revealed after all cards drop */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={allDropped
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 24, filter: "blur(10px)" }
        }
        transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] as const }}
        className="w-full"
      >
        {children}
      </motion.div>

      {/* Scattered card layout overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: "800px" }}
      >
        <AnimatePresence mode="popLayout">
          {words.map((word, index) => {
            if (index < droppedCount) return null

            const style = cardStyles[index % cardStyles.length]
            const pos = cardPositions[index % cardPositions.length]
            const stackOrder = totalCards - index

            return (
              <motion.div
                key={word}
                layout
                initial={{
                  x: pos.x,
                  y: pos.y,
                  rotate: pos.rotate,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  rotate: pos.rotate,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  y: pos.y + 500,
                  x: pos.x + (index % 2 === 0 ? -40 : 40),
                  rotate: pos.rotate + (index % 2 === 0 ? -12 : 12),
                  opacity: 0,
                  scale: 0.85,
                  transition: {
                    duration: 0.75,
                    ease: [0.55, 0.085, 0.68, 0.53] as const,
                  }
                }}
                className="absolute rounded-xl sm:rounded-2xl px-5 py-2.5 sm:px-7 sm:py-3.5 pointer-events-auto"
                style={{
                  zIndex: stackOrder,
                  backgroundColor: style.bg,
                  color: style.text,
                  minWidth: style.width,
                  border: style.border ? `1.5px solid ${style.border}` : "none",
                  boxShadow: "0 10px 40px rgba(43,33,27,0.15), 0 2px 8px rgba(43,33,27,0.08)",
                }}
              >
                <span className="font-heading font-semibold text-base sm:text-lg md:text-xl tracking-tight select-none whitespace-nowrap">
                  {word}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
