"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteJourney, updateJourneyStatus } from "@/actions/journey"
import { toast } from "sonner"
import { Trash2, XCircle, CheckCircle, Edit2 } from "lucide-react"

export function JourneyActions({ journeyId, status }: { journeyId: string; status: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this journey? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteJourney(journeyId)
      if (result.success) {
        toast.success("Journey deleted successfully")
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete journey")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const result = await updateJourneyStatus(journeyId, newStatus)
      if (result.success) {
        toast.success(`Journey ${newStatus === 'closed' ? 'closed' : 'reopened'} successfully`)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update journey")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push(`/journey/${journeyId}/edit`)}
      >
        <Edit2 className="mr-2 h-4 w-4" />
        Edit Journey
      </Button>
      {status === 'open' ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleStatusChange('closed')}
          disabled={isUpdating}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {isUpdating ? "Closing..." : "Close Journey"}
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleStatusChange('open')}
          disabled={isUpdating}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isUpdating ? "Reopening..." : "Reopen Journey"}
        </Button>
      )}
      <Button
        variant="destructive"
        className="w-full"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isDeleting ? "Deleting..." : "Delete Journey"}
      </Button>
    </div>
  )
}
