export default function AboutSection() {
  return (
    <section className="py-16 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-white">About BloodNearMe</h2>

        <p className="text-center text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
          Our mission is to bridge the gap between blood donors and receivers across India, creating a seamless network
          that saves lives every day.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: "👥",
              title: "Community Driven",
              description:
                "Built by the community, for the community. Every member plays a vital role in saving lives.",
            },
            {
              icon: "🛡️",
              title: "Verified & Safe",
              description: "Every donor and request is verified to ensure safety and reliability of our network.",
            },
            {
              icon: "⏰",
              title: "24/7 Available",
              description: "Emergency requests anytime, anywhere in India. We're always here when you need us.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-background border border-gray-700 rounded-lg p-8 text-center hover:border-red-600 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Partners Section */}
        <div className="bg-background border border-gray-700 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center text-white mb-8">Verified Blood Banks & NGOs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Indian Red Cross", "AIIMS Blood Bank", "Tata Memorial", "Rotary Blood Bank"].map((partner, i) => (
              <div
                key={i}
                className="border border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-all duration-300"
              >
                <div className="text-3xl mb-3">🏥</div>
                <p className="text-gray-300 font-semibold">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
