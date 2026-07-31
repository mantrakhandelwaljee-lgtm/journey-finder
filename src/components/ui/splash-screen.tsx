"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin } from "lucide-react"

export function SplashScreen() {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 1000;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => setShow(false), 200);
      }
    }, intervalTime)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-between p-8 md:p-16"
        >
          {/* Top spacer */}
          <div className="flex-1" />

          {/* Central Logo Animation */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="bg-primary/10 p-6 rounded-full border border-primary/20 relative"
              >
                <MapPin className="w-12 h-12 text-primary" />
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold tracking-tighter text-foreground">JourneyFinder</h1>
              <p className="text-muted-foreground mt-2 font-medium">Connecting student travelers</p>
            </motion.div>
          </div>

          {/* Progress Bar Section (Mobbin style) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-sm flex-1 flex flex-col justify-end pb-8"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Loading...</span>
                <span className="text-sm font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-primary/10 overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.05 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
