import { Navbar } from "@/components/layout/navbar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#ffe0cc]/80 via-[#fff4ed]/80 to-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
