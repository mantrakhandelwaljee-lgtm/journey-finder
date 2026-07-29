import { Suspense } from "react"
import { SearchFilters } from "@/components/journey/search-filters"
import { JourneyList } from "@/components/journey/journey-list"
import { searchJourneys } from "@/actions/search"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function SearchPage(
  props: {
    searchParams?: Promise<{ dest?: string; date?: string; transport?: string; tn?: string }>
  }
) {
  const searchParams = await props.searchParams
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  const dest = searchParams?.dest
  const date = searchParams?.date
  const transport = searchParams?.transport
  const tn = searchParams?.tn

  const result = await searchJourneys({
    destination: dest ? { name: dest, lat: 0, lng: 0 } : undefined,
    target_date: date ? new Date(date) : undefined,
    transport_type: transport || undefined,
    transport_number: tn || undefined,
  })

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find a Journey</h1>
        <p className="text-muted-foreground mt-2">
          Search for travel companions heading to your destination.
        </p>
      </div>

      <Suspense fallback={<div className="h-24 bg-muted rounded-lg animate-pulse mb-8" />}>
        <SearchFilters />
      </Suspense>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-6">Available Journeys</h2>
        <JourneyList journeys={result.data || []} />
      </div>
    </div>
  )
}
