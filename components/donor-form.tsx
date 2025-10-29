"use client"

import type React from "react"
import { useState } from "react"
import { getDbClient } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { INDIAN_STATES, CITIES_BY_STATE, BLOOD_GROUPS } from "@/lib/types"

export default function DonorForm() {
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

  const [donorLoading, setDonorLoading] = useState(false)
  const [donorSuccess, setDonorSuccess] = useState(false)

  const donorCities = CITIES_BY_STATE[donorForm.state] || []

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
      console.error("Error adding donor:", error)
    } finally {
      setDonorLoading(false)
    }
  }

  return (
    <section className="pt-0 pb-12 px-4 bg-gradient-to-b from-background via-card/20 to-background">
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
        @keyframes borderGlowBlue {
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
        .form-glow-blue {
          animation: borderGlowBlue 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-950/40 via-green-900/30 to-green-950/40 border-b border-green-900/30 -mx-4 px-4 mb-6">
        <div className="max-w-7xl mx-auto py-8">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-green-600/10 border border-green-600/20 rounded-full text-green-500 text-sm font-medium">
              🫂 Be a Hero
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent">
              Become a Life Saver
            </h2>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
              Join our community of blood donors and help save lives across India. Your donation can make all the difference.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-card/90 via-card/80 to-card/90 backdrop-blur-sm border-2 border-blue-600/30 rounded-2xl p-8 md:p-10 form-slide form-glow-blue hover:border-blue-600 transition-all duration-300 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
              🩸
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">Donor Registration</h3>
              <p className="text-gray-400 text-sm">Fill in your details to join</p>
            </div>
          </div>

          {donorSuccess && (
            <div className="mb-6 bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-500 text-green-400 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 shadow-lg">
              <span className="text-2xl">✅</span>
              <span>Thank you! Your donor profile has been created successfully.</span>
            </div>
          )}

          <form onSubmit={handleDonorSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={donorForm.fullName}
              onChange={handleDonorChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none transition-colors"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={donorForm.age}
                onChange={handleDonorChange}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none transition-colors"
                required
              />
              <select
                name="bloodGroup"
                value={donorForm.bloodGroup}
                onChange={handleDonorChange}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none transition-colors"
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
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none transition-colors"
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={donorForm.phoneNumber}
                onChange={handleDonorChange}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <select
                name="dobDay"
                value={donorForm.dobDay}
                onChange={handleDonorChange}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none transition-colors"
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
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none transition-colors"
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
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none transition-colors"
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
              className="group w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-2xl hover:shadow-blue-600/50 flex items-center justify-center gap-3"
            >
              {donorLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🩸</span>
                  <span>Register as Donor</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}