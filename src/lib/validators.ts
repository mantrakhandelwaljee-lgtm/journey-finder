import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  college: z.string().min(2, "College name is required"),
  college_year: z.string().min(1, "Please select your academic year"),
  branch: z.string().min(2, "Branch is required"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const locationSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export const stopSchema = z.object({
  location: locationSchema,
  arrival_time: z.date(),
  departure_time: z.date(),
  transport_type: z.string().min(1, "Please select a transport type"),
  transport_number: z.string().optional(),
});

export const publishJourneySchema = z.object({
  origin: locationSchema,
  destination: locationSchema,
  departure_time: z.date(),
  arrival_time: z.date(),
  transport_type: z.string().min(1, "Please select a transport type"),
  transport_number: z.string().optional(),
  seats_available: z.coerce.number().min(1, "At least 1 seat must be available").max(10, "Maximum 10 seats allowed"),
  notes: z.string().optional(),
  stops: z.array(stopSchema).optional(),
});

export type PublishJourneyFormValues = z.infer<typeof publishJourneySchema>;

export const searchJourneySchema = z.object({
  destination: locationSchema.optional(),
  target_date: z.date().optional(),
  transport_type: z.string().optional(),
  transport_number: z.string().optional(),
});

export type SearchJourneyFormValues = z.infer<typeof searchJourneySchema>;
