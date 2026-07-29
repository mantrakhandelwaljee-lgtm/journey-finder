import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// This client uses the Service Role Key to bypass Row Level Security.
// It should ONLY be used in server-side environments (like Server Actions or API routes)
// where we need to perform operations on behalf of the user that RLS might otherwise block.
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
