"use client"

import React, { useState, useEffect } from "react"
import { getDbClient } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import type { DonorProfile } from "@/lib/types"
import { BLOOD_GROUPS, INDIAN_STATES, CITIES_BY_STATE } from "@/lib/types"

export default function AllDonors() {
  const [donors, setDonors] = useState<DonorProfile[]>([])
  const [activeDonors, setActiveDonors] = useState<DonorProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [activeLoading, setActiveLoading] = useState(true)
  const [searched, setSearched] = useState(false)
  const [filters, setFilters] = useState({
    state: "West Bengal",
    bloodGroup: "O+",
  })



  useEffect(() => {
    const fetchActiveDonors = async () => {
      try {
        // First try to get all donors, then filter for available ones
        const db = getDbClient()
        if (!db) {
          setActiveLoading(false)
          return
        }
        const snapshot = await getDocs(collection(db, "donors"))
        const allDonors = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        })) as DonorProfile[]
        
        // Filter for available donors and take first 6
        const availableDonors = allDonors.filter(donor => donor.available !== false).slice(0, 6)
        setActiveDonors(availableDonors)
      } catch (error) {
        console.error("Error fetching active donors:", error)
      } finally {
        setActiveLoading(false)
      }
    }
    fetchActiveDonors()
  }, [])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const db = getDbClient()
      if (!db) return
      const q = query(
        collection(db, "donors"),
        where("state", "==", filters.state),
        where("bloodGroup", "==", filters.bloodGroup)
      )
      const snapshot = await getDocs(q)
      const donorsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as DonorProfile[]
      setDonors(donorsList)
    } catch (error) {
      console.error("Error searching donors:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Blood Donors</h2>
          <p className="text-white text-lg">
            Connect with registered blood donors in your area
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-white">Search Donors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">State</label>
              <select
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
              >
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Blood Group</label>
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
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
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search Donors"}
              </button>
            </div>
          </div>
        </form>

        {/* Active Donors List */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-white">Active Donors</h3>
          
          {activeLoading ? (
            <div className="text-center py-8">
              <p className="text-white">Loading active donors...</p>
            </div>
          ) : activeDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDonors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="relative overflow-hidden rounded-lg border-2 border-blue-600/30 bg-gradient-to-br from-blue-950/30 to-blue-900/10 p-4 hover:shadow-2xl hover:border-blue-600 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Top Stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>

                  <div className="flex justify-between items-start mb-3 gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-1 rounded text-xs font-bold border-2 border-green-500 bg-green-600 text-white uppercase tracking-wider flex items-center gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          <span className="text-xs">AVAILABLE</span>
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{donor.fullName || donor.name}</h3>
                      <p className="text-white text-xs flex items-center gap-1 mt-0.5">
                        <span>{donor.age} yrs</span> • <span>{donor.gender}</span>
                      </p>
                    </div>

                    {/* Blood Group Badge */}
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-3 min-w-[65px] shadow-xl border-2 border-blue-400">
                      <div className="text-3xl font-black leading-none drop-shadow-lg">{donor.bloodGroup}</div>
                      <div className="text-xs mt-1 font-bold opacity-90 tracking-wide">DONOR</div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-3 bg-black/30 rounded p-2 border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 text-white text-xs">
                      <span>📍</span>
                      <span className="font-medium">{donor.city}, {donor.state}</span>
                    </div>
                  </div>

                  {/* Call Button */}
                  <a
                    href={`tel:${donor.phoneNumber || donor.phone}`}
                    className="flex items-center justify-center gap-2 w-full font-bold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center shadow-lg text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    <span>📞</span>
                    <span>CALL NOW: {donor.phoneNumber || donor.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-white">No active donors available at the moment.</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searched && (
          <div>
            <h4 className="text-xl font-bold mb-4 text-white">
              {loading ? "Searching..." : `Found ${donors.length} donor${donors.length !== 1 ? "s" : ""}`}
            </h4>

            {donors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor, index) => (
                  <div
                    key={donor.id}
                    className="relative overflow-hidden rounded-lg border-2 border-blue-600/30 bg-gradient-to-br from-blue-950/30 to-blue-900/10 p-4 hover:shadow-2xl hover:border-blue-600 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Top Stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>

                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          {donor.available && (
                            <span className="px-2 py-1 rounded text-xs font-bold border-2 border-green-500 bg-green-600 text-white uppercase tracking-wider flex items-center gap-1">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              <span className="text-xs">AVAILABLE</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white">{donor.fullName || donor.name}</h3>
                        <p className="text-white text-xs flex items-center gap-1 mt-0.5">
                          <span>{donor.age} yrs</span> • <span>{donor.gender}</span>
                        </p>
                      </div>

                      {/* Blood Group Badge */}
                      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-3 min-w-[65px] shadow-xl border-2 border-blue-400">
                        <div className="text-3xl font-black leading-none drop-shadow-lg">{donor.bloodGroup}</div>
                        <div className="text-xs mt-1 font-bold opacity-90 tracking-wide">DONOR</div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mb-3 bg-black/30 rounded p-2 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 text-white text-xs">
                        <span>📍</span>
                        <span className="font-medium">{donor.city}, {donor.state}</span>
                      </div>
                    </div>

                    {/* Call Button */}
                    <a
                      href={`tel:${donor.phoneNumber || donor.phone}`}
                      className="flex items-center justify-center gap-2 w-full font-bold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center shadow-lg text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      <span>📞</span>
                      <span>CALL NOW: {donor.phoneNumber || donor.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-white mb-4">No donors found matching your criteria.</p>
                <p className="text-sm text-gray-400">Try searching in a different city or blood group.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}