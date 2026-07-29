export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          name: string
          phone: string | null
          college: string | null
          college_year: string | null
          branch: string | null
          avatar_url: string | null
          auth_provider: string
          is_onboarded: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          name: string
          phone?: string | null
          college?: string | null
          college_year?: string | null
          branch?: string | null
          avatar_url?: string | null
          auth_provider: string
          is_onboarded?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string
          phone?: string | null
          college?: string | null
          college_year?: string | null
          branch?: string | null
          avatar_url?: string | null
          auth_provider?: string
          is_onboarded?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      journeys: {
        Row: {
          id: string
          user_id: string
          origin_name: string
          origin_lat: number
          origin_lng: number
          destination_name: string
          destination_lat: number
          destination_lng: number
          departure_time: string
          arrival_time: string
          transport_type: string
          seats_available: number
          notes: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          origin_name: string
          origin_lat: number
          origin_lng: number
          destination_name: string
          destination_lat: number
          destination_lng: number
          departure_time: string
          arrival_time: string
          transport_type: string
          seats_available: number
          notes?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          origin_name?: string
          origin_lat?: number
          origin_lng?: number
          destination_name?: string
          destination_lat?: number
          destination_lng?: number
          departure_time?: string
          arrival_time?: string
          transport_type?: string
          seats_available?: number
          notes?: string | null
          status?: string
          created_at?: string
        }
      }
      journey_stops: {
        Row: {
          id: string
          journey_id: string
          stop_order: number
          stop_name: string
          stop_lat: number
          stop_lng: number
          estimated_arrival: string
          estimated_departure: string
        }
        Insert: {
          id?: string
          journey_id: string
          stop_order: number
          stop_name: string
          stop_lat: number
          stop_lng: number
          estimated_arrival: string
          estimated_departure: string
        }
        Update: {
          id?: string
          journey_id?: string
          stop_order?: number
          stop_name?: string
          stop_lat?: number
          stop_lng?: number
          estimated_arrival?: string
          estimated_departure?: string
        }
      }
      join_requests: {
        Row: {
          id: string
          journey_id: string
          requester_id: string
          status: string
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          journey_id: string
          requester_id: string
          status?: string
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          journey_id?: string
          requester_id?: string
          status?: string
          message?: string | null
          created_at?: string
        }
      }
    }
  }
}
