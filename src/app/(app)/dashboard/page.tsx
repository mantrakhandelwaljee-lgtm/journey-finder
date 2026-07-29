import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { JourneyList } from "@/components/journey/journey-list"
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

  // Fetch journeys published by the current user
  const { data: myJourneys } = await (supabase.from('journeys') as any)
    .select(`
      *,
      users:user_id (
        name,
        avatar_url,
        college,
        college_year
      )
    `)
    .eq('user_id', session.user.id)
    .order('departure_time', { ascending: false })

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

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Published Journeys</h2>
          </div>
          {myJourneys && myJourneys.length > 0 ? (
            <JourneyList journeys={myJourneys} />
          ) : (
            <div className="bg-card border rounded-lg p-12 text-center">
              <h3 className="text-lg font-medium mb-2">You haven't published any journeys yet</h3>
              <p className="text-muted-foreground mb-6">
                Share your travel plans and find companions to travel with.
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
