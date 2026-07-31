import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RadialCarousel } from "@/components/ui/radial-carousel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  const supabase = await createClient()

  // Fetch all upcoming available journeys for the carousel
  const { data: allJourneys, error } = await (supabase.from('journeys') as any)
    .select(`
      *,
      users:user_id (
        name,
        avatar_url,
        college,
        college_year
      )
    `)
    .order('departure_time', { ascending: false })
    .limit(10)
    
  if (error) {
    console.error("Supabase Error fetching journeys:", error)
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {session.user.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your journeys and find travel companions.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/search">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Find a Journey
            </Button>
          </Link>
          <Link href="/publish">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Publish Journey
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8 mt-12">
        <section className="text-center relative">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-[#2B211B] mb-2">Available Journeys</h2>
            <p className="text-[#7B6A5F] max-w-lg mx-auto">
              Spin the wheel to discover rides matching your route. Drag horizontally or click a card to bring it to focus.
            </p>
          </div>
          
          {/* DEBUG: remove after fixing */}
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 text-left mb-4 text-sm max-w-2xl mx-auto">
            <p><strong>Debug:</strong> allJourneys type: {typeof allJourneys}</p>
            <p>allJourneys is null: {String(allJourneys === null)}</p>
            <p>allJourneys is array: {String(Array.isArray(allJourneys))}</p>
            <p>allJourneys length: {allJourneys ? allJourneys.length : 'N/A'}</p>
            <p>error: {error ? JSON.stringify(error) : 'none'}</p>
            {allJourneys && allJourneys.length > 0 && (
              <p>First item id: {allJourneys[0].id}</p>
            )}
          </div>

          {allJourneys && allJourneys.length > 0 ? (
            <div className="mt-8">
              <RadialCarousel items={allJourneys} />
            </div>
          ) : (
            <div className="bg-white/40 border border-[#D8C8B9]/50 rounded-2xl p-12 text-center backdrop-blur-md max-w-2xl mx-auto mt-12 shadow-sm">
              {error ? (
                <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
                  <h3 className="font-bold">Database Error:</h3>
                  <p>{error.message || JSON.stringify(error)}</p>
                </div>
              ) : null}
              <h3 className="text-xl font-medium mb-2 text-[#2B211B]">No journeys available right now</h3>
              <p className="text-[#51443B] mb-6">
                Be the first to share your travel plans and find companions to travel with.
              </p>
              <Link href="/publish">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Publish Your First Journey
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
