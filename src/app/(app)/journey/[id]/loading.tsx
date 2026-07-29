import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function JourneyDetailLoading() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="md:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <div className="h-9 w-52 bg-muted rounded animate-pulse" />
            <div className="h-7 w-20 bg-muted rounded-full animate-pulse" />
          </div>

          <Card>
            <div className="bg-muted p-4 border-b flex justify-between items-center">
              <div className="h-5 w-32 bg-muted-foreground/10 rounded animate-pulse" />
              <div className="h-5 w-44 bg-muted-foreground/10 rounded animate-pulse" />
            </div>
            <CardContent className="p-6 space-y-8">
              {/* Origin */}
              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
              {/* Destination */}
              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 w-28 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
              </div>
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              <div className="h-4 w-28 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
