"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { SearchJourneyFormValues } from "@/lib/validators"

export async function searchJourneys(filters?: SearchJourneyFormValues) {
  try {
    const supabase = createAdminClient()

    // If searching by place name, run two separate queries (origin and destination)
    // to avoid Supabase's .or() comma parsing issue with place names containing commas
    if (filters?.destination?.name) {
      const term = `%${filters.destination.name}%`
      const baseSelect = `
        *,
        users:user_id (
          name,
          avatar_url,
          college,
          college_year
        ),
        journey_stops (
          id,
          stop_name,
          stop_lat,
          stop_lng,
          transport_type,
          transport_number,
          stop_order,
          estimated_arrival,
          estimated_departure
        )
      `

      // Query 1: match destination_name
      let destQuery = (supabase.from('journeys') as any)
        .select(baseSelect)
        .eq('status', 'open')
        .ilike('destination_name', term)
        .order('departure_time', { ascending: true })

      // Query 2: match origin_name
      let originQuery = (supabase.from('journeys') as any)
        .select(baseSelect)
        .eq('status', 'open')
        .ilike('origin_name', term)
        .order('departure_time', { ascending: true })

      // Apply additional filters to both queries
      if (filters.target_date) {
        const targetDateStr = filters.target_date.toISOString().split('T')[0]
        destQuery = destQuery
          .gte('departure_time', `${targetDateStr}T00:00:00Z`)
          .lte('departure_time', `${targetDateStr}T23:59:59Z`)
        originQuery = originQuery
          .gte('departure_time', `${targetDateStr}T00:00:00Z`)
          .lte('departure_time', `${targetDateStr}T23:59:59Z`)
      }
      if (filters.transport_type) {
        destQuery = destQuery.eq('transport_type', filters.transport_type)
        originQuery = originQuery.eq('transport_type', filters.transport_type)
      }
      if (filters.transport_number) {
        destQuery = destQuery.ilike('transport_number', `%${filters.transport_number}%`)
        originQuery = originQuery.ilike('transport_number', `%${filters.transport_number}%`)
      }

      const [destResult, originResult] = await Promise.all([destQuery, originQuery])

      // Merge results, deduplicating by ID
      const seen = new Set<string>()
      const results: any[] = []

      for (const j of [...(destResult.data || []), ...(originResult.data || [])]) {
        if (!seen.has(j.id)) {
          seen.add(j.id)
          results.push(j)
        }
      }

      // Also search in stops for matching stop_name
      const { data: stopsMatch } = await (supabase.from('journey_stops') as any)
        .select('journey_id')
        .ilike('stop_name', term)

      if (stopsMatch && stopsMatch.length > 0) {
        const newIds = [...new Set(
          stopsMatch
            .map((s: any) => s.journey_id)
            .filter((id: string) => !seen.has(id))
        )]

        if (newIds.length > 0) {
          let stopJourneyQuery = (supabase.from('journeys') as any)
            .select(baseSelect)
            .eq('status', 'open')
            .in('id', newIds)
            .order('departure_time', { ascending: true })

          if (filters.transport_type) {
            stopJourneyQuery = stopJourneyQuery.eq('transport_type', filters.transport_type)
          }

          const { data: additionalJourneys } = await stopJourneyQuery
          if (additionalJourneys) {
            results.push(...additionalJourneys)
          }
        }
      }

      // Sort merged results by departure_time
      results.sort((a, b) =>
        new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
      )

      return { success: true, data: results }
    }

    // No destination search — simple query
    let query = (supabase.from('journeys') as any).select(`
      *,
      users:user_id (
        name,
        avatar_url,
        college,
        college_year
      ),
      journey_stops (
        id,
        stop_name,
        stop_lat,
        stop_lng,
        transport_type,
        transport_number,
        stop_order,
        estimated_arrival,
        estimated_departure
      )
    `).eq('status', 'open').order('departure_time', { ascending: true })

    if (filters) {
      if (filters.target_date) {
        const targetDateStr = filters.target_date.toISOString().split('T')[0]
        query = query.gte('departure_time', `${targetDateStr}T00:00:00Z`)
          .lte('departure_time', `${targetDateStr}T23:59:59Z`)
      }
      if (filters.transport_type) {
        query = query.eq('transport_type', filters.transport_type)
      }
      if (filters.transport_number) {
        query = query.ilike('transport_number', `%${filters.transport_number}%`)
      }
    }

    const { data: journeys, error } = await query

    if (error) {
      console.error("Database error searching journeys:", error)
      return { success: false, error: "Failed to fetch journeys", data: [] }
    }

    return { success: true, data: journeys || [] }
  } catch (error) {
    console.error("Error in searchJourneys:", error)
    return { success: false, error: "An unexpected error occurred", data: [] }
  }
}
