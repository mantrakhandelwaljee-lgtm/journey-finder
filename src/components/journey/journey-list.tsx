import { JourneyCard } from "./journey-card"

export function JourneyList({ journeys }: { journeys: any[] }) {
  if (!journeys || journeys.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <h3 className="text-lg font-medium">No journeys found</h3>
        <p className="text-muted-foreground mt-1">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {journeys.map(journey => (
        <JourneyCard key={journey.id} journey={journey} />
      ))}
    </div>
  )
}
