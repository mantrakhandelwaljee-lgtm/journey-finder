export interface Location {
  name: string
  lat: number
  lng: number
}

export interface Stop {
  location: Location
  estimated_arrival: Date
  estimated_departure: Date
}
