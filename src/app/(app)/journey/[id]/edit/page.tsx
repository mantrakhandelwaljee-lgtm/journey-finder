import { createAdminClient } from "@/lib/supabase/admin"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { PublishForm } from "@/components/journey/publish-form"
import { PublishJourneyFormValues } from "@/lib/validators"

export default async function EditJourneyPage({
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

  const { data: journey, error } = await (supabase.from('journeys') as any)
    .select('*')
    .eq('id', id)
    .single()

  if (error || !journey) {
    notFound()
  }

  if (journey.user_id !== session.user.id) {
    redirect(`/journey/${id}`)
  }

  const { data: stops } = await (supabase.from('journey_stops') as any)
    .select('*')
    .eq('journey_id', id)
    .order('stop_order', { ascending: true })

  const initialData: PublishJourneyFormValues = {
    origin: {
      name: journey.origin_name,
      lat: journey.origin_lat,
      lng: journey.origin_lng,
    },
    destination: {
      name: journey.destination_name,
      lat: journey.destination_lat,
      lng: journey.destination_lng,
    },
    departure_time: new Date(journey.departure_time),
    arrival_time: new Date(journey.arrival_time),
    transport_type: journey.transport_type,
    transport_number: journey.transport_number || "",
    seats_available: journey.seats_available,
    notes: journey.notes || "",
    stops: stops?.map((stop: any) => ({
      location: {
        name: stop.stop_name,
        lat: stop.stop_lat,
        lng: stop.stop_lng,
      },
      arrival_time: new Date(stop.estimated_arrival),
      departure_time: new Date(stop.estimated_departure),
      transport_type: stop.transport_type,
      transport_number: stop.transport_number || "",
    })) || [],
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="mb-8 space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Edit Journey</h1>
        <p className="text-muted-foreground">
          Update the details of your existing journey.
        </p>
      </div>

      <PublishForm initialData={initialData} journeyId={id} />
    </div>
  )
}
