import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JourneyCard } from "@/components/journey/journey-card"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"
import { Phone, GraduationCap, BookOpen, Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  const supabase = createAdminClient()

  // Fetch user profile
  const { data: profile } = await (supabase.from('users') as any)
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Fetch user's journeys
  const { data: journeys } = await (supabase.from('journeys') as any)
    .select(`
      *,
      users:user_id (
        name,
        avatar_url,
        college,
        college_year
      )
    `)
    .eq('user_id', session.user.id)
    .order('departure_time', { ascending: false })

  const openJourneys = journeys?.filter((j: any) => j.status === 'open') || []
  const closedJourneys = journeys?.filter((j: any) => j.status !== 'open') || []

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-2xl">
                    {profile?.name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile?.name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>

              <div className="space-y-3 text-sm border-t pt-4">
                {profile?.phone && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.college && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>{profile.college}</span>
                  </div>
                )}
                {profile?.college_year && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Year {profile.college_year}</span>
                  </div>
                )}
                {profile?.branch && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>{profile.branch}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-4">
                <div className="text-center p-3 bg-muted/40 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{journeys?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Journeys</p>
                </div>
                <div className="text-center p-3 bg-muted/40 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{openJourneys.length}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="journeys">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="journeys">My Journeys</TabsTrigger>
              <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="journeys" className="mt-6 space-y-6">
              {/* Open Journeys */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  Active Journeys ({openJourneys.length})
                </h3>
                {openJourneys.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {openJourneys.map((journey: any) => (
                      <JourneyCard key={journey.id} journey={journey} />
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-lg border-dashed p-8 text-center text-muted-foreground">
                    No active journeys
                  </div>
                )}
              </div>

              {/* Closed Journeys */}
              {closedJourneys.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    Past / Closed Journeys ({closedJourneys.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-70">
                    {closedJourneys.map((journey: any) => (
                      <JourneyCard key={journey.id} journey={journey} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="edit-profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Update Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileEditForm profile={profile} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
