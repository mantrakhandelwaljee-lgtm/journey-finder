import Link from "next/link"
import { auth } from "@/auth"
import { UserButton } from "@/components/auth/user-button"
import { MapPin, PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavLinks } from "./nav-links"

export async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1 rounded-md">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold text-[24px] md:text-[28px] text-[#2B211B] tracking-tight inline-block">JourneyFinder</span>
          </Link>
          
          {session?.user?.isOnboarded && (
            <NavLinks />
          )}
        </div>

        <div className="flex items-center gap-4">
          {session?.user?.isOnboarded ? (
            <>
              <Link href="/publish" className="hidden sm:block">
                <Button variant="default" size="sm" className="transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-5px_rgba(249,115,22,0.3)] hover:bg-primary/95">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Publish Journey
                </Button>
              </Link>
              <UserButton />
            </>
          ) : session?.user ? (
            <UserButton />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:bg-muted/50">Log in</Button>
              </Link>
              <Link href="/login">
                <Button variant="default" size="sm" className="text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-5px_rgba(249,115,22,0.3)] hover:bg-primary/95">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
