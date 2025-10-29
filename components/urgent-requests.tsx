"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { getDbClient } from "@/lib/firebase"
import type { BloodRequest } from "@/lib/types"

export default function UrgentRequests() {
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchRequests = async () => {
      try {
        const db = getDbClient()
        if (!db) {
          setLoading(false)
          return
        }
        const q = query(collection(db, "bloodRequests"), orderBy("createdAt", "desc"), limit(10))
        const snapshot = await getDocs(q)
        const allData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        })) as BloodRequest[]
        
        // Filter only open requests and take first 4
        const openRequests = allData.filter(request => request.status === 'open').slice(0, 4)
        setRequests(openRequests)
      } catch (error) {
        console.log("[v0] Error fetching requests:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const getUrgencyLabel = (urgency: string) => {
    const normalizedUrgency = urgency.toLowerCase();
    switch (normalizedUrgency) {
      case "critical":
        return "CRITICAL";
      case "high":
      case "urgent":
        return "URGENT";
      case "normal":
        return "NORMAL";
      case "low":
        return "LOW";
      default:
        return urgency.toUpperCase();
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    const normalizedUrgency = urgency.toLowerCase();
    switch (normalizedUrgency) {
      case "critical":
        return "🚨";
      case "high":
      case "urgent":
        return "⚠️";
      case "normal":
        return "ℹ️";
      case "low":
        return "✓";
      default:
        return "🩸";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    const normalizedUrgency = urgency.toLowerCase();
    switch (normalizedUrgency) {
      case "critical":
        return "bg-red-600 text-white border-red-500";
      case "high":
      case "urgent":
        return "bg-orange-600 text-white border-orange-500";
      case "normal":
        return "bg-blue-600 text-white border-blue-500";
      case "low":
        return "bg-green-600 text-white border-green-500";
      default:
        return "bg-gray-600 text-white border-gray-500";
    }
  };

  const getCardStyle = (urgency: string) => {
    const normalizedUrgency = urgency.toLowerCase();
    switch (normalizedUrgency) {
      case "critical":
        return "border-red-600 bg-gradient-to-br from-red-950/30 to-red-900/10 shadow-red-600/20";
      case "high":
      case "urgent":
        return "border-orange-600 bg-gradient-to-br from-orange-950/30 to-orange-900/10 shadow-orange-600/20";
      default:
        return "border-gray-700 bg-card";
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white pulse-badge text-lg">
              🚨
            </div>
            <h2 className="text-4xl font-bold text-white">Urgent Blood Requests</h2>
          </div>
          <p className="text-white text-lg">
            Help save lives by responding to these critical blood requests from across India.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-white">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white">No urgent requests at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {requests.map((request, index) => {
                const normalizedUrgency = request.urgency.toLowerCase();
                const isCritical = normalizedUrgency === "critical";
                const isUrgent = normalizedUrgency === "high" || normalizedUrgency === "urgent";
                
                return (
                  <div
                    key={request.id}
                    className={`group relative overflow-hidden rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] slide-card ${
                      isCritical 
                        ? 'bg-gradient-to-br from-red-950/40 via-red-900/30 to-red-950/40 border-red-500/50 shadow-2xl shadow-red-900/40 hover:shadow-red-600/50' 
                        : isUrgent
                        ? 'bg-gradient-to-br from-orange-950/40 via-orange-900/30 to-orange-950/40 border-orange-500/50 shadow-xl shadow-orange-900/30 hover:shadow-orange-600/40'
                        : 'bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-gray-600'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-out"></div>

                    {/* Emergency Top Border Animation */}
                    {(isCritical || isUrgent) && (
                      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                        <div className={`h-full w-full ${
                          isCritical 
                            ? 'bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse' 
                            : 'bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600'
                        }`}></div>
                      </div>
                    )}

                    <div className="relative p-5">
                      {/* Header Section */}
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Urgency Badge */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                              isCritical
                                ? 'bg-red-600 border-red-400 text-white animate-pulse'
                                : isUrgent
                                ? 'bg-orange-600 border-orange-400 text-white'
                                : 'bg-blue-600 border-blue-400 text-white'
                            }`}>
                              <span className="text-base">{getUrgencyIcon(request.urgency)}</span>
                              <span>{getUrgencyLabel(request.urgency)}</span>
                            </span>
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <span>⏱️</span>
                              <span>{mounted ? getTimeAgo(request.createdAt) : 'Loading...'}</span>
                            </span>
                          </div>
                          
                          {/* Patient Name */}
                          <h3 className="text-xl font-bold text-white mb-1.5 truncate">{request.name}</h3>
                          
                          {/* Hospital */}
                          <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                            <span className="text-red-400">🏥</span>
                            <span className="truncate font-medium">{request.hospital}</span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <span>📍</span>
                            <span className="font-medium">{request.city}, {request.state}</span>
                          </div>
                        </div>

                        {/* Blood Group Badge - Enhanced 3D Design */}
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-red-500 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white rounded-xl p-4 min-w-[80px] shadow-2xl border-2 border-red-400/50 transform group-hover:scale-110 transition-transform duration-300">
                            <div className="text-center">
                              <div className="text-4xl font-black leading-none drop-shadow-2xl mb-1">{request.bloodGroup}</div>
                              <div className="text-[10px] font-bold opacity-90 tracking-widest uppercase">Needed</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Units Needed */}
                        <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-red-500/30 backdrop-blur-sm">
                          <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Units Required</div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-red-400 font-black text-3xl leading-none">{request.unitsNeeded}</span>
                            <span className="text-gray-300 text-xs font-medium">unit{request.unitsNeeded > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-gray-700/30 backdrop-blur-sm">
                          <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Status</div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                            <span className="text-green-400 text-sm font-bold">ACTIVE</span>
                          </div>
                        </div>
                      </div>

                      {/* Medical Reason */}
                      {(request.reason || request.description) && (
                        <div className="mb-4 bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 rounded-xl p-4 border border-red-500/30 backdrop-blur-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-red-600/30 rounded-lg flex items-center justify-center border border-red-500/50">
                              <span className="text-red-400 text-base">📋</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-red-300 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                <span>Medical Reason</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
                              </div>
                              <p className="text-white text-sm font-medium leading-relaxed">
                                {request.reason || request.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Call to Action Button */}
                      <a
                        href={`tel:${request.phone}`}
                        className={`group/btn relative overflow-hidden flex items-center justify-center gap-3 w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-center shadow-2xl ${
                          isCritical 
                            ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 text-white shadow-red-600/50 animate-pulse' 
                            : 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700 text-white shadow-red-900/50'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-700 ease-out"></div>
                        <span className="relative text-xl">{isCritical ? '🚨' : '📞'}</span>
                        <span className="relative text-sm tracking-wide">CALL NOW</span>
                        <span className="relative text-sm font-mono">{request.phone}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link
                href="/requests"
                className="inline-block border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                View All Requests
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
