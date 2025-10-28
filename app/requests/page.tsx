"use client"

import { useState, useEffect, useCallback } from "react"
import { getDbClient } from "@/lib/firebase"
import { collection, query, orderBy, getDocs, limit, startAfter, type QueryConstraint } from "firebase/firestore"
import type { BloodRequest } from "@/lib/types"

const REQUESTS_PER_PAGE = 10

export default function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filter, setFilter] = useState<"all" | "open" | "fulfilled">("open")
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)

  const fetchInitialRequests = useCallback(async () => {
    try {
      setLoading(true)
      const db = getDbClient()
      if (!db) {
        setLoading(false)
        return
      }
      const constraints: QueryConstraint[] = [orderBy("createdAt", "desc"), limit(REQUESTS_PER_PAGE)]
      const q = query(collection(db, "bloodRequests"), ...constraints)
      const querySnapshot = await getDocs(q)

      const requestsList: BloodRequest[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        requestsList.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          status: data.status || 'open',
        } as BloodRequest)
      })

      setRequests(requestsList)
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
      setHasMore(querySnapshot.docs.length === REQUESTS_PER_PAGE)
    } catch (error) {
      console.log("[v0] Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMoreRequests = useCallback(async () => {
    if (!lastDoc || loadingMore || !hasMore) return

    try {
      setLoadingMore(true)
      const constraints: QueryConstraint[] = [
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(REQUESTS_PER_PAGE),
      ]
        const db = getDbClient()
        if (!db) return
        const q = query(collection(db, "bloodRequests"), ...constraints)
        const querySnapshot = await getDocs(q)

      const newRequests: BloodRequest[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        newRequests.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          status: data.status || 'open',
        } as BloodRequest)
      })

      setRequests((prev) => [...prev, ...newRequests])
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
      setHasMore(querySnapshot.docs.length === REQUESTS_PER_PAGE)
    } catch (error) {
      console.log("[v0] Error loading more requests:", error)
    } finally {
      setLoadingMore(false)
    }
  }, [lastDoc, loadingMore, hasMore])

  useEffect(() => {
    fetchInitialRequests()
  }, [fetchInitialRequests])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreRequests()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreRequests])

  const getUrgencyLabel = (urgency: string) => {
    const normalizedUrgency = urgency.toLowerCase();
    switch (normalizedUrgency) {
      case "critical":
        return "CRITICAL";
      case "high":
      case "urgent":
        return "URGENT";
      case "normal":
      case "medium":
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
      case "medium":
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
      case "medium":
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

  const filteredRequests = filter === "all" ? requests : requests.filter((r) => r.status === filter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <h1 className="text-4xl font-bold mb-2 text-white">All Blood Requests</h1>
      <p className="text-white mb-8">Browse and respond to blood donation requests from across India</p>

      <div className="flex gap-4 mb-8">
        {(["all", "open", "fulfilled"] as const).map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status)
              setRequests([])
              setLastDoc(null)
              setHasMore(true)
              fetchInitialRequests()
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === status
                ? "bg-primary text-white"
                : "bg-card border border-border hover:border-primary text-foreground"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading requests...</p>
        </div>
      ) : filteredRequests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((request, index) => {
              const normalizedUrgency = request.urgency.toLowerCase();
              const isCritical = normalizedUrgency === "critical";
              const isUrgent = normalizedUrgency === "high" || normalizedUrgency === "urgent";
              
              return (
                <div
                  key={request.id}
                  className={`relative overflow-hidden rounded-lg border-2 ${getCardStyle(request.urgency)} p-4 hover:shadow-2xl transition-all duration-300 fade-in ${isCritical ? 'animate-pulse-border' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Emergency Stripe for Critical/Urgent */}
                  {(isCritical || isUrgent) && (
                    <div className={`absolute top-0 left-0 right-0 h-1 ${isCritical ? 'bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse' : 'bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600'}`}></div>
                  )}

                  {/* Urgency Banner */}
                  <div className="flex justify-between items-start mb-3 gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${getUrgencyColor(request.urgency)} uppercase tracking-wider flex items-center gap-1 ${isCritical ? 'animate-pulse' : ''}`}>
                          <span className="text-sm">{getUrgencyIcon(request.urgency)}</span>
                          <span className="text-xs">{getUrgencyLabel(request.urgency)}</span>
                        </span>
                        {request.status === 'fulfilled' && (
                          <span className="px-2 py-1 rounded text-xs font-bold bg-green-600 text-white border-2 border-green-500 uppercase tracking-wider">
                            ✓ DONE
                          </span>
                        )}
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
                      <span>{getTimeAgo(request.createdAt)}</span>
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

          {loadingMore && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

          {!hasMore && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No more requests to load</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">No blood requests found.</p>
          <p className="text-sm text-muted-foreground">Check back later or post a new request.</p>
        </div>
      )}
    </div>
  )
}
