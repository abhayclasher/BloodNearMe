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
    <div className="min-h-screen bg-gradient-to-b from-background via-card/20 to-background">
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
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          background-size: 1000px 100%;
        }
      `}</style>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-950/40 via-red-900/30 to-red-950/40 border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-sm font-medium">
              🆘 Live Requests
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-red-300 to-white bg-clip-text text-transparent">
              Blood Requests
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
              Browse and respond to urgent blood donation requests from across India. Every response can save a life.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="bg-card/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-2 inline-flex gap-2">
            {([
              { value: "all", label: "All Requests", icon: "📋", count: requests.length },
              { value: "open", label: "Active", icon: "🔴", count: requests.filter(r => r.status === 'open').length },
              { value: "fulfilled", label: "Fulfilled", icon: "✅", count: requests.filter(r => r.status === 'fulfilled').length }
            ] as const).map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setFilter(tab.value)
                  setRequests([])
                  setLastDoc(null)
                  setHasMore(true)
                  fetchInitialRequests()
                }}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filter === tab.value
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === tab.value ? "bg-white/20" : "bg-gray-700"
                  }`}>
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading requests...</p>
        </div>
      ) : filteredRequests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request, index) => {
              const normalizedUrgency = request.urgency.toLowerCase();
              const isCritical = normalizedUrgency === "critical";
              const isUrgent = normalizedUrgency === "high" || normalizedUrgency === "urgent";
              const isFulfilled = request.status === 'fulfilled';
              
              return (
                <div
                  key={request.id}
                  className={`group relative overflow-hidden rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] fade-in ${
                    isFulfilled
                      ? 'bg-gradient-to-br from-green-950/40 via-green-900/30 to-green-950/40 border-green-500/50 shadow-xl shadow-green-900/30 opacity-75'
                      : isCritical 
                      ? 'bg-gradient-to-br from-red-950/40 via-red-900/30 to-red-950/40 border-red-500/50 shadow-2xl shadow-red-900/40 hover:shadow-red-600/50' 
                      : isUrgent
                      ? 'bg-gradient-to-br from-orange-950/40 via-orange-900/30 to-orange-950/40 border-orange-500/50 shadow-xl shadow-orange-900/30 hover:shadow-orange-600/40'
                      : 'bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-gray-600'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Animated Background Gradient */}
                  {!isFulfilled && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
                  )}

                  {/* Emergency Top Border Animation */}
                  {(isCritical || isUrgent) && !isFulfilled && (
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
                        {/* Urgency & Status Badges */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                            isCritical && !isFulfilled
                              ? 'bg-red-600 border-red-400 text-white animate-pulse'
                              : isUrgent && !isFulfilled
                              ? 'bg-orange-600 border-orange-400 text-white'
                              : isFulfilled
                              ? 'bg-green-600 border-green-400 text-white'
                              : 'bg-blue-600 border-blue-400 text-white'
                          }`}>
                            <span className="text-base">{isFulfilled ? '✓' : getUrgencyIcon(request.urgency)}</span>
                            <span>{isFulfilled ? 'FULFILLED' : getUrgencyLabel(request.urgency)}</span>
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <span>⏱️</span>
                            <span>{getTimeAgo(request.createdAt)}</span>
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
                        <div className={`absolute inset-0 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity ${
                          isFulfilled ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div className={`relative text-white rounded-xl p-4 min-w-[80px] shadow-2xl border-2 transform group-hover:scale-110 transition-transform duration-300 ${
                          isFulfilled 
                            ? 'bg-gradient-to-br from-green-600 via-green-700 to-green-800 border-green-400/50'
                            : 'bg-gradient-to-br from-red-600 via-red-700 to-red-800 border-red-400/50'
                        }`}>
                          <div className="text-center">
                            <div className="text-4xl font-black leading-none drop-shadow-2xl mb-1">{request.bloodGroup}</div>
                            <div className="text-[10px] font-bold opacity-90 tracking-widest uppercase">{isFulfilled ? 'Done' : 'Needed'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Units Needed */}
                      <div className={`bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border backdrop-blur-sm ${
                        isFulfilled ? 'border-green-500/30' : 'border-red-500/30'
                      }`}>
                        <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Units Required</div>
                        <div className="flex items-baseline gap-1">
                          <span className={`font-black text-3xl leading-none ${
                            isFulfilled ? 'text-green-400' : 'text-red-400'
                          }`}>{request.unitsNeeded}</span>
                          <span className="text-gray-300 text-xs font-medium">unit{request.unitsNeeded > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-gray-700/30 backdrop-blur-sm">
                        <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Status</div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full shadow-lg ${
                            isFulfilled 
                              ? 'bg-green-500 shadow-green-500/50' 
                              : 'bg-green-500 animate-pulse shadow-green-500/50'
                          }`}></div>
                          <span className={`text-sm font-bold ${
                            isFulfilled ? 'text-green-400' : 'text-green-400'
                          }`}>{isFulfilled ? 'DONE' : 'ACTIVE'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Reason */}
                    {(request.reason || request.description) && (
                      <div className={`mb-4 rounded-xl p-4 border backdrop-blur-sm ${
                        isFulfilled
                          ? 'bg-gradient-to-r from-green-900/30 via-green-800/20 to-green-900/30 border-green-500/30'
                          : 'bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 border-red-500/30'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
                            isFulfilled
                              ? 'bg-green-600/30 border-green-500/50'
                              : 'bg-red-600/30 border-red-500/50'
                          }`}>
                            <span className={isFulfilled ? 'text-green-400' : 'text-red-400'} >📋</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2 ${
                              isFulfilled ? 'text-green-300' : 'text-red-300'
                            }`}>
                              <span>Medical Reason</span>
                              <div className={`flex-1 h-px bg-gradient-to-r to-transparent ${
                                isFulfilled ? 'from-green-500/50' : 'from-red-500/50'
                              }`}></div>
                            </div>
                            <p className="text-white text-sm font-medium leading-relaxed">
                              {request.reason || request.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Call to Action Button */}
                    {!isFulfilled && (
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
                    )}
                    {isFulfilled && (
                      <div className="flex items-center justify-center gap-2 w-full font-bold py-4 px-6 rounded-xl bg-green-900/30 border-2 border-green-500/50 text-green-400">
                        <span className="text-xl">✓</span>
                        <span className="text-sm tracking-wide">REQUEST FULFILLED</span>
                      </div>
                    )}
                  </div>
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
        <div className="bg-card/50 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🩸</div>
          <p className="text-white mb-4 text-lg font-semibold">No blood requests found.</p>
          <p className="text-sm text-gray-400">Check back later or post a new request.</p>
        </div>
      )}
      </div>
    </div>
  )
}
