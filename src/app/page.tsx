import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { MapPin, Users, ShieldCheck, ArrowRight } from "lucide-react"
import { redirect } from "next/navigation"
import { SplashScreen } from "@/components/ui/splash-screen"
import { HeroMagnifier } from "@/components/ui/hero-magnifier"

import { WordDropReveal } from "@/components/ui/word-drop-reveal"

export default async function LandingPage() {
  const session = await auth()

  if (session?.user) {
    if (session.user.isOnboarded) {
      redirect("/dashboard")
    } else {
      redirect("/onboarding")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SplashScreen />
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-[#ffe0cc] via-[#fff4ed] to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <WordDropReveal 
                  words={["Connect", "Travel", "Seamless", "Together", "Ride"]}
                  className="py-4 w-full max-w-4xl mx-auto"
                  startDelay={2.5}
                >
                  <HeroMagnifier>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-heading text-[#2B211B] leading-tight">
                      Never Travel <span className="text-[#B77B5D]">Alone</span> Again.
                    </h1>
                  </HeroMagnifier>
                </WordDropReveal>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with students heading your way. Share rides to campus, the train station, or home for the holidays. 
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
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
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Verified Students</h3>
                <p className="text-muted-foreground">
                  Sign in with your university email. Travel safely with verified peers from your college.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Matching</h3>
                <p className="text-muted-foreground">
                  Find journeys that perfectly match your route and schedule, whether commuting or traveling far.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Cost Sharing</h3>
                <p className="text-muted-foreground">
                  Split the cost of cabs and fuel. Make your trips more affordable and eco-friendly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 bg-background">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold">JourneyFinder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 JourneyFinder. All rights reserved. Built for students.
          </p>
        </div>
      </footer>
    </div>
  )
}
