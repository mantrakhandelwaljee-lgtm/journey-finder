"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion"

interface HeroMagnifierProps {
  children: React.ReactNode
  magnifierSize?: number
  scale?: number
}

export function HeroMagnifier({ 
  children, 
  magnifierSize = 160, 
  scale = 2 
}: HeroMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  
  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth following (premium Apple-like feel)
  const springX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.5 })

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  // Calculate inner content offset to perfectly align the magnified area.
  // The center of the magnifier is at (springX, springY).
  // We need to shift the inner content so that the point (springX, springY)
  // ends up exactly at the center of the magnifier circle, scaled up.
  const innerX = useTransform(springX, (x) => -x * scale + magnifierSize / 2)
  const innerY = useTransform(springY, (y) => -y * scale + magnifierSize / 2)

  return (
    <div 
      ref={containerRef}
      className="relative inline-block cursor-default"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isTouch && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Base content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Magnifier Glass */}
      {!isTouch && (
        <motion.div
          className="absolute z-50 pointer-events-none rounded-full overflow-hidden"
          style={{
            width: magnifierSize,
            height: magnifierSize,
            left: springX,
            top: springY,
            x: "-50%", // Center the bubble on the cursor
            y: "-50%",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 0 20px rgba(255,255,255,0.4), 0 0 15px rgba(255,255,255,0.2)",
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.9,
          }}
          initial={false}
          animate={{ 
            opacity: isHovering ? 1 : 0, 
            scale: isHovering ? 1 : 0.9 
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {/* Inner magnified content */}
          <motion.div
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{
              x: innerX,
              y: innerY,
              scale: scale,
            }}
          >
            {/* 
              Re-rendering children here so it aligns perfectly.
              This guarantees crisp text rendering at 2x scale because it's real text,
              not an image or canvas snapshot.
            */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
