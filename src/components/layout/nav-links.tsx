"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavLinks() {
  const pathname = usePathname()
  
  return (
    <nav className="hidden md:flex gap-6">
      <Link
        href="/dashboard"
        className={`premium-nav-link ${pathname === "/dashboard" ? "active" : ""}`}
      >
        Dashboard
      </Link>
      <Link
        href="/search"
        className={`premium-nav-link ${pathname === "/search" ? "active" : ""}`}
      >
        Find Journeys
      </Link>
      <Link
        href="/profile"
        className={`premium-nav-link ${pathname === "/profile" ? "active" : ""}`}
      >
        Profile
      </Link>
    </nav>
  )
}
