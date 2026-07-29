"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"

interface PlaceSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

export interface LocationPickerProps {
  label: string
  value?: string
  onLocationSelect?: (location: { name: string; lat: number; lng: number }) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export function LocationPicker({ 
  label, 
  value = "", 
  onLocationSelect,
  onChange,
  placeholder = "Search for a place..."
}: LocationPickerProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync external value
  useEffect(() => {
    if (value !== query) {
      setQuery(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchSuggestions = useCallback(async (searchText: string) => {
    if (searchText.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=5&addressdetails=1&countrycodes=in`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      )
      if (res.ok) {
        const data: PlaceSuggestion[] = await res.json()
        setSuggestions(data)
        setShowDropdown(data.length > 0)
        setHighlightedIndex(-1)
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)

    // Also fire the legacy onChange for forms that use it
    if (onChange) {
      onChange(e)
    }

    // Debounce the API call
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 300)
  }

  const handleSelect = (suggestion: PlaceSuggestion) => {
    // Shorten the display name for better UX
    const parts = suggestion.display_name.split(", ")
    const shortName = parts.slice(0, 3).join(", ")

    setQuery(shortName)
    setSuggestions([])
    setShowDropdown(false)

    if (onLocationSelect) {
      onLocationSelect({
        name: shortName,
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon),
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[highlightedIndex])
    } else if (e.key === "Escape") {
      setShowDropdown(false)
    }
  }

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label>{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-3 h-4 w-4 text-muted-foreground animate-spin z-10" />
        )}
        <Input
          className="pl-9"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Suggestions dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => {
              const parts = suggestion.display_name.split(", ")
              const primary = parts.slice(0, 2).join(", ")
              const secondary = parts.slice(2, 4).join(", ")
              
              return (
                <button
                  key={suggestion.place_id}
                  type="button"
                  className={`w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-accent/50 transition-colors ${
                    index === highlightedIndex ? "bg-accent/50" : ""
                  } ${index !== suggestions.length - 1 ? "border-b border-border/50" : ""}`}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{primary}</p>
                    {secondary && (
                      <p className="text-xs text-muted-foreground truncate">{secondary}</p>
                    )}
                  </div>
                </button>
              )
            })}
            <div className="px-3 py-1.5 text-[10px] text-muted-foreground/50 text-right border-t">
              Powered by OpenStreetMap
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
