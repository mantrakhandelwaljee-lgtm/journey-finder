import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function JourneyNotFound() {
  return (
    <div className="container max-w-md mx-auto py-24 px-4 text-center">
      <div className="mx-auto bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
        <MapPin className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Journey not found</h1>
      <p className="text-muted-foreground mb-8">
        This journey may have been cancelled or doesn't exist.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/search">
          <Button>Browse Journeys</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
