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
    <section className="pt-0 pb-16 px-4 bg-background">
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
                  className="group relative overflow-hidden rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-blue-950/40 via-blue-900/30 to-blue-950/40 border-blue-500/50 shadow-xl shadow-blue-900/30 hover:shadow-blue-600/40"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-out"></div>

                  {/* Top Border Animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>
                  </div>

                  <div className="relative p-5">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Availability Badge */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold border-2 uppercase tracking-wider flex items-center gap-1.5 shadow-lg bg-green-600 border-green-400 text-white">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-lg shadow-white/50"></div>
                            <span>AVAILABLE</span>
                          </span>
                        </div>
                        
                        {/* Donor Name */}
                        <h3 className="text-xl font-bold text-white mb-1.5 truncate">{donor.fullName || donor.name}</h3>
                        
                        {/* Age & Gender */}
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                          <span className="font-medium capitalize">{donor.age} yrs • {donor.gender}</span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <span>📍</span>
                          <span className="font-medium">{donor.city}, {donor.state}</span>
                        </div>
                      </div>

                      {/* Blood Group Badge - Enhanced 3D Design */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl p-4 min-w-[80px] shadow-2xl border-2 border-blue-400/50 transform group-hover:scale-110 transition-transform duration-300">
                          <div className="text-center">
                            <div className="text-4xl font-black leading-none drop-shadow-2xl mb-1">{donor.bloodGroup}</div>
                            <div className="text-[10px] font-bold opacity-90 tracking-widest uppercase">Donor</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Age */}
                      <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-blue-500/30 backdrop-blur-sm">
                        <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Age</div>
                        <div className="text-blue-400 font-black text-3xl leading-none">{donor.age}</div>
                      </div>

                      {/* Gender */}
                      <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-blue-500/30 backdrop-blur-sm">
                        <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Gender</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-blue-400 text-base">{donor.gender === 'male' ? '♂️' : donor.gender === 'female' ? '♀️' : '⚧'}</span>
                          <span className="text-blue-400 text-sm font-bold capitalize">{donor.gender}</span>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action Button */}
                    <a
                      href={`tel:${donor.phoneNumber || donor.phone}`}
                      className="group/btn relative overflow-hidden flex items-center justify-center gap-3 w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-center shadow-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-blue-900/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-700 ease-out"></div>
                      <span className="relative text-xl">📞</span>
                      <span className="relative text-sm tracking-wide">CALL NOW</span>
                      <span className="relative text-sm font-mono">{donor.phoneNumber || donor.phone}</span>
                    </a>
                  </div>
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
                    className="group relative overflow-hidden rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-blue-950/40 via-blue-900/30 to-blue-950/40 border-blue-500/50 shadow-xl shadow-blue-900/30 hover:shadow-blue-600/40"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-out"></div>

                    {/* Top Border Animation */}
                    <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>
                    </div>

                    <div className="relative p-5">
                      {/* Header Section */}
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Availability Badge */}
                          {donor.available && (
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="px-3 py-1.5 rounded-full text-xs font-bold border-2 uppercase tracking-wider flex items-center gap-1.5 shadow-lg bg-green-600 border-green-400 text-white">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-lg shadow-white/50"></div>
                                <span>AVAILABLE</span>
                              </span>
                            </div>
                          )}
                          
                          {/* Donor Name */}
                          <h3 className="text-xl font-bold text-white mb-1.5 truncate">{donor.fullName || donor.name}</h3>
                          
                          {/* Age & Gender */}
                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                            <span className="font-medium capitalize">{donor.age} yrs • {donor.gender}</span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <span>📍</span>
                            <span className="font-medium">{donor.city}, {donor.state}</span>
                          </div>
                        </div>

                        {/* Blood Group Badge - Enhanced 3D Design */}
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl p-4 min-w-[80px] shadow-2xl border-2 border-blue-400/50 transform group-hover:scale-110 transition-transform duration-300">
                            <div className="text-center">
                              <div className="text-4xl font-black leading-none drop-shadow-2xl mb-1">{donor.bloodGroup}</div>
                              <div className="text-[10px] font-bold opacity-90 tracking-widest uppercase">Donor</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Age */}
                        <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-blue-500/30 backdrop-blur-sm">
                          <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Age</div>
                          <div className="text-blue-400 font-black text-3xl leading-none">{donor.age}</div>
                        </div>

                        {/* Gender */}
                        <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-3 border border-blue-500/30 backdrop-blur-sm">
                          <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Gender</div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-blue-400 text-base">{donor.gender === 'male' ? '♂️' : donor.gender === 'female' ? '♀️' : '⚧'}</span>
                            <span className="text-blue-400 text-sm font-bold capitalize">{donor.gender}</span>
                          </div>
                        </div>
                      </div>

                      {/* Call to Action Button */}
                      <a
                        href={`tel:${donor.phoneNumber || donor.phone}`}
                        className="group/btn relative overflow-hidden flex items-center justify-center gap-3 w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-center shadow-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-blue-900/50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-700 ease-out"></div>
                        <span className="relative text-xl">📞</span>
                        <span className="relative text-sm tracking-wide">CALL NOW</span>
                        <span className="relative text-sm font-mono">{donor.phoneNumber || donor.phone}</span>
                      </a>
                    </div>
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