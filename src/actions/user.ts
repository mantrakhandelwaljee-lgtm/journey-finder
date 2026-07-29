"use server"

import { auth } from "@/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { profileSchema, ProfileFormValues } from "@/lib/validators"
import { revalidatePath } from "next/cache"

export async function upsertProfile(data: ProfileFormValues) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const parsedData = profileSchema.parse(data)
    const supabase = createAdminClient()

    const { data: updatedData, error } = await (supabase.from('users') as any).update({
        name: parsedData.name,
        phone: parsedData.phone,
        college: parsedData.college,
        college_year: parsedData.college_year,
        branch: parsedData.branch,
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error || !updatedData) {
      console.error("Database error updating profile:", error)
      return { success: false, error: "Failed to update profile. Your session might be invalid. Try signing out." }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error in upsertProfile:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
