"use client"

import type { DonorProfile } from "@/lib/types"

interface DonorCardProps {
  donor: DonorProfile
}

export default function DonorCard({ donor }: DonorCardProps) {
  const whatsappLink = `https://wa.me/91${donor.phone.replace(/\D/g, "")}?text=Hi%20${donor.name}%2C%20I%20need%20blood%20donation.`
  const phoneLink = `tel:+91${donor.phone.replace(/\D/g, "")}`

  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 border-2 border-gray-700/50 backdrop-blur-sm rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 hover:scale-[1.02]">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
      
      <div className="relative">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 truncate">{donor.name}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>📍</span>
              <span className="font-medium truncate">{donor.city}, {donor.state}</span>
            </div>
          </div>
          
          {/* Blood Group Badge - Enhanced 3D Design */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl p-3 min-w-[70px] shadow-2xl border-2 border-blue-400/50 transform group-hover:scale-110 transition-transform duration-300">
              <div className="text-center">
                <div className="text-3xl font-black leading-none drop-shadow-2xl mb-0.5">{donor.bloodGroup}</div>
                <div className="text-[9px] font-bold opacity-90 tracking-widest uppercase">Donor</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Age */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-blue-500/20 backdrop-blur-sm">
            <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Age</div>
            <div className="text-blue-400 font-black text-2xl leading-none">{donor.age}</div>
          </div>

          {/* Gender */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-blue-500/20 backdrop-blur-sm">
            <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Gender</div>
            <div className="text-blue-400 font-bold text-sm capitalize">{donor.gender}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={phoneLink}
            className="group/btn relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-700 ease-out"></div>
            <span className="relative text-base">📞</span>
            <span className="relative">Call</span>
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-green-900/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-700 ease-out"></div>
            <span className="relative text-base">💬</span>
            <span className="relative">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
