"use client"

import type React from "react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import DonorMap from "@/components/donor-map"
import { INDIAN_STATES, CITIES_BY_STATE } from "@/lib/types"

export default function MapPage() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    state: searchParams.get("state") || "Maharashtra",
    city: searchParams.get("city") || "Mumbai",
    bloodGroup: searchParams.get("bloodGroup") || "O+",
  })

  const cities = CITIES_BY_STATE[filters.state] || []

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: CITIES_BY_STATE[value]?.[0] || "" }),
    }))
  }


  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Donor Map</h1>

      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Blood Group</label>
            <select
              name="bloodGroup"
              value={filters.bloodGroup}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
      </div>

      <DonorMap state={filters.state} city={filters.city} bloodGroup={filters.bloodGroup} />
    </div>
  )
}


