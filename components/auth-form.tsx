"use client"

import type React from "react"

import { useState } from "react"
import { auth, db } from "@/lib/firebase"
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

interface AuthFormProps {
  mode: "login" | "signup"
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      })
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      setupRecaptcha()
      /* Fixed phone number formatting for Indian numbers */
      const formattedPhone = `+91${phone.replace(/\D/g, "").slice(-10)}`
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier)
      setConfirmationResult(result)
      setStep("otp")
    } catch (err: any) {
      console.log("[v0] Phone auth error:", err)
      setError(err.message || "Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await confirmationResult.confirm(otp)

      // Check if user exists
      const userDoc = await getDoc(doc(db, "users", result.user.uid))

      if (userDoc.exists()) {
        router.push("/dashboard")
      } else {
        setStep("profile")
      }
    } catch (err: any) {
      console.log("[v0] OTP verification error:", err)
      setError("Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setError("")
    setLoading(true)

    try {
      /* Fixed social auth provider initialization */
      let authProvider
      if (provider === "google") {
        authProvider = new GoogleAuthProvider()
        authProvider.addScope("profile")
        authProvider.addScope("email")
      } else {
        authProvider = new FacebookAuthProvider()
        authProvider.addScope("email")
      }

      const result = await signInWithPopup(auth, authProvider)

      const userDoc = await getDoc(doc(db, "users", result.user.uid))

      if (userDoc.exists()) {
        router.push("/dashboard")
      } else {
        setStep("profile")
      }
    } catch (err: any) {
      console.log("[v0] Social auth error:", err)
      setError(err.message || `${provider} login failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {step === "phone" && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-card border border-border rounded-lg">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit number"
                className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading || phone.length !== 10}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-light disabled:opacity-50 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-card transition disabled:opacity-50"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-card transition disabled:opacity-50"
            >
              <span>Facebook</span>
            </button>
          </div>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <p className="text-sm text-muted-foreground mb-4">Sent to +91{phone}</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-center text-2xl tracking-widest"
              required
            />
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-light disabled:opacity-50 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button type="button" onClick={() => setStep("phone")} className="w-full text-primary hover:underline">
            Change phone number
          </button>
        </form>
      )}

      <div id="recaptcha-container"></div>
    </div>
  )
}
