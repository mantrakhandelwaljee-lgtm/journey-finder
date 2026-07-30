"use client"
import React, { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion"
import { JourneyRadialCard } from "@/components/journey/journey-radial-card"
import { useRouter } from "next/navigation"

interface RadialCarouselProps {
  items: any[]
  radius?: number
}

export function RadialCarousel({ items, radius = 450 }: RadialCarouselProps) {
  const router = useRouter()
  const count = items.length
  
  // The current rotation of the carousel in degrees
  const rotationValue = useMotionValue(0)
  const springRotation = useSpring(rotationValue, {
    stiffness: 150,
    damping: 25,
    mass: 1.2
  })

  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRotation = useRef(0)

  // Auto-rotation
  useEffect(() => {
    if (isHovering || count <= 1) return
    
    const animation = animate(rotationValue, rotationValue.get() - 0.2, {
      ease: "linear",
      duration: 0.1,
      repeat: Infinity,
      onUpdate: (latest) => {
        // Calculate active index based on rotation
        const normalizedRotation = ((latest % 360) + 360) % 360
        const anglePerItem = 360 / count
        // The top of the circle is at 270 degrees in standard trig, but we'll align the active item to the top.
        // Actually, we align index 0 to 90 degrees (bottom) or 270 degrees (top). Let's say active is at the bottom (90 deg).
        // It's easier to just calculate which item is closest to the focal point.
      }
    })
    
    return () => animation.stop()
  }, [isHovering, rotationValue, count])

  // Track active index based on spring rotation
  useEffect(() => {
    const unsubscribe = springRotation.on("change", (latest) => {
      const anglePerItem = 360 / count
      // We assume the focal point is at the bottom (angle 90 in our calculation).
      // itemAngle = (index * anglePerItem) + latest
      // We want to find the index where itemAngle % 360 is closest to 90.
      
      let closestIdx = 0
      let minDiff = Infinity
      
      for (let i = 0; i < count; i++) {
        const rawAngle = (i * anglePerItem) + latest
        const normalized = ((rawAngle % 360) + 360) % 360
        
        // Focal point is bottom of circle (90 degrees). We can change this to top (270) if we want the wheel above.
        // Let's use 90 degrees.
        const diff = Math.min(Math.abs(normalized - 90), 360 - Math.abs(normalized - 90))
        
        if (diff < minDiff) {
          minDiff = diff
          closestIdx = i
        }
      }
      
      setActiveIndex(closestIdx)
    })
    
    return () => unsubscribe()
  }, [springRotation, count])

  if (!items || items.length === 0) return null

  const handleDragStart = () => {
    setIsHovering(true)
    dragStartRotation.current = rotationValue.get()
  }

  const handleDrag = (event: any, info: any) => {
    // Convert horizontal drag to rotation
    const dragAmount = info.offset.x * 0.5
    rotationValue.set(dragStartRotation.current + dragAmount)
  }

  const handleDragEnd = (event: any, info: any) => {
    setIsHovering(false)
    // Add momentum
    const velocity = info.velocity.x * 0.1
    const newRotation = rotationValue.get() + velocity
    
    // Snap to nearest item
    const anglePerItem = 360 / count
    // Find the nearest rotation that aligns an item to 90 degrees
    const currentRot = newRotation
    
    // This math snaps the wheel so the closest item is exactly at 90 deg
    const targetIdx = Math.round((90 - currentRot) / anglePerItem)
    const snappedRotation = 90 - (targetIdx * anglePerItem)
    
    rotationValue.set(snappedRotation)
  }

  const handleCardClick = (index: number, journeyId: string) => {
    if (activeIndex === index) {
      // Navigate to details if it's already the active one
      router.push(`/journey/${journeyId}`)
    } else {
      // Rotate the wheel to make this one active
      const anglePerItem = 360 / count
      const targetRotation = 90 - (index * anglePerItem)
      
      // Ensure we rotate the shortest distance
      const current = rotationValue.get()
      const diff = ((targetRotation - current) % 360 + 360) % 360
      const shortestDiff = diff > 180 ? diff - 360 : diff
      
      rotationValue.set(current + shortestDiff)
    }
  }

  return (
    <div 
      className="relative w-full h-[600px] overflow-hidden flex items-center justify-center -mt-10"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Invisible drag surface */}
      <motion.div
        className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      <div className="relative w-[1px] h-[1px]" style={{ transform: 'translateY(-200px)' }}>
        {items.map((journey, i) => {
          return (
            <CarouselItem 
              key={journey.id}
              index={i}
              total={count}
              radius={radius}
              springRotation={springRotation}
              isActive={activeIndex === i}
              journey={journey}
              onClick={() => handleCardClick(i, journey.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function CarouselItem({ 
  index, 
  total, 
  radius, 
  springRotation, 
  isActive, 
  journey,
  onClick
}: any) {
  const anglePerItem = 360 / total
  const baseAngle = index * anglePerItem

  // Calculate dynamic transform based on the spring rotation
  const x = useTransform(springRotation, (rot: number) => {
    const currentAngle = (baseAngle + rot) * (Math.PI / 180)
    return Math.cos(currentAngle) * radius
  })
  
  const y = useTransform(springRotation, (rot: number) => {
    const currentAngle = (baseAngle + rot) * (Math.PI / 180)
    return Math.sin(currentAngle) * radius
  })

  // Fade out items that are at the top of the circle (far away)
  // Our focal point is 90 degrees (bottom). Top is 270 degrees.
  const opacity = useTransform(springRotation, (rot: number) => {
    const rawAngle = (baseAngle + rot)
    const normalized = ((rawAngle % 360) + 360) % 360
    const distanceFromFocal = Math.min(Math.abs(normalized - 90), 360 - Math.abs(normalized - 90))
    
    // At focal point (0 diff), opacity is 1. At opposite side (180 diff), opacity is 0.
    return isActive ? 1 : Math.max(0.2, 1 - (distanceFromFocal / 120))
  })

  const scale = useTransform(springRotation, (rot: number) => {
    const rawAngle = (baseAngle + rot)
    const normalized = ((rawAngle % 360) + 360) % 360
    const distanceFromFocal = Math.min(Math.abs(normalized - 90), 360 - Math.abs(normalized - 90))
    
    return isActive ? 1 : Math.max(0.7, 0.9 - (distanceFromFocal / 360))
  })

  const zIndex = isActive ? 40 : 10

  return (
    <motion.div
      className="absolute top-0 left-0 -ml-[160px] -mt-[200px]"
      style={{
        x,
        y,
        opacity,
        scale,
        zIndex,
      }}
    >
      <div className="relative pointer-events-auto">
        <JourneyRadialCard 
          journey={journey} 
          isActive={isActive} 
          onClick={onClick}
        />
      </div>
    </motion.div>
  )
}
