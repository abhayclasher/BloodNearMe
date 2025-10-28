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
          <p className="text-gray-400 text-lg">
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
              <p className="text-gray-400">Loading active donors...</p>
            </div>
          ) : activeDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDonors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="bg-card border border-gray-700 rounded-lg p-6 hover:border-red-600 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{donor.fullName || donor.name}</h3>
                      <p className="text-gray-400 text-sm">{donor.age} years old • {donor.gender}</p>
                    </div>
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      {donor.city}, {donor.state}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-green-400">Available to donate</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${donor.phoneNumber || donor.phone}`}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center block"
                  >
                    📞 Call: {donor.phoneNumber || donor.phone}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-gray-400">No active donors available at the moment.</p>
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
                    className="bg-card border border-gray-700 rounded-lg p-6 hover:border-red-600 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{donor.fullName || donor.name}</h3>
                        <p className="text-gray-400 text-sm">{donor.age} years old • {donor.gender}</p>
                      </div>
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {donor.bloodGroup}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📍</span>
                        {donor.city}, {donor.state}
                      </div>
                      {donor.available && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-green-400">Available to donate</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={`tel:${donor.phoneNumber || donor.phone}`}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center block"
                    >
                      📞 Call: {donor.phoneNumber || donor.phone}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No donors found matching your criteria.</p>
                <p className="text-sm text-gray-500">Try searching in a different city or blood group.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}