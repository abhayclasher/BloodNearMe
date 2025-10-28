"use client"

import ProfileForm from "@/components/profile-form"

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground mb-8">Help us connect you with the right donors or receivers</p>

          <ProfileForm />
        </div>
      </div>
    </div>
  )
}
