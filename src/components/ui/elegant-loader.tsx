"use client"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

interface ElegantLoaderProps {
  message?: string
}

export function ElegantLoader({ message = "Loading..." }: ElegantLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-12 w-full h-full min-h-[40vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="bg-primary/10 p-5 rounded-full border border-primary/20 relative"
        >
          <MapPin className="w-10 h-10 text-primary" />
        </motion.div>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse tracking-wide">
        {message}
      </p>
    </div>
  )
}
