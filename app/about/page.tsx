import AboutSection from "@/components/about-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8 text-white">About BloodNearMe</h1>
          <p className="text-center text-gray-300 text-lg mb-12">
            Connecting blood donors and receivers across India to save lives every day.
          </p>
        </div>
      </section>
      <AboutSection />
    </div>
  )
}
