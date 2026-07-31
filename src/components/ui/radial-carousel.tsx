"use client"
import React, { useRef, useState, useEffect, useCallback } from "react"
import { JourneyRadialCard } from "@/components/journey/journey-radial-card"
import { useRouter } from "next/navigation"

// ── Configuration ───────────────────────────────────────────────────
const RADIUS_X = 420        // wide horizontal spread (oval width)
const RADIUS_Z = 200        // shallow depth (oval depth) → creates the oval
const TILT_X = 8            // subtle top-down perspective tilt
const IDLE_SPEED = 360 / 22 // deg/s – ~22s per revolution
const DRAG_SENS = 0.3
const MOMENTUM = 0.35
const FRICTION = 0.96

// ── Component ───────────────────────────────────────────────────────
export function RadialCarousel({ items }: { items: any[] }) {
  const router = useRouter()
  const count = items.length
  const step = 360 / count

  const containerRef = useRef<HTMLDivElement>(null)

  // Animation refs (mutated in RAF — never trigger re-renders)
  const rotRef = useRef(0)
  const velRef = useRef(IDLE_SPEED)
  const isDrag = useRef(false)
  const isHover = useRef(false)
  const lastT = useRef(0)
  const lastDragX = useRef(0)
  const lastDragT = useRef(0)
  const dragVel = useRef(0)
  const dragOriginX = useRef(0)
  const dragMoved = useRef(false)

  // React state (triggers render)
  const [rot, setRot] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  /* ──────── requestAnimationFrame loop ──────── */
  useEffect(() => {
    let id: number
    const tick = (t: number) => {
      if (lastT.current === 0) lastT.current = t
      const dt = Math.min((t - lastT.current) / 1000, 0.05)
      lastT.current = t

      if (!isDrag.current) {
        if (isHover.current) {
          velRef.current *= FRICTION
          if (Math.abs(velRef.current) < 0.3) velRef.current = 0
        } else {
          velRef.current += (IDLE_SPEED - velRef.current) * 0.025
        }
      }

      rotRef.current += velRef.current * dt
      setRot(rotRef.current)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  /* ──────── mouse wheel ──────── */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      rotRef.current += e.deltaY * 0.12
      velRef.current = e.deltaY * 0.6
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  /* ──────── pointer drag ──────── */
  const onDown = useCallback((e: React.PointerEvent) => {
    isDrag.current = true
    dragMoved.current = false
    dragOriginX.current = e.clientX
    lastDragX.current = e.clientX
    lastDragT.current = performance.now()
    dragVel.current = 0
    velRef.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!isDrag.current) return
    const now = performance.now()
    const dx = e.clientX - lastDragX.current
    if (Math.abs(e.clientX - dragOriginX.current) > 4) dragMoved.current = true
    const dtSec = Math.max((now - lastDragT.current) / 1000, 0.001)
    const degDelta = dx * DRAG_SENS
    rotRef.current += degDelta
    dragVel.current = degDelta / dtSec
    lastDragX.current = e.clientX
    lastDragT.current = now
  }, [])

  const onUp = useCallback(() => {
    isDrag.current = false
    velRef.current = dragVel.current * MOMENTUM
  }, [])

  if (!items || items.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center select-none"
      style={{
        perspective: "1800px",
        height: "560px",
        cursor: "grab",
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onMouseEnter={() => { isHover.current = true }}
      onMouseLeave={() => { isHover.current = false; setHovered(null) }}
    >
      {/* 3-D stage with subtle top-down tilt */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${TILT_X}deg)`,
          position: "absolute",
          width: 0,
          height: 0,
        }}
      >
        {items.map((journey, i) => {
          const totalAngle = i * step + rot
          const totalRad = (totalAngle * Math.PI) / 180

          // ── elliptical orbit position ──
          const x = Math.sin(totalRad) * RADIUS_X
          const z = Math.cos(totalRad) * RADIUS_Z

          // ── depth factor: 1 = front, 0 = back ──
          const depthRaw = Math.cos(totalRad)
          const d = (depthRaw + 1) / 2

          const isH = hovered === i
          const isActive = d > 0.9

          // ── depth-based styling ──
          const s = isH ? 1.12 : 0.8 + d * 0.28        // 0.80 → 1.08
          const op = 0.35 + d * 0.65                     // 0.35 → 1.0
          const bl = isH ? 0 : Math.max(0, (1 - d) * 3) // 0 → 3px
          const bright = 0.75 + d * 0.25                 // 0.75 → 1.0
          const lift = isH ? 35 : 0

          // ── shadow (stronger at front) ──
          const shOp = (0.06 + d * 0.22).toFixed(2)
          const shBl = Math.round(8 + d * 28)
          const shY = Math.round(4 + d * 14)

          return (
            <div
              key={journey.id}
              style={{
                position: "absolute",
                transformStyle: "preserve-3d",
                /*
                 * 1. translateX + translateZ → position on the elliptical orbit
                 * 2. rotateY(-totalAngle)    → card rotates WITH the orbit
                 *    • front (0°):   faces camera
                 *    • sides (±90°): shows edge
                 *    • back (180°):  faces away
                 * 3. scale3d → depth-based sizing
                 */
                transform: `
                  translateX(${x}px)
                  translateZ(${z + lift}px)
                  rotateY(${-totalAngle}deg)
                  scale3d(${s}, ${s}, 1)
                `,
                filter: `blur(${bl}px) brightness(${bright})`,
                opacity: op,
                willChange: "transform, opacity, filter",
                left: "-120px",
                top: "-150px",
                pointerEvents: d > 0.3 ? "auto" : "none",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                if (!dragMoved.current && d > 0.5) {
                  e.stopPropagation()
                  router.push(`/journey/${journey.id}`)
                }
              }}
            >
              <div
                style={{
                  boxShadow: isH
                    ? `0 ${shY + 6}px ${shBl + 16}px rgba(0,0,0,${
                        parseFloat(shOp) + 0.12
                      }), 0 0 24px rgba(183,123,93,0.2)`
                    : `0 ${shY}px ${shBl}px rgba(0,0,0,${shOp})`,
                  borderRadius: "16px",
                  transition: "box-shadow 0.25s ease",
                }}
              >
                <JourneyRadialCard
                  journey={journey}
                  isActive={isActive}
                  onClick={() => {}}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
