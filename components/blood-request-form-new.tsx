"use client"

import type React from "react"
import { useState } from "react"
import { getDbClient } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { INDIAN_STATES, CITIES_BY_STATE, BLOOD_GROUPS, BLOOD_REQUEST_REASONS } from "@/lib/types"

export default function BloodRequestFormNew() {
  const [receiverForm, setReceiverForm] = useState({
    patientName: "",
    bloodGroupNeeded: "",
    state: "West Bengal",
    city: "Kolkata",
    hospitalName: "",
    urgencyLevel: "normal",
    contactNumber: "",
    unitsNeeded: "1",
    reason: "",
  })

  const [receiverLoading, setReceiverLoading] = useState(false)
  const [receiverSuccess, setReceiverSuccess] = useState(false)

  const receiverCities = CITIES_BY_STATE[receiverForm.state] || []

  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setReceiverForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: CITIES_BY_STATE[value]?.[0] || "" }),
    }))
  }

  const handleReceiverSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setReceiverLoading(true)

    try {
      const db = getDbClient()
      if (!db) throw new Error("Firestore is not available in this environment")

      await addDoc(collection(db, "bloodRequests"), {
        name: receiverForm.patientName,
        phone: receiverForm.contactNumber,
        bloodGroup: receiverForm.bloodGroupNeeded,
        state: receiverForm.state,
        city: receiverForm.city,
        hospital: receiverForm.hospitalName,
        urgency: receiverForm.urgencyLevel,
        unitsNeeded: parseInt(receiverForm.unitsNeeded) || 1,
        description: receiverForm.reason || "Blood request posted",
        reason: receiverForm.reason,
        status: "open",
        createdAt: serverTimestamp(),
      })

      setReceiverSuccess(true)
      setReceiverForm({
        patientName: "",
        bloodGroupNeeded: "",
        state: "West Bengal",
        city: "Kolkata",
        hospitalName: "",
        urgencyLevel: "normal",
        contactNumber: "",
        unitsNeeded: "1",
        reason: "",
      })

      setTimeout(() => setReceiverSuccess(false), 3000)
    } catch (error) {
      console.error("Error adding blood request:", error)
    } finally {
      setReceiverLoading(false)
    }
  }

  return (
    <section className="pt-0 pb-16 px-4 bg-background">
      <style>{`
        @keyframes slideInForm {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes borderGlowRed {
          0%, 100% {
            box-shadow: 0 0 15px rgba(220, 38, 38, 0.2);
          }
          50% {
            box-shadow: 0 0 25px rgba(220, 38, 38, 0.4);
          }
        }
        .form-slide {
          animation: slideInForm 0.6s ease-out forwards;
        }
        .form-glow-red {
          animation: borderGlowRed 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Request Blood</h2>
          <p className="text-white text-lg">
            Post your blood request and connect with nearby donors who can help save a life.
          </p>
        </div>

        <div className="bg-card border-2 border-red-600/30 rounded-xl p-8 form-slide form-glow-red hover:border-red-600 transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl">
              🆘
            </div>
            <h3 className="text-3xl font-bold text-white">Need Blood</h3>
          </div>

          {receiverSuccess && (
            <div className="mb-4 bg-green-500/20 border border-green-500 text-green-400 p-3 rounded-lg text-sm">
              ✓ Your blood request has been posted successfully!
            </div>
          )}

          <form onSubmit={handleReceiverSubmit} className="space-y-4">
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={receiverForm.patientName}
              onChange={handleReceiverChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
              required
            />

            <select
              name="bloodGroupNeeded"
              value={receiverForm.bloodGroupNeeded}
              onChange={handleReceiverChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
              required
            >
              <option value="">Blood Group Needed</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="unitsNeeded"
                value={receiverForm.unitsNeeded}
                onChange={handleReceiverChange}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                required
              >
                <option value="">Units Needed</option>
                {Array.from({ length: 5 }, (_, i) => i + 1).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit} {unit === 1 ? 'Unit' : 'Units'}
                  </option>
                ))}
              </select>
              <select
                name="reason"
                value={receiverForm.reason}
                onChange={handleReceiverChange}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                required
              >
                <option value="">Select Reason</option>
                {BLOOD_REQUEST_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <select
              name="state"
              value={receiverForm.state}
              onChange={handleReceiverChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
              required
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              name="city"
              value={receiverForm.city}
              onChange={handleReceiverChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
              required
            >
              <option value="">Select City</option>
              {receiverCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="hospitalName"
              placeholder="Hospital Name"
              value={receiverForm.hospitalName}
              onChange={handleReceiverChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
              required
            />

            <select
              name="urgencyLevel"
              value={receiverForm.urgencyLevel}
              onChange={handleReceiverChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
              required
            >
              <option value="normal">✓ Normal</option>
              <option value="urgent">⚠️ Urgent</option>
              <option value="critical">🚨 Critical</option>
            </select>

            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number"
              value={receiverForm.contactNumber}
              onChange={handleReceiverChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
              required
            />

            <button
              type="submit"
              disabled={receiverLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {receiverLoading ? "Posting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}