"use client"

import type { User } from "@/lib/types"

interface DonorCardProps {
  donor: User
}

export default function DonorCard({ donor }: DonorCardProps) {
  const whatsappLink = `https://wa.me/91${donor.phone.replace(/\D/g, "")}?text=Hi%20${donor.name}%2C%20I%20need%20blood%20donation.`
  const phoneLink = `tel:+91${donor.phone.replace(/\D/g, "")}`

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{donor.name}</h3>
          <p className="text-sm text-muted-foreground">
            {donor.city}, {donor.state}
          </p>
        </div>
        <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">{donor.bloodGroup}</div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p>
          <span className="text-muted-foreground">Age:</span> <span className="font-medium">{donor.age}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Gender:</span>{" "}
          <span className="font-medium capitalize">{donor.gender}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <a
          href={phoneLink}
          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-center text-sm font-semibold hover:bg-primary-light transition"
        >
          Call
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border border-primary text-primary px-4 py-2 rounded-lg text-center text-sm font-semibold hover:bg-primary hover:text-white transition"
        >
          WhatsApp
        </a>
      </div>
    </div>
  )
}
