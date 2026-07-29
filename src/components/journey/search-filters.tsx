"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { searchJourneySchema, SearchJourneyFormValues } from "@/lib/validators"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocationPicker } from "@/components/map/location-picker"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isSearching, setIsSearching] = useState(false)
  const [transportType, setTransportType] = useState<string>(searchParams.get("transport") || "any")

  const form = useForm<SearchJourneyFormValues>({
    resolver: zodResolver(searchJourneySchema) as any,
    defaultValues: {
      destination: searchParams.get("dest") 
        ? { name: searchParams.get("dest")!, lat: 0, lng: 0 } 
        : undefined,
      target_date: searchParams.get("date") 
        ? new Date(searchParams.get("date")!) 
        : undefined,
      transport_type: searchParams.get("transport") || undefined,
      transport_number: searchParams.get("tn") || undefined,
    },
  })

  const { register, handleSubmit, setValue, watch } = form
  const destName = watch("destination.name")

  const needsTransportNumber = transportType === "train" || transportType === "flight"

  const onSubmit = (data: SearchJourneyFormValues) => {
    setIsSearching(true)
    const params = new URLSearchParams()
    
    if (data.destination?.name) {
      params.set("dest", data.destination.name)
    }

    if (data.target_date) {
      params.set("date", data.target_date.toISOString().split('T')[0])
    }

    if (transportType && transportType !== "any") {
      params.set("transport", transportType)
    }

    if (data.transport_number) {
      params.set("tn", data.transport_number)
    }

    router.push(`${pathname}?${params.toString()}`)
    setIsSearching(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-card border rounded-lg p-5 shadow-sm mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-1">
          <LocationPicker
            label="Going to"
            value={destName || ""}
            placeholder="Search destination..."
            onLocationSelect={(loc) => {
              setValue("destination", { name: loc.name, lat: loc.lat, lng: loc.lng })
            }}
            onChange={(e) => {
              setValue("destination.name", e.target.value)
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input 
            type="date" 
            onChange={(e) => {
              if (e.target.value) {
                setValue("target_date", new Date(e.target.value))
              } else {
                setValue("target_date", undefined)
              }
            }}
            defaultValue={searchParams.get("date") || ""}
          />
        </div>
        <div className="space-y-2">
          <Label>Transport</Label>
          <Select
            value={transportType}
            onValueChange={(val) => {
              setTransportType(val)
              const newVal = val === "any" ? undefined : val
              setValue("transport_type", newVal)
              if (newVal !== "train" && newVal !== "flight") {
                setValue("transport_number", undefined)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any mode</SelectItem>
              <SelectItem value="car">Car / Ride Share</SelectItem>
              <SelectItem value="train">Train</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
              <SelectItem value="flight">Flight</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSearching} className="w-full h-10">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {needsTransportNumber && (
        <div className="max-w-sm">
          <Label>{transportType === "train" ? "Train Number" : "Flight Number"}</Label>
          <Input 
            placeholder={transportType === "train" ? "e.g. 12301" : "e.g. AI-302"}
            {...register("transport_number")} 
          />
        </div>
      )}
    </form>
  )
}
