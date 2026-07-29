import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, CarFront, Plane, Train, Bus } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface JourneyCardProps {
  journey: any
}

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'flight': return <Plane className="w-4 h-4" />
    case 'train': return <Train className="w-4 h-4" />
    case 'bus': return <Bus className="w-4 h-4" />
    default: return <CarFront className="w-4 h-4" />
  }
}

export function JourneyCard({ journey }: JourneyCardProps) {
  const user = journey.users
  const departureTime = new Date(journey.departure_time)

  return (
    <Link href={`/journey/${journey.id}`} className="block h-full">
      <Card className="hover:shadow-md transition-all hover:border-primary/50 h-full flex flex-col cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.avatar_url || ""} />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.college} • Year {user?.college_year}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="flex gap-1 items-center capitalize">
                {getTransportIcon(journey.transport_type)}
                {journey.transport_type}
              </Badge>
              {journey.transport_number && (
                <span className="text-xs text-muted-foreground font-mono">#{journey.transport_number}</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4 space-y-4 flex-1">
          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-0.5 h-6 bg-border" />
              <MapPin className="w-4 h-4 text-destructive" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-sm font-medium">{journey.origin_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{journey.destination_name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-sm text-muted-foreground border-t">
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">{format(departureTime, "MMM d, h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 justify-end">
              <Users className="w-4 h-4 shrink-0" />
              <span>{journey.seats_available} seats left</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-4">
          <Button className="w-full" variant="secondary">View Details</Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
