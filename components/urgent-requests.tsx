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

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "🚨"
      case "high":
      case "urgent":
        return "⚠️"
      case "normal":
      case "low":
        return "✓"
      default:
        return "•"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
      case "urgent":
        return "bg-orange-600 text-white"
      case "normal":
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

  return (
    <div suppressHydrationWarning>
    <section className="py-16 px-4 bg-background">
      <style>{`
        @keyframes pulseUrgent {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slideInCard {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes glowRedBorder {
          0%, 100% {
            box-shadow: 0 0 10px rgba(220, 38, 38, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
          }
        }
        .pulse-badge {
          animation: pulseUrgent 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .slide-card {
          animation: slideInCard 0.5s ease-out forwards;
        }
        .glow-card {
          animation: glowRedBorder 2s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto" suppressHydrationWarning>
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white pulse-badge text-lg">
              🚨
            </div>
            <h2 className="text-4xl font-bold text-white">Urgent Blood Requests</h2>
          </div>
          <p className="text-gray-400 text-lg">
            Help save lives by responding to these critical blood requests from across India.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No urgent requests at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {requests.map((request, index) => (
                <div
                  key={request.id}
                  className="bg-card border border-l-4 border-gray-700 border-l-red-600 rounded-lg p-6 hover:border-gray-600 transition-all duration-300 slide-card glow-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{request.name}</h3>
                      <p className="text-gray-400 text-sm">{request.hospital}</p>
                    </div>
                    <div
                      className={`${getUrgencyColor(request.urgency)} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}
                    >
                      <span>{getUrgencyIcon(request.urgency)}</span>
                      {request.bloodGroup}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                      Units Needed:{" "}
                      <span className="text-red-500 font-bold text-lg pulse-badge">{request.unitsNeeded}</span>
                    </p>
                  </div>

                  <div className="space-y-2 mb-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      {request.city}, {request.state}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⏱️</span>
                      {mounted ? getTimeAgo(request.createdAt) : 'Loading...'}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-6 italic">{request.description}</p>

                  <div className="flex gap-3">
                    <a
                      href={`tel:${request.phone}`}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center"
                    >
                      📞 Call: {request.phone}
                    </a>
                  </div>
                </div>
              ))}
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
    </div>
  )
}
