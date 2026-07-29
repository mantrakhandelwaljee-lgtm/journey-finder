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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Publish a Journey</CardTitle>
          <CardDescription>
            Share your travel plans to find companions heading the same way.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PublishForm />
        </CardContent>
      </Card>
    </div>
  )
}
