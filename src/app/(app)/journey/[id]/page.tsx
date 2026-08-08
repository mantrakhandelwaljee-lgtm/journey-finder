import { createAdminClient } from "@/lib/supabase/admin"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, CarFront, Plane, Train, Bus, Navigation, Phone, GraduationCap, BookOpen, Hash } from "lucide-react"
import { format } from "date-fns"
import { JourneyActions } from "@/components/journey/journey-actions"

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'flight': return <Plane className="w-4 h-4" />
    case 'train': return <Train className="w-4 h-4" />
    case 'bus': return <Bus className="w-4 h-4" />
    default: return <CarFront className="w-4 h-4" />
  }
}

const getTransportLabel = (type: string) => {
  switch (type) {
    case 'flight': return 'Flight'
    case 'train': return 'Train'
    case 'bus': return 'Bus'
    default: return 'Car / Ride Share'
  }
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const supabase = createAdminClient()

  // Fetch journey details with creator info
  const { data: journey, error } = await (supabase.from('journeys') as any)
    .select(`
      *,
      users:user_id (
        id,
        name,
        email,
        phone,
        avatar_url,
        college,
        college_year,
        branch
      )
    `)
    .eq('id', id)
    .single()

  if (error || !journey) {
    notFound()
  }

  // Fetch journey stops
  const { data: stops } = await (supabase.from('journey_stops') as any)
    .select('*')
    .eq('journey_id', id)
    .order('stop_order', { ascending: true })

  const user = journey.users
  const isSupreme = session.user?.email === "mantrakhandelwaljee@gmail.com"
  const isOwner = session.user.id === user.id || isSupreme
  const departureTime = new Date(journey.departure_time)
  const arrivalTime = new Date(journey.arrival_time)

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] font-heading">Journey Details</h1>
          <p className="text-muted-foreground mt-1">
            {journey.origin_name} → {journey.destination_name}
          </p>
        </div>
        <Badge 
          variant={journey.status === 'open' ? 'default' : 'secondary'} 
          className="w-fit text-sm px-3 py-1 uppercase tracking-wider font-mono"
        >
          {journey.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Route Timeline Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Route
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative pl-4">

                {/* ── ORIGIN ── */}
                <div className="flex items-start gap-5 relative pb-8">
                  <div className="absolute left-0 top-1.5 w-0.5 h-full bg-gradient-to-b from-green-500 to-primary/30" />
                  <div className="relative z-10 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-500/20 shrink-0 -ml-[7px]" />
                  <div className="flex-1 -mt-0.5">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Origin</p>
                    <h3 className="font-semibold text-base mt-0.5">{journey.origin_name}</h3>
                    <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(departureTime, "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {format(departureTime, "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── TRANSPORT SEGMENT: Origin → first stop / destination ── */}
                <div className="flex items-start gap-5 relative pb-6">
                  <div className="absolute left-0 top-0 w-0.5 h-full bg-primary/20" />
                  <div className="relative z-10 w-4 h-4 rounded-full bg-primary/10 border-2 border-primary/30 shrink-0 -ml-[7px] flex items-center justify-center">
                    {getTransportIcon(journey.transport_type)}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="bg-muted/40 rounded-md px-3 py-2 inline-flex items-center gap-2 text-sm">
                      {getTransportIcon(journey.transport_type)}
                      <span className="font-medium">{getTransportLabel(journey.transport_type)}</span>
                      {journey.transport_number && (
                        <Badge variant="outline" className="text-xs">
                          <Hash className="w-3 h-3 mr-0.5" />
                          {journey.transport_number}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── STOPS ── */}
                {stops && stops.map((stop: any, index: number) => (
                  <div key={stop.id}>
                    {/* Stop node */}
                    <div className="flex items-start gap-5 relative pb-6">
                      <div className="absolute left-0 top-0 w-0.5 h-full bg-primary/30" />
                      <div className="relative z-10 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20 shrink-0 -ml-[7px]" />
                      <div className="flex-1 -mt-0.5">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Stop {index + 1}</p>
                        <h3 className="font-medium text-base mt-0.5">{stop.stop_name}</h3>
                        <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                          {stop.estimated_arrival && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Arr: {format(new Date(stop.estimated_arrival), "h:mm a")}
                            </span>
                          )}
                          {stop.estimated_departure && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Dep: {format(new Date(stop.estimated_departure), "h:mm a")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Transport segment after this stop */}
                    {stop.transport_type && (
                      <div className="flex items-start gap-5 relative pb-6">
                        <div className="absolute left-0 top-0 w-0.5 h-full bg-primary/20" />
                        <div className="relative z-10 w-4 h-4 rounded-full bg-primary/10 border-2 border-primary/30 shrink-0 -ml-[7px]" />
                        <div className="flex-1 -mt-0.5">
                          <div className="bg-muted/40 rounded-md px-3 py-2 inline-flex items-center gap-2 text-sm">
                            {getTransportIcon(stop.transport_type)}
                            <span className="font-medium">{getTransportLabel(stop.transport_type)}</span>
                            {stop.transport_number && (
                              <Badge variant="outline" className="text-xs">
                                <Hash className="w-3 h-3 mr-0.5" />
                                {stop.transport_number}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* ── DESTINATION ── */}
                <div className="flex items-start gap-5 relative">
                  <div className="relative z-10 w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-500/20 shrink-0 -ml-[7px]" />
                  <div className="flex-1 -mt-0.5">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Destination</p>
                    <h3 className="font-semibold text-base mt-0.5">{journey.destination_name}</h3>
                    <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        Est. {format(arrivalTime, "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {journey.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notes from Host</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {journey.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Creator Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Journey Creator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={user.avatar_url || ""} />
                  <AvatarFallback className="text-lg">
                    {user.name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg leading-tight">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.college}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Year {user.college_year}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{user.branch}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <a 
                      href={`tel:${user.phone}`} 
                      className="text-primary hover:underline font-medium"
                    >
                      {user.phone}
                    </a>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a 
                      href={`mailto:${user.email}`} 
                      className="text-primary hover:underline font-medium truncate"
                    >
                      {user.email}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seats Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="w-8 h-8 text-primary" />
                <h3 className="font-heading font-semibold text-2xl">{journey.seats_available}</h3>
                <p className="text-muted-foreground">Seats Available</p>
              </div>
            </CardContent>
          </Card>

          {/* Owner Actions */}
          {isOwner && (
            <JourneyActions journeyId={journey.id} status={journey.status} />
          )}
        </div>
      </div>
    </div>
  )
}
