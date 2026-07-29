"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileFormValues } from "@/lib/validators"
import { ACADEMIC_YEARS } from "@/lib/constants"
import { upsertProfile } from "@/actions/user"
import { useSession } from "next-auth/react"
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

export function ProfileForm({ initialName }: { initialName: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { update } = useSession()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName,
      phone: "",
      college: "",
      college_year: "",
      branch: "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    try {
      const result = await upsertProfile(data)
      if (result.success) {
        // Trigger a session update to refresh the isOnboarded status
        await update({ isOnboarded: true })
        toast.success("Profile saved successfully!")
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (error) {
      toast.error("Failed to save profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form
  const yearValue = watch("college_year")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone / WhatsApp Number</Label>
        <Input id="phone" type="tel" placeholder="+1234567890" {...register("phone")} />
        <p className="text-xs text-muted-foreground">Used for others to contact you for journeys</p>
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="college">College / University</Label>
        <Input id="college" placeholder="State University" {...register("college")} />
        {errors.college && <p className="text-sm text-destructive">{errors.college.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="college_year">Academic Year</Label>
          <Select 
            value={yearValue || undefined} 
            onValueChange={(val) => val && setValue("college_year", val as string, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.college_year && <p className="text-sm text-destructive">{errors.college_year.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch / Department</Label>
          <Input id="branch" placeholder="Computer Science" {...register("branch")} />
          {errors.branch && <p className="text-sm text-destructive">{errors.branch.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Complete Profile"}
      </Button>
    </form>
  )
}
