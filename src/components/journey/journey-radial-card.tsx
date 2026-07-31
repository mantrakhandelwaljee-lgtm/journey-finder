import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, CarFront, Plane, Train, Bus } from "lucide-react"
import { format } from "date-fns"

interface JourneyRadialCardProps {
  journey: any
  isActive: boolean
  onClick: () => void
}

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'flight': return <Plane className="w-4 h-4" />
    case 'train': return <Train className="w-4 h-4" />
    case 'bus': return <Bus className="w-4 h-4" />
    default: return <CarFront className="w-4 h-4" />
  }
}

export function JourneyRadialCard({ journey, isActive, onClick }: JourneyRadialCardProps) {
  const user = journey.users
  const departureTime = new Date(journey.departure_time)

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-[#FFF8F0] border-2 border-[#D8C8B9]/60' 
          : 'bg-[#FFF8F0]/85 border border-[#D8C8B9]/30'
      }`}
      style={{
        width: 280,
        height: 350,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Header: user + transport */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-10 h-10 border-2 border-white/40">
            <AvatarImage src={user?.avatar_url || ""} />
            <AvatarFallback className="bg-[#2B211B] text-[#FFF9F3] text-xs">{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-[#2B211B] leading-tight">{user?.name}</p>
            <p className="text-xs text-[#7B6A5F] truncate max-w-[140px]">
              {user?.college}
            </p>
          </div>
        </div>
        <div className="p-2.5 rounded-full bg-white/50 text-[#2B211B]">
          {getTransportIcon(journey.transport_type)}
        </div>
      </div>

      {/* Route */}
      <div className="flex-1 mt-2 relative">
        <div className="absolute left-[9px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#2B211B]/20 via-[#2B211B]/10 to-[#B77B5D]/40 rounded-full" />
        
        <div className="space-y-6 relative">
          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 rounded-full bg-white/60 flex items-center justify-center shadow-sm z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2B211B]" />
            </div>
            <div>
              <p className="text-[10px] text-[#7B6A5F] uppercase tracking-wider font-semibold">Origin</p>
              <p className="text-sm font-medium text-[#2B211B] truncate w-[190px]">{journey.origin_name}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 rounded-full bg-[#B77B5D]/20 flex items-center justify-center shadow-sm z-10">
              <MapPin className="w-3 h-3 text-[#B77B5D]" />
            </div>
            <div>
              <p className="text-[10px] text-[#7B6A5F] uppercase tracking-wider font-semibold">Destination</p>
              <p className="text-sm font-medium text-[#2B211B] truncate w-[190px]">{journey.destination_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-2 gap-3 mt-auto pt-3 border-t border-[#7B6A5F]/10">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-[#7B6A5F]">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Date</span>
          </div>
          <span className="text-xs font-semibold text-[#2B211B]">{format(departureTime, "MMM d, h:mm a")}</span>
        </div>
        
        <div className="flex flex-col gap-0.5 items-end">
          <div className="flex items-center gap-1 text-[#7B6A5F]">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Seats</span>
          </div>
          <span className="text-xs font-semibold text-[#2B211B]">{journey.seats_available} left</span>
        </div>
      </div>
      
      {/* Active glow overlay */}
      {isActive && (
        <div 
          className="absolute inset-0 border-2 border-[#B77B5D]/25 rounded-2xl pointer-events-none"
          style={{ boxShadow: 'inset 0 0 30px rgba(183,123,93,0.08)' }}
        />
      )}
    </div>
  )
}
