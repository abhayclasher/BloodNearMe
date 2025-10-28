"use client"

import { useEffect, useRef, useState } from "react"
import { getDbClient } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import type { User } from "@/lib/types"

interface DonorMapProps {
  state: string
  city: string
  bloodGroup: string
}

export default function DonorMap({ state, city, bloodGroup }: DonorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [donors, setDonors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const markersRef = useRef<any[]>([])

  // City coordinates (sample data - in production, use geocoding API)
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    Mumbai: { lat: 19.076, lng: 72.8479 },
    Pune: { lat: 18.5204, lng: 73.8567 },
    Nagpur: { lat: 21.1458, lng: 79.0882 },
    Bangalore: { lat: 12.9716, lng: 77.5946 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Delhi: { lat: 28.7041, lng: 77.1025 },
    Hyderabad: { lat: 17.385, lng: 78.4867 },
  }

  // Fetch donors when filters change
  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true)
      try {
        const db = getDbClient()
        if (!db) return
        const q = query(
          collection(db, "users"),
          where("role", "==", "donor"),
          where("state", "==", state),
          where("city", "==", city),
          where("bloodGroup", "==", bloodGroup),
        )

        const querySnapshot = await getDocs(q)
        const donorsList: User[] = []

        querySnapshot.forEach((doc) => {
          donorsList.push(doc.data() as User)
        })

        setDonors(donorsList)
      } catch (error) {
        console.error("Error fetching donors:", error)
        setDonors([])
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [state, city, bloodGroup])

  // Initialize map only once per city
  useEffect(() => {
    if (!mapRef.current || !(window as any).google?.maps) return

    const coordinates = cityCoordinates[city] || { lat: 20.5937, lng: 78.9629 }

    const newMap = new (window as any).google.maps.Map(mapRef.current, {
      zoom: 12,
      center: coordinates,
      styles: [
        {
          elementType: "geometry",
          stylers: [{ color: "#242f3e" }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#242f3e" }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#746855" }],
        },
      ],
    })

    setMap(newMap)

    // Cleanup function to clear markers when city changes or component unmounts
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []
    }
    // eslint-disable-next-line
  }, [city])

  // Add markers when donors or map changes
  useEffect(() => {
    if (!map || !donors) return

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    const coordinates = cityCoordinates[city] || { lat: 20.5937, lng: 78.9629 }

    donors.forEach((donor) => {
      const lat = coordinates.lat + (Math.random() - 0.5) * 0.1
      const lng = coordinates.lng + (Math.random() - 0.5) * 0.1

      const marker = new (window as any).google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: donor.name,
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#dc2626",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div style="color: #000; padding: 8px;">
            <strong>${donor.name}</strong><br/>
            Blood Group: <strong>${donor.bloodGroup}</strong><br/>
            Age: ${donor.age || 'N/A'}<br/>
            ${donor.phone ? `<a href="tel:+91${donor.phone.replace(/\D/g, "")}" style="color: #dc2626;">Call</a>` : ""}
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })

      markersRef.current.push(marker)
    })
  }, [donors, map, city])

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-2">
          {loading ? "Loading map..." : `${donors.length} donor${donors.length !== 1 ? "s" : ""} in ${city}`}
        </h3>
      </div>
      <div ref={mapRef} className="w-full h-96 rounded-lg border border-border" />
    </div>
  )
}