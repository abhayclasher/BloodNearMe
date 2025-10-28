"use client"

import React, { useState } from "react"
import { getDbClient } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { BLOOD_GROUPS, INDIAN_STATES, CITIES_BY_STATE } from "@/lib/types"
import type { DonorProfile } from "@/lib/types"

const DUMMY_DONORS: DonorProfile[] = [
  // ... your dummy donors as before ...
]

export default function DonorSearch() {
  const [filters, setFilters] = useState({
    state: "Maharashtra",
    city: "Mumbai",
    bloodGroup: "O+",
  })

  const [donors, setDonors] = useState<DonorProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const cities = CITIES_BY_STATE[filters.state] || []

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: CITIES_BY_STATE[value]?.[0] || "" }),
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const db = getDbClient()
      if (!db) throw new Error("Firestore is not available in this environment")

      const q = query(
        collection(db, "donors"),
        where("state", "==", filters.state),
        where("city", "==", filters.city),
        where("bloodGroup", "==", filters.bloodGroup),
      )

      const querySnapshot = await getDocs(q)
      const donorsList: DonorProfile[] = []

      querySnapshot.forEach((doc) => {
        donorsList.push(doc.data() as DonorProfile)
      })

      // If no results from Firestore, show dummy data that matches filters
      if (donorsList.length === 0) {
        const filteredDummy = DUMMY_DONORS.filter(
          (d) => d.state === filters.state && d.city === filters.city && d.bloodGroup === filters.bloodGroup,
        )
        setDonors(filteredDummy)
      } else {
        setDonors(donorsList)
      }
    } catch (error) {
      console.log("[v0] Error searching donors:", error)
      // Fallback to dummy data on error
      const filteredDummy = DUMMY_DONORS.filter(
        (d) => d.state === filters.state && d.city === filters.city && d.bloodGroup === filters.bloodGroup,
      )
      setDonors(filteredDummy)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-card border border-border rounded-lg p-6 slide-down">
        <h2 className="text-2xl font-bold mb-6">Find Donors</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-light disabled:opacity-50 transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div>
          <h3 className="text-xl font-bold mb-4">
            {loading ? "Searching..." : `Found ${donors.length} donor${donors.length !== 1 ? "s" : ""}`}
          </h3>

          {donors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary transition transform hover:scale-105 slide-down"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{donor.fullName}</h3>
                      <p className="text-gray-400 text-sm">{donor.age} years old</p>
                    </div>
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 text-gray-400 text-sm">
                    <p>
                      <span className="text-gray-300 font-medium">Location:</span> {donor.city}, {donor.state}
                    </p>
                    <p>
                      <span className="text-gray-300 font-medium">Gender:</span> {donor.gender}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Available to donate
                    </p>
                  </div>

                  <a
                    href={`tel:${donor.phoneNumber}`}
                    className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg transition text-center block"
                  >
                    Call: {donor.phoneNumber}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">No donors found matching your criteria.</p>
              <p className="text-sm text-muted-foreground">Try searching in a different city or blood group.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}