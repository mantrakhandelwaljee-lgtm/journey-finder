"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileFormValues } from "@/lib/validators"
import { upsertProfile } from "@/actions/user"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProfileEditFormProps {
  profile: any
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      college: profile?.college || "",
      college_year: profile?.college_year || "",
      branch: profile?.branch || "",
    },
  })

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form
  const collegeYear = watch("college_year")

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    try {
      const result = await upsertProfile(data)
      if (result.success) {
        toast.success("Profile updated successfully!")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="college">College / University</Label>
        <Input id="college" {...register("college")} />
        {errors.college && <p className="text-sm text-destructive">{errors.college.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Academic Year</Label>
          <Select
            value={collegeYear || undefined}
            onValueChange={(val) => val && setValue("college_year", val as string, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Year</SelectItem>
              <SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem>
              <SelectItem value="4">4th Year</SelectItem>
              <SelectItem value="5">5th Year</SelectItem>
              <SelectItem value="pg">Post Graduate</SelectItem>
            </SelectContent>
          </Select>
          {errors.college_year && <p className="text-sm text-destructive">{errors.college_year.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch / Department</Label>
          <Input id="branch" {...register("branch")} />
          {errors.branch && <p className="text-sm text-destructive">{errors.branch.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
