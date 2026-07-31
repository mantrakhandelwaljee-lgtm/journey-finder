import { auth } from "@/auth"
import { MapPin, Users, ShieldCheck } from "lucide-react"
import { redirect } from "next/navigation"
import { SplashScreen } from "@/components/ui/splash-screen"
import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/landing/hero-section"

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
      <main className="flex-1">
        {/* Hero with card drop animation — Navbar passed as children so it stays server-rendered */}
        <HeroSection>
          <Navbar />
        </HeroSection>

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
