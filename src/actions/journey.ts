"use server"

import { auth } from "@/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { publishJourneySchema, PublishJourneyFormValues } from "@/lib/validators"
import { revalidatePath } from "next/cache"

export async function publishJourney(data: PublishJourneyFormValues) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const parsedData = publishJourneySchema.parse(data)
    const supabase = createAdminClient()

    const { data: journey, error } = await (supabase.from('journeys') as any)
      .insert({
        user_id: session.user.id,
        origin_name: parsedData.origin.name,
        origin_lat: parsedData.origin.lat,
        origin_lng: parsedData.origin.lng,
        destination_name: parsedData.destination.name,
        destination_lat: parsedData.destination.lat,
        destination_lng: parsedData.destination.lng,
        departure_time: parsedData.departure_time.toISOString(),
        arrival_time: parsedData.arrival_time.toISOString(),
        transport_type: parsedData.transport_type,
        transport_number: parsedData.transport_number || null,
        seats_available: parsedData.seats_available,
        notes: parsedData.notes || null,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      console.error("Database error creating journey:", error)
      return { success: false, error: "Failed to publish journey" }
    }

    // Handle stops if provided
    if (parsedData.stops && parsedData.stops.length > 0) {
      const stopsData = parsedData.stops.map((stop, index) => ({
        journey_id: journey.id,
        stop_name: stop.location.name,
        stop_lat: stop.location.lat,
        stop_lng: stop.location.lng,
        estimated_arrival: stop.arrival_time.toISOString(),
        estimated_departure: stop.departure_time.toISOString(),
        transport_type: stop.transport_type,
        transport_number: stop.transport_number || null,
        stop_order: index + 1
      }))
      
      const { error: stopsError } = await (supabase.from('journey_stops') as any)
        .insert(stopsData)
        
      if (stopsError) {
        console.error("Error creating stops:", stopsError)
      }
    }

    revalidatePath("/dashboard")
    revalidatePath("/profile")
    
    return { success: true, journeyId: journey.id }
  } catch (error) {
    console.error("Error in publishJourney:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteJourney(journeyId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = createAdminClient()

    // Verify ownership
    const { data: journey } = await (supabase.from('journeys') as any)
      .select('user_id')
      .eq('id', journeyId)
      .single()

    if (!journey || journey.user_id !== session.user.id) {
      return { success: false, error: "You can only delete your own journeys" }
    }

    // Delete stops first (cascade should handle this, but being explicit)
    await (supabase.from('journey_stops') as any)
      .delete()
      .eq('journey_id', journeyId)

    // Delete the journey
    const { error } = await (supabase.from('journeys') as any)
      .delete()
      .eq('id', journeyId)

    if (error) {
      console.error("Database error deleting journey:", error)
      return { success: false, error: "Failed to delete journey" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/profile")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteJourney:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateJourneyStatus(journeyId: string, status: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = createAdminClient()

    // Verify ownership
    const { data: journey } = await (supabase.from('journeys') as any)
      .select('user_id')
      .eq('id', journeyId)
      .single()

    if (!journey || journey.user_id !== session.user.id) {
      return { success: false, error: "You can only update your own journeys" }
    }

    const { error } = await (supabase.from('journeys') as any)
      .update({ status })
      .eq('id', journeyId)

    if (error) {
      console.error("Database error updating journey status:", error)
      return { success: false, error: "Failed to update journey" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/profile")
    revalidatePath(`/journey/${journeyId}`)

    return { success: true }
  } catch (error) {
    console.error("Error in updateJourneyStatus:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateJourney(journeyId: string, data: PublishJourneyFormValues) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const parsedData = publishJourneySchema.parse(data)
    const supabase = createAdminClient()

    // Verify ownership
    const { data: existingJourney } = await (supabase.from('journeys') as any)
      .select('user_id')
      .eq('id', journeyId)
      .single()

    if (!existingJourney || existingJourney.user_id !== session.user.id) {
      return { success: false, error: "You can only edit your own journeys" }
    }

    // Update main journey
    const { error: updateError } = await (supabase.from('journeys') as any)
      .update({
        origin_name: parsedData.origin.name,
        origin_lat: parsedData.origin.lat,
        origin_lng: parsedData.origin.lng,
        destination_name: parsedData.destination.name,
        destination_lat: parsedData.destination.lat,
        destination_lng: parsedData.destination.lng,
        departure_time: parsedData.departure_time.toISOString(),
        arrival_time: parsedData.arrival_time.toISOString(),
        transport_type: parsedData.transport_type,
        transport_number: parsedData.transport_number || null,
        seats_available: parsedData.seats_available,
        notes: parsedData.notes || null,
      })
      .eq('id', journeyId)

    if (updateError) {
      console.error("Database error updating journey:", updateError)
      return { success: false, error: "Failed to update journey" }
    }

    // Delete existing stops
    await (supabase.from('journey_stops') as any)
      .delete()
      .eq('journey_id', journeyId)

    // Insert new stops if provided
    if (parsedData.stops && parsedData.stops.length > 0) {
      const stopsData = parsedData.stops.map((stop, index) => ({
        journey_id: journeyId,
        stop_name: stop.location.name,
        stop_lat: stop.location.lat,
        stop_lng: stop.location.lng,
        estimated_arrival: stop.arrival_time.toISOString(),
        estimated_departure: stop.departure_time.toISOString(),
        transport_type: stop.transport_type,
        transport_number: stop.transport_number || null,
        stop_order: index + 1
      }))
      
      const { error: stopsError } = await (supabase.from('journey_stops') as any)
        .insert(stopsData)
        
      if (stopsError) {
        console.error("Error updating stops:", stopsError)
      }
    }

    revalidatePath("/dashboard")
    revalidatePath("/profile")
    revalidatePath(`/journey/${journeyId}`)
    
    return { success: true, journeyId }
  } catch (error) {
    console.error("Error in updateJourney:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
