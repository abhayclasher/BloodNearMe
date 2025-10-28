"use client"

import React, { useCallback, useMemo } from "react"
import type { BloodRequest } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface RequestCardProps {
  request: BloodRequest
}

const urgencyColors = new Map([
  ['low', 'bg-blue-500/20 text-blue-500'],
  ['medium', 'bg-yellow-500/20 text-yellow-500'],
  ['high', 'bg-orange-500/20 text-orange-500'],
  ['critical', 'bg-red-500/20 text-red-500']
])

const statusColors = new Map([
  ['open', 'bg-green-500/20 text-green-500'],
  ['fulfilled', 'bg-blue-500/20 text-blue-500']
])

export default function RequestCard({ request }: RequestCardProps) {
  const urgencyClass = useMemo(() => {
    if (!request?.urgency) return 'bg-gray-500/20 text-gray-500'
    return urgencyColors.get(request.urgency) || 'bg-gray-500/20 text-gray-500'
  }, [request?.urgency])
  
  const statusClass = useMemo(() => {
    if (!request?.status) return 'bg-gray-500/20 text-gray-500'
    return statusColors.get(request.status) || 'bg-gray-500/20 text-gray-500'
  }, [request?.status])
  
  const urgencyText = useMemo(() => 
    request.urgency?.charAt(0).toUpperCase() + request.urgency?.slice(1) || 'Unknown'
  , [request.urgency])
  
  const statusText = useMemo(() => 
    request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Unknown'
  , [request.status])

  const handleRespond = useCallback(() => {
    console.log(`Responding to request from ${request.name}`)
  }, [request.name])

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{request.name}</h3>
          <p className="text-sm text-muted-foreground">{request.hospital}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${urgencyClass}`}>
            {urgencyText}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
            {statusText}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p>
          <span className="text-muted-foreground">Blood Group:</span>{" "}
          <span className="font-semibold text-primary">{request.bloodGroup}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Units Needed:</span>{" "}
          <span className="font-semibold text-primary">{request.unitsNeeded}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Location:</span>{" "}
          <span className="font-medium">
            {request.city}, {request.state}
          </span>
        </p>
        <p>
          <span className="text-muted-foreground">Posted:</span>{" "}
          <span className="font-medium">{formatDate(request.createdAt)}</span>
        </p>
      </div>

      <button 
        type="button"
        onClick={handleRespond}
        className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-light transition"
        aria-label={`Respond to blood request from ${request.name}`}
      >
        Respond to Request
      </button>
    </div>
  )
}