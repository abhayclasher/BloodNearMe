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
    <section className="py-16 px-4 bg-background">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {requests.map((request, index) => {
                const normalizedUrgency = request.urgency.toLowerCase();
                const isCritical = normalizedUrgency === "critical";
                const isUrgent = normalizedUrgency === "high" || normalizedUrgency === "urgent";
                
                return (
                  <div
                    key={request.id}
                    className={`relative overflow-hidden rounded-lg border-2 ${getCardStyle(request.urgency)} p-4 hover:shadow-2xl transition-all duration-300 slide-card ${isCritical ? 'animate-pulse-border' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Emergency Stripe for Critical/Urgent */}
                    {(isCritical || isUrgent) && (
                      <div className={`absolute top-0 left-0 right-0 h-1 ${isCritical ? 'bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse' : 'bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600'}`}></div>
                    )}

                    {/* Urgency Banner */}
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${getUrgencyColor(request.urgency)} uppercase tracking-wider flex items-center gap-1 ${isCritical ? 'animate-pulse' : ''}`}>
                            <span className="text-sm">{getUrgencyIcon(request.urgency)}</span>
                            <span className="text-xs">{getUrgencyLabel(request.urgency)}</span>
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{request.name}</h3>
                        <p className="text-white text-xs flex items-center gap-1 mt-0.5">
                          <span>🏥</span> {request.hospital}
                        </p>
                      </div>

                      {/* Blood Group Badge - More Prominent */}
                      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg p-3 min-w-[65px] shadow-xl border-2 border-red-400">
                        <div className="text-3xl font-black leading-none drop-shadow-lg">{request.bloodGroup}</div>
                        <div className="text-xs mt-1 font-bold opacity-90 tracking-wide">NEEDED</div>
                      </div>
                    </div>

                    {/* Units Needed - Highlighted */}
                    <div className="mb-3 bg-black/30 rounded p-2 border-l-4 border-red-500">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xs font-semibold">Units Required:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-red-500 font-black text-xl animate-pulse">{request.unitsNeeded}</span>
                          <span className="text-white text-xs">unit{request.unitsNeeded > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Time */}
                    <div className="space-y-1.5 mb-3 text-white text-xs">
                      <div className="flex items-center gap-2 bg-black/20 rounded p-1.5">
                        <span>📍</span>
                        <span className="font-medium">{request.city}, {request.state}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-black/20 rounded p-1.5">
                        <span>⏱️</span>
                        <span>{mounted ? getTimeAgo(request.createdAt) : 'Loading...'}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                      <p className="text-white/90 text-xs mb-3 italic bg-black/20 rounded p-2">
                        "{request.description}"
                      </p>
                    )}

                    {/* Call Button */}
                    <a
                      href={`tel:${request.phone}`}
                      className={`flex items-center justify-center gap-2 w-full font-bold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center shadow-lg text-sm ${
                        isCritical 
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                          : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                      }`}
                    >
                      <span>📞</span>
                      <span>CALL NOW: {request.phone}</span>
                    </a>
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
