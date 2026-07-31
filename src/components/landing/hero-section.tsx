"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroMagnifier } from "@/components/ui/hero-magnifier"
import { WordDropReveal } from "@/components/ui/word-drop-reveal"

const revealEase = [0.22, 0.61, 0.36, 1] as const

interface HeroSectionProps {
  children: React.ReactNode
}

export function HeroSection({ children }: HeroSectionProps) {
  const [cardsLanded, setCardsLanded] = useState(false)

  return (
    <>
      {/* Navbar — fades in after cards land */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={cardsLanded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        {children}
      </motion.div>

      {/* Hero Section */}
      <section className="w-full py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-[#ffe0cc] via-[#fff4ed] to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            
            {/* Heading — fades in after cards land */}
            <motion.div
              className="space-y-4 max-w-3xl"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={cardsLanded
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 30, filter: "blur(10px)" }
              }
              transition={{ duration: 0.9, ease: revealEase }}
            >
              <HeroMagnifier>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-heading text-[#2B211B] leading-tight">
                  Never Travel <span className="text-[#B77B5D]">Alone</span> Again.
                </h1>
              </HeroMagnifier>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect with students heading your way. Share rides to campus, the train station, or home for the holidays. 
              </p>
            </motion.div>

            {/* Buttons — fade in with slight delay after heading */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={cardsLanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.25, ease: revealEase }}
            >
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base font-medium rounded-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-5px_rgba(249,115,22,0.3)] hover:bg-primary/95">
                  Find a Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium rounded-full bg-background transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] hover:bg-background">
                  Offer a Ride
                </Button>
              </Link>
            </motion.div>

            {/* Dropped cards — land at the bottom and stay */}
            <WordDropReveal
              words={["Connect", "Travel", "Seamless", "Together", "Ride"]}
              className="w-full max-w-3xl mx-auto mt-4"
              startDelay={1.5}
              onAllLanded={() => setCardsLanded(true)}
            />
          </div>
        </div>
      </section>
    </>
  )
}
