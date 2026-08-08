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
  magnifierSize = 190, 
  scale = 1.5 
}: HeroMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  
  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth following (premium Apple-like feel)
  const springX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.5 })

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
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
      className="relative block w-full cursor-default"
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
            background: "#fff4ed",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.1), inset 0 0 40px rgba(255,255,255,0.5), inset 0 4px 10px rgba(255,255,255,0.8)",
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
              width: containerSize.width || "100%",
              height: containerSize.height || "100%",
              x: innerX,
              y: innerY,
              scale: scale,
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
