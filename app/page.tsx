"use client";

import Link from "next/link"
import { useState } from "react"
import UrgentRequests from "@/components/urgent-requests"
import AboutSection from "@/components/about-section"
import DonorReceiverForms from "@/components/donor-receiver-forms"

function JoinNetworkSection() {
  const [activeTab, setActiveTab] = useState<"donor" | "receiver">("donor");

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-card/50 via-background to-red-950/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-sm font-medium">
            🤝 Join Us Today
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Join Our Life-Saving Network
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Whether you want to donate blood or need it urgently, we're here to connect you
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-card/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-800">
            <button
              onClick={() => setActiveTab("donor")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "donor"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🩸 I Want to Donate
            </button>
            <button
              onClick={() => setActiveTab("receiver")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "receiver"
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🆘 I Need Blood
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          {/* Donor Tab */}
          {activeTab === "donor" && (
            <div className="animate-fadeInUp">
              <div className="bg-gradient-to-br from-blue-900/10 to-cyan-800/5 border border-blue-800/30 rounded-3xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-5xl mb-6">🩸</div>
                    <h3 className="text-3xl font-bold mb-4 text-white">Become a Blood Donor</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      One donation can save up to three lives. Join thousands of heroes who donate blood regularly and make a real difference in your community.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        "Quick 5-minute registration",
                        "Get notified for urgent requests nearby",
                        "Track your donation history",
                        "Join a community of life-savers",
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-300">
                          <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/donor"
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-blue-600/50 hover:scale-105"
                    >
                      <span>Register as Donor</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-2xl"></div>
                      <div className="relative bg-card/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                            <div className="text-3xl">✅</div>
                            <div>
                              <div className="font-semibold text-white">Eligibility Check</div>
                              <div className="text-sm text-gray-400">Age 18-65, weight 50kg+</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-cyan-900/20 rounded-xl border border-cyan-700/30">
                            <div className="text-3xl">📱</div>
                            <div>
                              <div className="font-semibold text-white">Instant Notifications</div>
                              <div className="text-sm text-gray-400">Get alerted for nearby requests</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                            <div className="text-3xl">🏆</div>
                            <div>
                              <div className="font-semibold text-white">Impact Tracking</div>
                              <div className="text-sm text-gray-400">See lives you've helped save</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Receiver Tab */}
          {activeTab === "receiver" && (
            <div className="animate-fadeInUp">
              <div className="bg-gradient-to-br from-red-900/10 to-orange-800/5 border border-red-800/30 rounded-3xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-5xl mb-6">🆘</div>
                    <h3 className="text-3xl font-bold mb-4 text-white">Request Blood Urgently</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      In urgent need of blood? Post your requirement and connect with verified donors in your area instantly. Help is just a click away.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        "Post requests in under 2 minutes",
                        "Reach thousands of donors instantly",
                        "Get direct contact details",
                        "Track request status in real-time",
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-300">
                          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/request"
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-red-600/50 hover:scale-105"
                    >
                      <span>Post Blood Request</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur-2xl"></div>
                      <div className="relative bg-card/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 bg-red-900/20 rounded-xl border border-red-700/30">
                            <div className="text-3xl">⚡</div>
                            <div>
                              <div className="font-semibold text-white">Instant Posting</div>
                              <div className="text-sm text-gray-400">Request goes live immediately</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-orange-900/20 rounded-xl border border-orange-700/30">
                            <div className="text-3xl">🔍</div>
                            <div>
                              <div className="font-semibold text-white">Smart Matching</div>
                              <div className="text-sm text-gray-400">Find matching donors nearby</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-red-900/20 rounded-xl border border-red-700/30">
                            <div className="text-3xl">💬</div>
                            <div>
                              <div className="font-semibold text-white">Direct Contact</div>
                              <div className="text-sm text-gray-400">No intermediaries, call directly</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-950/20 via-card to-background py-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-sm font-medium">
            🩸 Connecting Lives Since 2025
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent">
            Save Lives,<br />
            <span className="text-primary">Connect Blood Donors</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 text-balance max-w-3xl mx-auto leading-relaxed">
            Join India's fastest-growing blood donation network. Find verified donors instantly or post urgent requests — all in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/find"
              className="group relative bg-primary text-white px-10 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-600/50 hover:scale-105 inline-flex items-center gap-2"
            >
              <span>🔍 Find Donors</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/request"
              className="group border-2 border-red-600 text-red-500 px-10 py-4 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <span>🆘 Request Blood</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Donors</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Real-time Updates</span>
            </div>
          </div>
        </div>
      </section>

      <UrgentRequests />

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">How It Works</h2>
            <p className="text-gray-500 text-lg">Three simple steps to save a life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Find Donors",
                description: "Search verified blood donors in your city by blood group. Browse without signup.",
                icon: "🔍",
                gradient: "from-blue-600/10 to-cyan-600/10",
                border: "border-blue-600/20",
                iconBg: "bg-blue-600/10",
              },
              {
                title: "Request Blood",
                description: "Post urgent blood requests with your details. Reach thousands of donors instantly.",
                icon: "🆘",
                gradient: "from-red-600/10 to-orange-600/10",
                border: "border-red-600/20",
                iconBg: "bg-red-600/10",
              },
              {
                title: "Connect Directly",
                description: "Get instant contact details. One call can save a life. No middlemen involved.",
                icon: "📞",
                gradient: "from-green-600/10 to-emerald-600/10",
                border: "border-green-600/20",
                iconBg: "bg-green-600/10",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`group relative bg-gradient-to-br ${feature.gradient} p-8 rounded-2xl border ${feature.border} hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/10`}
              >
                <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JoinNetworkSection />

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-950/30 via-card to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-500 text-lg">Making a difference, one donation at a time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Donors", value: "5000+", icon: "👥", color: "text-blue-500" },
              { label: "Blood Requests", value: "1200+", icon: "📋", color: "text-orange-500" },
              { label: "Lives Saved", value: "8500+", icon: "❤️", color: "text-red-500" },
              { label: "Cities Covered", value: "50+", icon: "🏙️", color: "text-green-500" },
            ].map((stat, i) => (
              <div key={i} className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{stat.icon}</div>
                <div className={`text-5xl md:text-6xl font-bold ${stat.color} mb-3 group-hover:text-primary transition-colors`}>
                  {stat.value}
                </div>
                <p className="text-gray-400 font-medium text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DonorReceiverForms />

      <AboutSection />

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
            ❤️ Join the Movement
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Every Drop Counts</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
            Be part of India's most trusted blood donation community. Together, we can save countless lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find"
              className="group bg-white text-red-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <span>Find Donors Now</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/donor"
              className="group border-2 border-white text-white px-10 py-4 rounded-xl font-semibold hover:bg-white hover:text-red-600 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <span>Become a Donor</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
