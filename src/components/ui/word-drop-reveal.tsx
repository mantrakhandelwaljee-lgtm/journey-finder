"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface WordDropRevealProps {
  children: React.ReactNode // The final headline text
  words: string[] // The words on the cards
  className?: string
}

export function WordDropReveal({ children, words, className = "" }: WordDropRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Trigger when 60-70% is in view, but since it's a hero it might already be in view. 
  // Margin -20% means it needs to be 20% into the viewport to trigger.
  const isInView = useInView(containerRef, { once: true, margin: "-20% 0px" })

  // Premium gravity-inspired cubic bezier ease-out
  const dropEase = [0.22, 0.61, 0.36, 1] as const

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      
      {/* Underlying Headline Layer */}
      <motion.div
        initial={{ opacity: 0.8, y: 10, filter: "blur(6px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0.8, y: 10, filter: "blur(6px)" }}
        transition={{ duration: 0.8, delay: 0.1, ease: dropEase }}
        className="relative z-0 flex items-center justify-center w-full min-h-[120px] sm:min-h-[160px] md:min-h-[200px]"
      >
        {children}
      </motion.div>

      {/* Covering Word Cards Layer */}
      <div className="absolute inset-0 z-10 flex flex-wrap justify-center items-center gap-3 sm:gap-4 p-2 sm:p-4 pointer-events-none">
        {words.map((word, index) => {
          // Alternate slight rotation direction for organic feel
          const rotateDest = index % 2 === 0 ? 3 + (index * 0.5) : -3 - (index * 0.5)
          
          return (
            <motion.div
              key={index}
              initial={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
              animate={isInView ? { 
                y: 200, 
                rotate: rotateDest, 
                opacity: 0, 
                scale: 0.96 
              } : { 
                y: 0, 
                rotate: 0, 
                opacity: 1, 
                scale: 1 
              }}
              transition={{
                duration: 0.9,
                delay: index * 0.2, // 200ms stagger between cards
                ease: dropEase
              }}
              className="pointer-events-auto bg-[#FFFDF9] border border-[#E7D8CB] shadow-[0_8px_30px_rgba(43,33,27,0.08)] rounded-xl sm:rounded-2xl px-6 py-3 sm:px-8 sm:py-4 text-[#2B211B] font-sans font-medium text-lg sm:text-2xl md:text-3xl"
            >
              {word}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
