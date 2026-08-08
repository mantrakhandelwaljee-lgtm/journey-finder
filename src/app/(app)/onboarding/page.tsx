import { ProfileForm } from "@/components/onboarding/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function OnboardingPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  // If they are already onboarded, send them to dashboard
  if (session.user.isOnboarded) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-lg shadow-lg relative">
        <div className="absolute top-4 right-4">
          <form action={async () => {
            "use server"
            await signOut()
          }}>
            <Button variant="ghost" size="sm" type="submit">Sign Out</Button>
          </form>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-heading tracking-[-0.02em]">Complete your profile</CardTitle>
          <CardDescription className="font-sans">
            Tell us a bit about yourself so others can connect with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initialName={session.user.name || ""} />
        </CardContent>
      </Card>
    </div>
  )
}
