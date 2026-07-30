"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { publishJourneySchema, PublishJourneyFormValues } from "@/lib/validators"
import { publishJourney, updateJourney } from "@/actions/journey"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, X, MapPin, ArrowDown, Car, Train, Bus, Plane } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LocationPicker } from "@/components/map/location-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TRANSPORT_OPTIONS = [
  { value: "car", label: "Car / Ride Share", icon: Car },
  { value: "train", label: "Train", icon: Train },
  { value: "bus", label: "Bus", icon: Bus },
  { value: "flight", label: "Flight", icon: Plane },
] as const

function TransportIcon({ type, className }: { type: string; className?: string }) {
  const opt = TRANSPORT_OPTIONS.find(o => o.value === type)
  if (!opt) return <ArrowDown className={className} />
  const Icon = opt.icon
  return <Icon className={className} />
}

function needsTransportNumber(type: string) {
  return type === "train" || type === "flight"
}

function transportNumberLabel(type: string) {
  if (type === "train") return "Train Number"
  if (type === "flight") return "Flight Number"
  return ""
}

function transportNumberPlaceholder(type: string) {
  if (type === "train") return "e.g. 12301, Rajdhani Express"
  if (type === "flight") return "e.g. AI-302, 6E-2155"
  return ""
}

// The segment connector between two locations
function SegmentConnector({
  transportType,
  transportNumber,
  onTransportTypeChange,
  onTransportNumberChange,
  errors,
}: {
  transportType: string
  transportNumber?: string
  onTransportTypeChange: (val: string) => void
  onTransportNumberChange: (val: string) => void
  errors?: { transport_type?: { message?: string }; transport_number?: { message?: string } }
}) {
  return (
    <div className="flex items-stretch gap-4 pl-2">
      {/* Directional line */}
      <div className="flex flex-col items-center w-6 shrink-0">
        <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/60 to-primary/30" />
        <div className="my-1.5 p-1.5 rounded-full bg-primary/10 border border-primary/20">
          <TransportIcon type={transportType} className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-primary/60" />
      </div>

      {/* Transport selector */}
      <div className="flex-1 py-3">
        <div className="bg-muted/30 border border-dashed border-border/60 rounded-lg p-3 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Mode of Transport</Label>
            <Select 
              value={transportType || undefined} 
              onValueChange={(val) => val && onTransportTypeChange(val as string)}
            >
              <SelectTrigger className="w-full capitalize h-9">
                <SelectValue placeholder="Select transport" />
              </SelectTrigger>
              <SelectContent>
                {TRANSPORT_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.transport_type && <p className="text-xs text-destructive">{errors.transport_type.message}</p>}
          </div>

          {needsTransportNumber(transportType) && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {transportNumberLabel(transportType)}
              </Label>
              <Input
                className="h-9"
                placeholder={transportNumberPlaceholder(transportType)}
                value={transportNumber || ""}
                onChange={(e) => onTransportNumberChange(e.target.value)}
              />
              {errors?.transport_number && <p className="text-xs text-destructive">{errors.transport_number.message}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface PublishFormProps {
  initialData?: PublishJourneyFormValues;
  journeyId?: string;
}

export function PublishForm({ initialData, journeyId }: PublishFormProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<PublishJourneyFormValues>({
    resolver: zodResolver(publishJourneySchema) as any,
    defaultValues: initialData || {
      origin: { name: "", lat: 0, lng: 0 },
      destination: { name: "", lat: 0, lng: 0 },
      notes: "",
      transport_type: "",
      transport_number: "",
      stops: [],
    },
  })

  async function onSubmit(data: PublishJourneyFormValues) {
    setIsSubmitting(true)
    try {
      const result = journeyId 
        ? await updateJourney(journeyId, data)
        : await publishJourney(data)
        
      if (result.success) {
        toast.success(journeyId ? "Journey updated successfully!" : "Journey published successfully!")
        router.push(journeyId ? `/journey/${journeyId}` : "/dashboard")
        router.refresh()
      } else {
        toast.error(result.error || (journeyId ? "Failed to update journey" : "Failed to publish journey"))
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = form
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stops",
  })

  const originName = watch("origin.name")
  const destinationName = watch("destination.name")
  const transportType = watch("transport_type")
  const transportNumber = watch("transport_number")
  const departureTime = watch("departure_time")
  const arrivalTime = watch("arrival_time")

  const formatDateForInput = (date?: Date | string) => {
    if (!date) return ""
    const d = new Date(date)
    if (isNaN(d.getTime())) return ""
    return format(d, "yyyy-MM-dd'T'HH:mm")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ──── ROUTE BUILDER ──── */}
      <div className="space-y-0">

        {/* ── ORIGIN ── */}
        <div className="flex items-start gap-4 pl-2">
          <div className="flex flex-col items-center w-6 shrink-0 pt-7">
            <div className="w-3.5 h-3.5 rounded-full bg-green-500 ring-4 ring-green-500/20" />
            {(fields.length > 0 || true) && (
              <div className="w-0.5 flex-1 bg-gradient-to-b from-green-500/60 to-primary/30 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-2 space-y-3">
            <LocationPicker
              label="From (Origin)"
              value={originName}
              onLocationSelect={(loc) => {
                setValue("origin.name", loc.name)
                setValue("origin.lat", loc.lat)
                setValue("origin.lng", loc.lng)
              }}
              onChange={(e) => {
                setValue("origin.name", e.target.value)
              }}
            />
            {errors.origin && <p className="text-sm text-destructive">{errors.origin.name?.message}</p>}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_time">Departure Date & Time</Label>
                <Input
                  id="departure_time"
                  type="datetime-local"
                  value={formatDateForInput(departureTime)}
                  onChange={(e) => setValue("departure_time", new Date(e.target.value), { shouldValidate: true })}
                />
                {errors.departure_time && <p className="text-sm text-destructive">{errors.departure_time.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ── TRANSPORT SEGMENT: Origin → first stop (or destination) ── */}
        {fields.length === 0 ? (
          // Direct origin → destination segment
          <SegmentConnector
            transportType={transportType}
            transportNumber={transportNumber}
            onTransportTypeChange={(val) => setValue("transport_type", val, { shouldValidate: true })}
            onTransportNumberChange={(val) => setValue("transport_number", val)}
            errors={errors as any}
          />
        ) : (
          // Origin → first stop: use the main journey transport
          <SegmentConnector
            transportType={transportType}
            transportNumber={transportNumber}
            onTransportTypeChange={(val) => setValue("transport_type", val, { shouldValidate: true })}
            onTransportNumberChange={(val) => setValue("transport_number", val)}
            errors={errors as any}
          />
        )}

        {/* ── STOPS ── */}
        {fields.map((field, index) => {
          const stopName = watch(`stops.${index}.location.name`)
          const stopTransportType = watch(`stops.${index}.transport_type`)
          const stopTransportNumber = watch(`stops.${index}.transport_number`)
          const stopArrivalTime = watch(`stops.${index}.arrival_time`)
          const stopDepartureTime = watch(`stops.${index}.departure_time`)

          return (
            <div key={field.id}>
              {/* Stop node */}
              <div className="flex items-start gap-4 pl-2">
                <div className="flex flex-col items-center w-6 shrink-0 pt-7">
                  <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/60 to-primary/30 mt-1" />
                </div>
                <div className="flex-1 pb-2">
                  <div className="p-4 border rounded-lg space-y-4 bg-muted/20 relative">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-primary">Stop {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <LocationPicker
                      label="Stop Location"
                      value={stopName || ""}
                      onLocationSelect={(loc) => {
                        setValue(`stops.${index}.location.name`, loc.name)
                        setValue(`stops.${index}.location.lat`, loc.lat)
                        setValue(`stops.${index}.location.lng`, loc.lng)
                      }}
                      onChange={(e) => {
                        setValue(`stops.${index}.location.name`, e.target.value)
                      }}
                    />
                    {errors.stops?.[index]?.location && (
                      <p className="text-sm text-destructive">{errors.stops[index]?.location?.name?.message}</p>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Arrival at Stop</Label>
                        <Input
                          type="datetime-local"
                          value={formatDateForInput(stopArrivalTime)}
                          onChange={(e) => setValue(`stops.${index}.arrival_time`, new Date(e.target.value), { shouldValidate: true })}
                        />
                        {errors.stops?.[index]?.arrival_time && (
                          <p className="text-sm text-destructive">{(errors.stops[index]?.arrival_time as any)?.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Departure from Stop</Label>
                        <Input
                          type="datetime-local"
                          value={formatDateForInput(stopDepartureTime)}
                          onChange={(e) => setValue(`stops.${index}.departure_time`, new Date(e.target.value), { shouldValidate: true })}
                        />
                        {errors.stops?.[index]?.departure_time && (
                          <p className="text-sm text-destructive">{(errors.stops[index]?.departure_time as any)?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transport segment: this stop → next stop / destination */}
              <SegmentConnector
                transportType={stopTransportType || ""}
                transportNumber={stopTransportNumber}
                onTransportTypeChange={(val) => setValue(`stops.${index}.transport_type`, val, { shouldValidate: true })}
                onTransportNumberChange={(val) => setValue(`stops.${index}.transport_number`, val)}
                errors={errors?.stops?.[index] as any}
              />
            </div>
          )
        })}

        {/* ── ADD STOP BUTTON ── */}
        <div className="flex items-stretch gap-4 pl-2">
          <div className="flex flex-col items-center w-6 shrink-0">
            <div className="w-0.5 flex-1 bg-primary/20" />
          </div>
          <div className="flex-1 py-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({
                location: { name: "", lat: 0, lng: 0 },
                arrival_time: new Date(),
                departure_time: new Date(),
                transport_type: "",
                transport_number: "",
              })}
              className="w-full border-dashed"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Stop
            </Button>
          </div>
        </div>

        {/* ── DESTINATION ── */}
        <div className="flex items-start gap-4 pl-2">
          <div className="flex flex-col items-center w-6 shrink-0 pt-7">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 ring-4 ring-red-500/20" />
          </div>
          <div className="flex-1 space-y-3">
            <LocationPicker
              label="To (Destination)"
              value={destinationName}
              onLocationSelect={(loc) => {
                setValue("destination.name", loc.name)
                setValue("destination.lat", loc.lat)
                setValue("destination.lng", loc.lng)
              }}
              onChange={(e) => {
                setValue("destination.name", e.target.value)
              }}
            />
            {errors.destination && <p className="text-sm text-destructive">{errors.destination.name?.message}</p>}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrival_time">Estimated Arrival</Label>
                <Input
                  id="arrival_time"
                  type="datetime-local"
                  value={formatDateForInput(arrivalTime)}
                  onChange={(e) => setValue("arrival_time", new Date(e.target.value), { shouldValidate: true })}
                />
                {errors.arrival_time && <p className="text-sm text-destructive">{errors.arrival_time.message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──── ADDITIONAL INFO ──── */}
      <div className="space-y-2">
        <Label htmlFor="seats_available">Available Seats</Label>
        <Input
          id="seats_available"
          type="number"
          min="1"
          max="10"
          {...register("seats_available", { valueAsNumber: true })}
        />
        {errors.seats_available && <p className="text-sm text-destructive">{errors.seats_available.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any specific instructions, meeting points, or preferences?"
          {...register("notes")}
        />
        {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting 
          ? (journeyId ? "Saving..." : "Publishing...") 
          : (journeyId ? "Save Changes" : "Publish Journey")}
      </Button>
    </form>
  )
}
