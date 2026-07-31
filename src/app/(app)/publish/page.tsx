import { PublishForm } from "@/components/journey/publish-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function PublishPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="premium-search-container shadow-lg p-2 md:p-6">
        <CardHeader>
          <CardTitle className="font-heading font-semibold text-[38px] text-[#2B211B]">Publish a Journey</CardTitle>
          <CardDescription className="text-[#51443B] font-sans">
            Share your travel plans to find companions heading the same way.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PublishForm />
        </CardContent>
      </div>
    </div>
  )
}
