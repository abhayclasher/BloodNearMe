"use client"

import type React from "react"
import { useState } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { BLOOD_GROUPS, INDIAN_STATES, CITIES_BY_STATE } from "@/lib/types"

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",
    bloodGroup: "O+",
    state: "Maharashtra",
    city: "Mumbai",
    role: "donor",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const cities = CITIES_BY_STATE[formData.state] || []

  // Ensure city is valid when state changes
  if (formData.city && !cities.includes(formData.city)) {
    setFormData(prev => ({ ...prev, city: cities[0] || "" }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: (CITIES_BY_STATE[value] || [])[0] || "" }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validate form data
    if (!formData.name.trim()) {
      setError("Name is required")
      setLoading(false)
      return
    }
    if (!formData.age || Number.parseInt(formData.age) < 18) {
      setError("Age must be 18 or above")
      setLoading(false)
      return
    }
    if (!formData.city) {
      setError("Please select a valid city")
      setLoading(false)
      return
    }

    try {
      const user = auth.currentUser
      if (!user) throw new Error("User not authenticated")

      const userData = {
        id: user.uid,
        name: formData.name,
        email: user.email || "",
        phone: user.phoneNumber || "",
        age: Number.parseInt(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        state: formData.state,
        city: formData.city,
        role: formData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, "users", user.uid), userData)

      if (formData.role === "donor") {
        await setDoc(doc(db, "donors", user.uid), {
          userId: user.uid,
          available: true,
          lastDonationDate: null,
          createdAt: new Date(),
        })
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="18"
            min="18"
            max="120"
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
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
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
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
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-4">I want to</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="donor"
              checked={formData.role === "donor"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Donate Blood</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="receiver"
              checked={formData.role === "receiver"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Receive Blood</span>
          </label>
        </div>
      </div>

      {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-light disabled:opacity-50 transition"
      >
        {loading ? "Saving..." : "Complete Profile"}
      </button>
    </form>
  )
}
