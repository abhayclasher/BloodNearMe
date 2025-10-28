"use client"

import type React from "react"
import { useState } from "react"
import { getDbClient } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { BLOOD_GROUPS, INDIAN_STATES, CITIES_BY_STATE } from "@/lib/types"

export default function BloodRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    bloodGroup: "O+",
    state: "Maharashtra",
    city: "Mumbai",
    hospital: "",
    urgency: "normal",
    unitsNeeded: 1,
    description: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const cities = CITIES_BY_STATE[formData.state] || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: CITIES_BY_STATE[value]?.[0] || "" }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const requestData = {
        name: formData.name,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        state: formData.state,
        city: formData.city,
        hospital: formData.hospital,
        urgency: formData.urgency,
        unitsNeeded: Number.parseInt(formData.unitsNeeded.toString()),
        description: formData.description,
        status: "open",
        createdAt: serverTimestamp(),
      }

  const db = getDbClient()
  if (!db) throw new Error("Firestore is not available in this environment")

  await addDoc(collection(db, "bloodRequests"), requestData)

      setSuccess(true)
      setFormData({
        name: "",
        phone: "",
        dob: "",
        bloodGroup: "O+",
        state: "Maharashtra",
        city: "Mumbai",
        hospital: "",
        urgency: "normal",
        unitsNeeded: 1,
        description: "",
      })

      setTimeout(() => {
        router.push("/requests")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to create request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg">
          ✓ Request posted successfully! Redirecting to requests page...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Blood Group Needed</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Urgency Level</label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="normal">✓ Normal</option>
            <option value="urgent">⚠️ Urgent</option>
            <option value="critical">🚨 Critical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
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
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Hospital Name</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            placeholder="Enter hospital name"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Units Needed</label>
          <input
            type="number"
            name="unitsNeeded"
            value={formData.unitsNeeded}
            onChange={handleChange}
            min="1"
            max="10"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Why do you need blood? Any medical details..."
          rows={4}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
          required
        />
      </div>

      {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-light disabled:opacity-50 transition"
      >
        {loading ? "Posting Request..." : "Post Blood Request"}
      </button>
    </form>
  )
}
