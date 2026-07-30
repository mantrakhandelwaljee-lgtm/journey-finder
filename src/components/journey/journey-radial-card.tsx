import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, CarFront, Plane, Train, Bus } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"

interface JourneyRadialCardProps {
  journey: any
  isActive: boolean
  onClick: () => void
}

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'flight': return <Plane className="w-5 h-5" />
    case 'train': return <Train className="w-5 h-5" />
    case 'bus': return <Bus className="w-5 h-5" />
    default: return <CarFront className="w-5 h-5" />
  }
}

export function JourneyRadialCard({ journey, isActive, onClick }: JourneyRadialCardProps) {
  const user = journey.users
  const departureTime = new Date(journey.departure_time)

  return (
    <motion.div
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-white/20 p-6 flex flex-col gap-4 cursor-pointer transition-colors duration-300 ${
        isActive ? 'bg-[#FFF8F0]/80 shadow-[0_20px_40px_-10px_rgba(43,33,27,0.15)]' : 'bg-[#FFF8F0]/40'
      }`}
      style={{
        width: 320,
        height: 400,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-white/40">
            <AvatarImage src={user?.avatar_url || ""} />
            <AvatarFallback className="bg-[#2B211B] text-[#FFF9F3]">{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg text-[#2B211B] leading-tight">{user?.name}</p>
            <p className="text-sm text-[#7B6A5F]">
              {user?.college}
            </p>
          </div>
        </div>
        <div className="p-3 rounded-full bg-white/40 text-[#2B211B]">
          {getTransportIcon(journey.transport_type)}
        </div>
      </div>

      <div className="flex-1 mt-4 relative">
        {/* Route Line */}
        <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#2B211B]/20 via-[#2B211B]/10 to-[#B77B5D]/40 rounded-full" />
        
        <div className="space-y-8 relative">
          <div className="flex gap-4 items-center">
            <div className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center shadow-sm z-10">
              <div className="w-2 h-2 rounded-full bg-[#2B211B]" />
            </div>
            <div>
              <p className="text-xs text-[#7B6A5F] uppercase tracking-wider font-semibold">Origin</p>
              <p className="text-lg font-medium text-[#2B211B] truncate w-[220px]">{journey.origin_name}</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-6 h-6 rounded-full bg-[#B77B5D]/20 flex items-center justify-center shadow-sm z-10">
              <MapPin className="w-3.5 h-3.5 text-[#B77B5D]" />
            </div>
            <div>
              <p className="text-xs text-[#7B6A5F] uppercase tracking-wider font-semibold">Destination</p>
              <p className="text-lg font-medium text-[#2B211B] truncate w-[220px]">{journey.destination_name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-[#7B6A5F]/10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#7B6A5F]">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Date & Time</span>
          </div>
          <span className="text-sm font-semibold text-[#2B211B]">{format(departureTime, "MMM d, h:mm a")}</span>
        </div>
        
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1.5 text-[#7B6A5F]">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Seats left</span>
          </div>
          <span className="text-sm font-semibold text-[#2B211B]">{journey.seats_available} seats</span>
        </div>
      </div>
      
      {/* Active Glow Overlay */}
      <motion.div 
        className="absolute inset-0 border-2 rounded-3xl pointer-events-none"
        initial={false}
        animate={{ 
          borderColor: isActive ? 'rgba(183,123,93,0.3)' : 'rgba(255,255,255,0)',
          boxShadow: isActive ? 'inset 0 0 40px rgba(183,123,93,0.1)' : 'inset 0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
