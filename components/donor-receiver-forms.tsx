"use client"

import type React from "react"
import { useState } from "react"
import { getDbClient } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { INDIAN_STATES, CITIES_BY_STATE, BLOOD_GROUPS } from "@/lib/types"

export default function DonorReceiverForms() {
  const [donorForm, setDonorForm] = useState({
    fullName: "",
    age: "",
    bloodGroup: "",
    gender: "",
    state: "West Bengal",
    city: "Kolkata",
    pinCode: "",
    phoneNumber: "",
    dob: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
  })

  const [receiverForm, setReceiverForm] = useState({
    patientName: "",
    bloodGroupNeeded: "",
    state: "West Bengal",
    city: "Kolkata",
    hospitalName: "",
    urgencyLevel: "normal",
    contactNumber: "",
  })

  const [donorLoading, setDonorLoading] = useState(false)
  const [receiverLoading, setReceiverLoading] = useState(false)
  const [donorSuccess, setDonorSuccess] = useState(false)
  const [receiverSuccess, setReceiverSuccess] = useState(false)

  const donorCities = CITIES_BY_STATE[donorForm.state] || []
  const receiverCities = CITIES_BY_STATE[receiverForm.state] || []

  const handleDonorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setDonorForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
        ...(name === "state" && { city: CITIES_BY_STATE[value]?.[0] || "" }),
      }
      
      // Update dob when day/month/year changes
      if (name === "dobDay" || name === "dobMonth" || name === "dobYear") {
        const day = name === "dobDay" ? value : prev.dobDay
        const month = name === "dobMonth" ? value : prev.dobMonth
        const year = name === "dobYear" ? value : prev.dobYear
        
        if (day && month && year) {
          updated.dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
      }
      
      return updated
    })
  }

  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setReceiverForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: CITIES_BY_STATE[value]?.[0] || "" }),
    }))
  }

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDonorLoading(true)

    try {
      const db = getDbClient()
      if (!db) throw new Error("Firestore is not available in this environment")

      await addDoc(collection(db, "donors"), {
        ...donorForm,
        age: Number.parseInt(donorForm.age),
        available: true,
        createdAt: serverTimestamp(),
      })

      setDonorSuccess(true)
      setDonorForm({
        fullName: "",
        age: "",
        bloodGroup: "",
        gender: "",
        state: "West Bengal",
        city: "Kolkata",
        pinCode: "",
        phoneNumber: "",
        dob: "",
        dobDay: "",
        dobMonth: "",
        dobYear: "",
      })

      setTimeout(() => setDonorSuccess(false), 3000)
    } catch (error) {
      console.error("[v0] Error adding donor:", error)
    } finally {
      setDonorLoading(false)
    }
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
        unitsNeeded: 1,
        description: "Blood request posted",
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
      })

      setTimeout(() => setReceiverSuccess(false), 3000)
    } catch (error) {
      console.error("[v0] Error adding blood request:", error)
    } finally {
      setReceiverLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-background">
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
        @keyframes borderGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(220, 38, 38, 0.2);
          }
          50% {
            box-shadow: 0 0 25px rgba(220, 38, 38, 0.4);
          }
        }
        @keyframes borderGlueBlue {
          0%, 100% {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);
          }
        }
        .form-slide {
          animation: slideInForm 0.6s ease-out forwards;
        }
        .form-glow-red {
          animation: borderGlow 3s ease-in-out infinite;
        }
        .form-glow-blue {
          animation: borderGlueBlue 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Life-Saving Network</h2>
          <p className="text-gray-400 text-lg">
            Whether you want to donate blood or need blood, join our community and be part of India's lifeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donor Form */}
          <div className="bg-card border-2 border-red-600/30 rounded-xl p-8 form-slide form-glow-red hover:border-red-600 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl">
                ❤️
              </div>
              <h3 className="text-3xl font-bold text-white">Become a Donor</h3>
            </div>

            {donorSuccess && (
              <div className="mb-4 bg-green-500/20 border border-green-500 text-green-400 p-3 rounded-lg text-sm">
                ✓ Thank you! Your donor profile has been created.
              </div>
            )}

            <form onSubmit={handleDonorSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={donorForm.fullName}
                onChange={handleDonorChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={donorForm.age}
                  onChange={handleDonorChange}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
                  required
                />
                <select
                  name="bloodGroup"
                  value={donorForm.bloodGroup}
                  onChange={handleDonorChange}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Blood Group</option>
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <select
                name="gender"
                value={donorForm.gender}
                onChange={handleDonorChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                required
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <select
                name="state"
                value={donorForm.state}
                onChange={handleDonorChange}
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
                value={donorForm.city}
                onChange={handleDonorChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                required
              >
                <option value="">Select City</option>
                {donorCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="pinCode"
                  placeholder="Pin Code"
                  value={donorForm.pinCode}
                  onChange={handleDonorChange}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={donorForm.phoneNumber}
                  onChange={handleDonorChange}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <select
                  name="dobDay"
                  value={donorForm.dobDay}
                  onChange={handleDonorChange}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <select
                  name="dobMonth"
                  value={donorForm.dobMonth}
                  onChange={handleDonorChange}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Month</option>
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((month, index) => (
                    <option key={index + 1} value={index + 1}>{month}</option>
                  ))}
                </select>
                <select
                  name="dobYear"
                  value={donorForm.dobYear}
                  onChange={handleDonorChange}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 18 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={donorLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                {donorLoading ? "Registering..." : "Register as Donor"}
              </button>
            </form>
          </div>

          {/* Receiver Form */}
          <div
            className="bg-card border-2 border-blue-600/30 rounded-xl p-8 form-slide form-glow-blue hover:border-blue-600 transition-all duration-300"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                💧
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
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none transition-colors"
                required
              />

              <select
                name="bloodGroupNeeded"
                value={receiverForm.bloodGroupNeeded}
                onChange={handleReceiverChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none transition-colors"
                required
              >
                <option value="">Blood Group Needed</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>

              <select
                name="state"
                value={receiverForm.state}
                onChange={handleReceiverChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none transition-colors"
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
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none transition-colors"
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
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none transition-colors"
                required
              />

              <select
                name="urgencyLevel"
                value={receiverForm.urgencyLevel}
                onChange={handleReceiverChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none transition-colors"
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
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none transition-colors"
                required
              />

              <button
                type="submit"
                disabled={receiverLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                {receiverLoading ? "Posting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
