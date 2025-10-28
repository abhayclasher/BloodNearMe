"use client"

import Link from "next/link"

export default function DashboardPage() {

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Find Blood Donors</h3>
          <p className="text-muted-foreground mb-4">Search for blood donors in your area</p>
          <Link
            href="/find"
            className="block w-full bg-primary text-white px-4 py-2 rounded-lg text-center hover:bg-primary-light transition"
          >
            Find Donors
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Request Blood</h3>
          <p className="text-muted-foreground mb-4">Post a blood request for urgent needs</p>
          <Link
            href="/request"
            className="block w-full border border-primary text-primary px-4 py-2 rounded-lg text-center hover:bg-primary hover:text-white transition"
          >
            Request Blood
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Recent Requests</h3>
        <p className="text-muted-foreground">View recent blood requests in your area</p>
      </div>
    </div>
  )
}
