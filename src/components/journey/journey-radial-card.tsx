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
    case 'flight': return <Plane className="w-3.5 h-3.5" />
    case 'train': return <Train className="w-3.5 h-3.5" />
    case 'bus': return <Bus className="w-3.5 h-3.5" />
    default: return <CarFront className="w-3.5 h-3.5" />
  }
}

export function JourneyRadialCard({ journey, isActive, onClick }: JourneyRadialCardProps) {
  const user = journey.users
  const departureTime = new Date(journey.departure_time)

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl p-3.5 flex flex-col gap-2 cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-[#1E1714] border border-[#B77B5D]/40' 
          : 'bg-[#2B211B]/95 border border-white/8'
      }`}
      style={{
        width: 170,
        height: 210,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Header: user + transport */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7 border border-white/15">
            <AvatarImage src={user?.avatar_url || ""} />
            <AvatarFallback className="bg-[#B77B5D]/30 text-[#FFF9F3] text-[9px]">{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-[11px] text-[#FFF9F3] leading-tight truncate max-w-[80px]">{user?.name}</p>
            <p className="text-[9px] text-[#A8978C] truncate max-w-[80px]">
              {user?.college}
            </p>
          </div>
        </div>
        <div className="p-1.5 rounded-full bg-white/8 text-[#D8C8B9]">
          {getTransportIcon(journey.transport_type)}
        </div>
      </div>

      {/* Route */}
      <div className="flex-1 mt-1 relative">
        <div className="absolute left-[7px] top-2.5 bottom-2.5 w-[1.5px] bg-gradient-to-b from-[#FFF9F3]/15 via-[#FFF9F3]/8 to-[#B77B5D]/30 rounded-full" />
        
        <div className="space-y-4 relative">
          <div className="flex gap-2.5 items-center">
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center z-10">
              <div className="w-1 h-1 rounded-full bg-[#FFF9F3]" />
            </div>
            <div>
              <p className="text-[8px] text-[#A8978C] uppercase tracking-wider font-semibold">From</p>
              <p className="text-[11px] font-medium text-[#FFF9F3] truncate w-[120px]">{journey.origin_name}</p>
            </div>
          </div>

          <div className="flex gap-2.5 items-center">
            <div className="w-4 h-4 rounded-full bg-[#B77B5D]/20 flex items-center justify-center z-10">
              <MapPin className="w-2.5 h-2.5 text-[#B77B5D]" />
            </div>
            <div>
              <p className="text-[8px] text-[#A8978C] uppercase tracking-wider font-semibold">To</p>
              <p className="text-[11px] font-medium text-[#FFF9F3] truncate w-[120px]">{journey.destination_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-white/8">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[#A8978C]">
            <Calendar className="w-3 h-3" />
            <span className="text-[8px] font-medium uppercase tracking-wider">Date</span>
          </div>
          <span className="text-[10px] font-semibold text-[#FFF9F3]">{format(departureTime, "MMM d, h:mm a")}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-[#A8978C]">
            <Users className="w-3 h-3" />
            <span className="text-[8px] font-medium uppercase tracking-wider">Seats</span>
          </div>
          <span className="text-[10px] font-semibold text-[#FFF9F3]">{journey.seats_available} left</span>
        </div>
      </div>
      
      {/* Active glow */}
      {isActive && (
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: 'inset 0 0 20px rgba(183,123,93,0.12), 0 0 15px rgba(183,123,93,0.08)' }}
        />
      )}
    </div>
  )
}
