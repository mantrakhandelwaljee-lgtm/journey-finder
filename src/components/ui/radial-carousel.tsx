"use client"
import React, { useRef, useState, useEffect, useCallback } from "react"
import { JourneyRadialCard } from "@/components/journey/journey-radial-card"
import { useRouter } from "next/navigation"

// ── Configuration ───────────────────────────────────────────────────
const ORBIT_RADIUS = 380       // px – ring radius
const TILT_X = 60              // deg – ring lean (into the screen)
const TILT_Y = 10              // deg – slight sideways tilt
const IDLE_SPEED = 360 / 21    // deg/s – one revolution ≈ 21 s
const DRAG_SENS = 0.3          // px → deg conversion
const MOMENTUM = 0.35          // how much drag velocity carries over
const FRICTION = 0.96          // per-frame velocity decay while hovering

// ── Component ───────────────────────────────────────────────────────
export function RadialCarousel({ items }: { items: any[] }) {
  const router = useRouter()
  const count = items.length
  const step = 360 / count

  const containerRef = useRef<HTMLDivElement>(null)

  /* ---------- animation refs (never cause re-renders) ---------- */
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

  /* ---------- React state (triggers render) ---------- */
  const [rot, setRot] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  /* ────────────── requestAnimationFrame loop ─────────────── */
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

  /* ────────────── mouse-wheel ─────────────── */
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

  /* ────────────── pointer drag ─────────────── */
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

  /* ────────────── depth helper ─────────────── */
  const depthOf = (i: number): number => {
    const rad = ((i * step + rot) * Math.PI) / 180
    return (Math.cos(rad) + 1) / 2 // 0 = back, 1 = front
  }

  if (!items || items.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center select-none"
      style={{
        perspective: "2000px",
        height: "620px",
        cursor: isDrag.current ? "grabbing" : "grab",
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onMouseEnter={() => { isHover.current = true }}
      onMouseLeave={() => { isHover.current = false; setHovered(null) }}
    >
      {/* ── 3-D stage (preserve-3d so browser handles z-sort) ── */}
      <div
        style={{
          transformStyle: "preserve-3d",
          position: "absolute",
          width: 0,
          height: 0,
        }}
      >
        {items.map((journey, i) => {
          const totalAngle = i * step + rot + TILT_Y
          const d = depthOf(i)
          const isH = hovered === i

          // ── depth-based styling ──
          const s = isH ? 1.2 : 0.82 + d * 0.36     // 0.82 → 1.18
          const op = isH ? 1 : 0.55 + d * 0.45       // 0.55 → 1.0
          const bl = isH ? 0 : Math.max(0, (1 - d) * 3) // 0 → 3 px
          const bright = 0.85 + d * 0.15              // 0.85 → 1.0
          const lift = isH ? 30 : 0                   // hover lift

          // ── shadow ──
          const shOp = (0.06 + d * 0.2).toFixed(2)
          const shBl = Math.round(8 + d * 24)
          const shY = Math.round(4 + d * 12)

          return (
            <div
              key={journey.id}
              style={{
                position: "absolute",
                transformStyle: "preserve-3d",
                /*
                 * 1. rotateX / rotateY  → tilt the ring + position the card
                 * 2. translateZ          → push card out to orbit radius
                 * 3. counter-rotate      → billboard the card toward the camera
                 * 4. scale3d             → depth-based sizing
                 */
                transform: `
                  rotateX(${TILT_X}deg)
                  rotateY(${totalAngle}deg)
                  translateZ(${ORBIT_RADIUS + lift}px)
                  rotateY(${-totalAngle}deg)
                  rotateX(${-TILT_X}deg)
                  scale3d(${s}, ${s}, 1)
                `,
                filter: `blur(${bl}px) brightness(${bright})`,
                opacity: op,
                willChange: "transform, opacity, filter",
                left: "-85px",
                top: "-105px",
                pointerEvents: "auto",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                if (!dragMoved.current) {
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
                  borderRadius: "12px",
                  transition: "box-shadow 0.25s ease",
                }}
              >
                <JourneyRadialCard
                  journey={journey}
                  isActive={d > 0.85}
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
