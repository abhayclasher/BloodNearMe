import Link from "next/link"
import UrgentRequests from "@/components/urgent-requests"
import AboutSection from "@/components/about-section"
import DonorReceiverForms from "@/components/donor-receiver-forms"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-card to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Save Lives, <span className="text-primary">Connect Blood</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            BloodNearMe connects blood donors and receivers across India. Find donors in your city or request blood when
            you need it most. No registration required to browse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-light transition"
            >
              Find Donors
            </Link>
            <Link
              href="/request"
              className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
            >
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      <UrgentRequests />

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Find Donors",
                description: "Browse available donors in your city by blood group. No signup needed to search.",
                icon: "🔍",
              },
              {
                title: "Request Blood",
                description:
                  "Post a blood request with your details. Your request appears on our homepage and request page.",
                icon: "🆘",
              },
              {
                title: "Connect Directly",
                description: "Get direct phone numbers to call donors or receivers. Save lives with a single call.",
                icon: "📞",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card p-8 rounded-lg border border-border hover:border-primary transition transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Active Donors", value: "5000+" },
              { label: "Blood Requests", value: "1200+" },
              { label: "Lives Saved", value: "8500+" },
              { label: "Cities Covered", value: "50+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DonorReceiverForms />

      <AboutSection />

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Every Drop Counts</h2>
          <p className="text-lg mb-8 opacity-90">
            Join our community of donors and receivers saving lives across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition inline-block"
            >
              Find Donors Now
            </Link>
            <Link
              href="/request"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition inline-block"
            >
              Request Blood
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
