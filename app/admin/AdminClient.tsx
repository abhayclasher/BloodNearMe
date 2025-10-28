"use client"

import type React from "react"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import type { BloodRequest, DonorProfile } from "@/lib/types"
import Link from "next/link"

export default function AdminClient() {
  const [adminPassword, setAdminPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [donors, setDonors] = useState<DonorProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "requests" | "donors" | "analytics">("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "fulfilled">("all")
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>("all")
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalDonors: 0,
    openRequests: 0,
    availableDonors: 0,
    criticalRequests: 0,
    recentRequests: 0
  })

  const ADMIN_PASSWORD = "admin123"

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      fetchData()
    } else {
      alert("Invalid password")
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch requests
      const requestsSnapshot = await getDocs(collection(db, "bloodRequests"))
      const requestsList: BloodRequest[] = []
      requestsSnapshot.forEach((doc) => {
        const data = doc.data()
        requestsList.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          status: data.status || 'open', // Default to 'open' if status is missing
        } as BloodRequest)
      })
      setRequests(requestsList)

      // Fetch donors
      const donorsSnapshot = await getDocs(collection(db, "donors"))
      const donorsList: DonorProfile[] = []
      donorsSnapshot.forEach((doc) => {
        const data = doc.data()
        donorsList.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        } as DonorProfile)
      })
      setDonors(donorsList)
      
      // Calculate stats
      const openRequests = requestsList.filter(r => r.status === 'open').length
      const availableDonors = donorsList.filter(d => d.available).length
      const criticalRequests = requestsList.filter(r => r.urgency === 'high').length
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 1)
      const recentRequests = requestsList.filter(r => r.createdAt > dayAgo).length
      
      setStats({
        totalRequests: requestsList.length,
        totalDonors: donorsList.length,
        openRequests,
        availableDonors,
        criticalRequests,
        recentRequests
      })
    } catch (error) {
      console.log("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteRequest = async (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteDoc(doc(db, "bloodRequests", id))
        setRequests(requests.filter((r) => r.id !== id))
      } catch (error) {
        console.log("Error deleting request:", error)
      }
    }
  }

  const deleteDonor = async (id: string) => {
    if (confirm("Are you sure you want to delete this donor?")) {
      try {
        await deleteDoc(doc(db, "donors", id))
        setDonors(donors.filter((d) => d.id !== id))
      } catch (error) {
        console.log("Error deleting donor:", error)
      }
    }
  }

  const updateRequestStatus = async (id: string, status: "open" | "fulfilled") => {
    try {
      await updateDoc(doc(db, "bloodRequests", id), { status })
      const updatedRequests = requests.map((r) => (r.id === id ? { ...r, status } : r))
      setRequests(updatedRequests)
      
      // Recalculate stats
      const openRequests = updatedRequests.filter(r => r.status === 'open').length
      const criticalRequests = updatedRequests.filter(r => r.urgency === 'high').length
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 1)
      const recentRequests = updatedRequests.filter(r => r.createdAt > dayAgo).length
      
      setStats(prev => ({
        ...prev,
        openRequests,
        criticalRequests,
        recentRequests
      }))
    } catch (error) {
      console.log("Error updating request:", error)
    }
  }

  const exportCSV = (data: any[], filename: string, headers: string[]) => {
    const csv = data.map(item => headers.map(h => item[h] || '').join(',')).join('\n')
    const blob = new Blob([headers.join(',') + '\n' + csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-light transition"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesBloodGroup = filterBloodGroup === 'all' || request.bloodGroup === filterBloodGroup
    return matchesSearch && matchesStatus && matchesBloodGroup
  })

  const filteredDonors = donors.filter(donor => {
    const name = donor.name || donor.fullName || ''
    const phone = donor.phone || donor.phoneNumber || ''
    const matchesSearch = searchTerm === '' || 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    const matchesBloodGroup = filterBloodGroup === 'all' || donor.bloodGroup === filterBloodGroup
    return matchesSearch && matchesBloodGroup
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">🩸 Admin Dashboard</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "dashboard" ? "bg-primary text-white" : "bg-card border border-border hover:border-primary"
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "requests" ? "bg-primary text-white" : "bg-card border border-border hover:border-primary"
          }`}
        >
          🩸 Blood Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab("donors")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "donors" ? "bg-primary text-white" : "bg-card border border-border hover:border-primary"
          }`}
        >
          👥 Donors ({donors.length})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "analytics" ? "bg-primary text-white" : "bg-card border border-border hover:border-primary"
          }`}
        >
          📈 Analytics
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      ) : activeTab === "dashboard" ? (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-3xl font-bold">{stats.totalRequests}</p>
                </div>
                <div className="text-4xl">🩸</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Donors</p>
                  <p className="text-3xl font-bold">{stats.totalDonors}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Requests</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.openRequests}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Donors</p>
                  <p className="text-3xl font-bold text-green-600">{stats.availableDonors}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Requests</p>
                  <p className="text-3xl font-bold text-red-600">{stats.criticalRequests}</p>
                </div>
                <div className="text-4xl">🚨</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recent (24h)</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.recentRequests}</p>
                </div>
                <div className="text-4xl">🕒</div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Recent Blood Requests</h3>
            <div className="space-y-3">
              {requests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {request.bloodGroup}
                    </div>
                    <div>
                      <p className="font-semibold">{request.name}</p>
                      <p className="text-sm text-muted-foreground">{request.city}, {request.state}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      request.urgency === 'high' ? 'text-red-600' : 
                      request.urgency === 'medium' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {request.urgency.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">{request.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "analytics" ? (
        <div className="space-y-8">
          {/* Blood Group Distribution */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Blood Group Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(group => {
                const count = requests.filter(r => r.bloodGroup === group).length
                const donorCount = donors.filter(d => d.bloodGroup === group).length
                return (
                  <div key={group} className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{group}</div>
                    <div className="text-sm text-muted-foreground">Requests: {count}</div>
                    <div className="text-sm text-muted-foreground">Donors: {donorCount}</div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* State-wise Data */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">State-wise Statistics</h3>
            <div className="space-y-3">
              {['West Bengal', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'].map(state => {
                const requestCount = requests.filter(r => r.state === state).length
                const donorCount = donors.filter(d => d.state === state).length
                return (
                  <div key={state} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="font-semibold">{state}</div>
                    <div className="flex gap-4 text-sm">
                      <span>Requests: <span className="font-bold">{requestCount}</span></span>
                      <span>Donors: <span className="font-bold">{donorCount}</span></span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : activeTab === "requests" ? (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search by name, hospital, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-64 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="all">All Blood Groups</option>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              <button
                onClick={() => exportCSV(requests, 'blood-requests.csv', ['name', 'phone', 'bloodGroup', 'city', 'state', 'urgency', 'status'])}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                📥 Export CSV
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <p className="text-muted-foreground">No blood requests found.</p>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{request.name}</h3>
                      <p className="text-gray-400">{request.hospital}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {request.bloodGroup}
                      </span>
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {request.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="font-semibold">{request.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="font-semibold">
                        {request.city}, {request.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Units</p>
                      <p className="font-semibold">{request.unitsNeeded}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <select
                        value={request.status}
                        onChange={(e) => updateRequestStatus(request.id, e.target.value as "open" | "fulfilled")}
                        className="bg-background border border-border rounded px-2 py-1 text-sm"
                      >
                        <option value="open">Open</option>
                        <option value="fulfilled">Fulfilled</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{request.description}</p>

                  <button
                    onClick={() => deleteRequest(request.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search and Export */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search by name, phone, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-64 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="all">All Blood Groups</option>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              <button
                onClick={() => exportCSV(donors, 'donors.csv', ['name', 'phone', 'bloodGroup', 'city', 'state', 'age', 'gender', 'available'])}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                📥 Export CSV
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredDonors.length === 0 ? (
              <p className="text-muted-foreground">No donors found.</p>
            ) : (
              filteredDonors.map((donor) => (
                <div key={donor.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{donor.name || donor.fullName}</h3>
                      <p className="text-gray-400">{donor.age} years old</p>
                    </div>
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {donor.bloodGroup}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="font-semibold">{donor.phone || donor.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="font-semibold">
                        {donor.city}, {donor.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Gender</p>
                      <p className="font-semibold capitalize">{donor.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Available</p>
                      <p className="font-semibold">{donor.available ? "Yes" : "No"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDonor(donor.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
