"use client"

import { useState, useEffect, useCallback } from "react"
import { db } from "@/lib/firebase"
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
      case "urgent":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-600 text-white"
      case "medium":
      case "normal":
        return "bg-yellow-600 text-white"
      case "low":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600"
    }
  }

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

      <h1 className="text-4xl font-bold mb-8">All Blood Requests</h1>

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
            {filteredRequests.map((request, index) => (
              <div
                key={request.id}
                className="bg-card border border-l-4 border-gray-700 border-l-red-600 rounded-lg p-6 hover:border-gray-600 transition-all duration-300 fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{request.name}</h3>
                    <p className="text-gray-400 text-sm">{request.hospital}</p>
                  </div>
                  <div className={`${getUrgencyColor(request.urgency)} px-3 py-1 rounded-full text-sm font-semibold`}>
                    {request.bloodGroup}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 text-sm">
                    Units Needed: <span className="text-red-500 font-bold text-lg">{request.unitsNeeded}</span>
                  </p>
                </div>

                <div className="space-y-2 mb-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {request.city}, {request.state}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {getTimeAgo(request.createdAt)}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-6 italic">{request.description}</p>

                <a
                  href={`tel:${request.phone}`}
                  className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg transition text-center block"
                >
                  Call: {request.phone}
                </a>
              </div>
            ))}
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
