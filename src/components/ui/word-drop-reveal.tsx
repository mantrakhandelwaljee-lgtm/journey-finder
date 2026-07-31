"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

interface WordDropRevealProps {
  words: string[]
  className?: string
  startDelay?: number
  onAllLanded?: () => void
}

// Anchor-style card colors — warm palette variants
const cardStyles = [
  { bg: "#2B3A2E", text: "#FFFDF9" },       // Deep forest green
  { bg: "#FFFDF9", text: "#2B211B", border: "#D4C4B5" },  // Cream outlined
  { bg: "#E8C9AD", text: "#5A3E2B" },       // Warm peach
  { bg: "#B77B5D", text: "#FFFDF9" },       // Terracotta
  { bg: "#2B211B", text: "#FFFDF9" },       // Deep espresso
]

// Final resting positions — scattered organic layout at the bottom
// x: offset from center, y: final y position, rotate: final rotation, width
const finalPositions = [
  { x: -140, y: 0, rotate: -5, width: "180px" },    // Left
  { x: 90,   y: -10, rotate: 3, width: "170px" },   // Right-ish
  { x: -20,  y: 20, rotate: -1.5, width: "160px" }, // Center
  { x: -160, y: 45, rotate: 4, width: "165px" },    // Bottom-left
  { x: 70,   y: 40, rotate: -2.5, width: "210px" }, // Bottom-right
]

export function WordDropReveal({ words, className = "", startDelay = 0, onAllLanded }: WordDropRevealProps) {
  const [landedCount, setLandedCount] = useState(0)
  const [animateCards, setAnimateCards] = useState(false)

  const totalCards = words.length

  // Start animation after delay
  useEffect(() => {
    const timer = setTimeout(() => setAnimateCards(true), startDelay * 1000)
    return () => clearTimeout(timer)
  }, [startDelay])

  // Called when each card finishes its landing animation
  const handleCardLanded = useCallback(() => {
    setLandedCount(prev => {
      const next = prev + 1
      if (next >= totalCards && onAllLanded) {
        // Small delay after last card lands before revealing content
        setTimeout(onAllLanded, 200)
      }
      return next
    })
  }, [totalCards, onAllLanded])

  return (
    <div className={`relative ${className}`}>
      {/* Cards container */}
      <div className="relative w-full flex items-center justify-center" style={{ height: "120px" }}>
        {words.map((word, index) => {
          const style = cardStyles[index % cardStyles.length]
          const pos = finalPositions[index % finalPositions.length]

          return (
            <motion.div
              key={word}
              initial={{
                y: -500 - (index * 60), // Start stacked above viewport
                x: pos.x,
                rotate: 0,
                opacity: 0,
                scale: 0.9,
              }}
              animate={animateCards ? {
                y: pos.y,
                x: pos.x,
                rotate: pos.rotate,
                opacity: 1,
                scale: 1,
              } : undefined}
              transition={{
                duration: 0.85,
                delay: index * 0.18,  // Stagger each card
                ease: [0.34, 1.56, 0.64, 1] as const, // Bouncy spring-like landing
              }}
              onAnimationComplete={() => {
                if (animateCards) handleCardLanded()
              }}
              className="absolute rounded-xl sm:rounded-2xl px-5 py-2.5 sm:px-7 sm:py-3.5"
              style={{
                zIndex: totalCards - index,
                backgroundColor: style.bg,
                color: style.text,
                minWidth: pos.width,
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
      </div>
    </div>
  )
}
