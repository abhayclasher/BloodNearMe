"use client"

import { useState, useEffect } from "react"

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-card via-background to-card/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="inline-block mb-4 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-sm font-medium">
            💡 Our Story
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-red-300 to-white bg-clip-text text-transparent">
            About BloodNearMe
          </h2>
          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between blood donors and receivers across India, creating a seamless network that saves lives every day.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <div className="slide-in-left bg-gradient-to-br from-red-900/20 to-red-800/5 border-2 border-red-600/30 rounded-2xl p-8 hover:border-red-600/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20 group">
            <div className="text-6xl mb-6 float-animation">🎯</div>
            <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors">Our Mission</h3>
            <p className="text-white text-lg leading-relaxed">
              To create a robust, accessible platform that connects blood donors with those in need, ensuring no life is lost due to blood shortage. We believe every drop counts and every second matters.
            </p>
          </div>

          {/* Vision Card */}
          <div className="slide-in-right bg-gradient-to-br from-blue-900/20 to-blue-800/5 border-2 border-blue-600/30 rounded-2xl p-8 hover:border-blue-600/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/20 group" style={{ animationDelay: '0.2s' }}>
            <div className="text-6xl mb-6 float-animation" style={{ animationDelay: '0.5s' }}>🌟</div>
            <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">Our Vision</h3>
            <p className="text-white text-lg leading-relaxed">
              To build India's largest community-driven blood donation network, making blood available to everyone, everywhere, anytime. A future where blood shortage is history.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: "👥",
              title: "Community Driven",
              description: "Built by the community, for the community. Every member plays a vital role in saving lives.",
              color: "from-purple-600/10 to-purple-800/5",
              border: "border-purple-600/30",
              hover: "hover:border-purple-600/60 hover:shadow-purple-600/20",
              delay: "0s"
            },
            {
              icon: "🛡️",
              title: "Verified & Safe",
              description: "Every donor and request is verified to ensure safety and reliability of our network.",
              color: "from-green-600/10 to-green-800/5",
              border: "border-green-600/30",
              hover: "hover:border-green-600/60 hover:shadow-green-600/20",
              delay: "0.1s"
            },
            {
              icon: "⏰",
              title: "24/7 Available",
              description: "Emergency requests anytime, anywhere in India. We're always here when you need us.",
              color: "from-orange-600/10 to-orange-800/5",
              border: "border-orange-600/30",
              hover: "hover:border-orange-600/60 hover:shadow-orange-600/20",
              delay: "0.2s"
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`scale-in bg-gradient-to-br ${feature.color} border-2 ${feature.border} rounded-2xl p-8 text-center ${feature.hover} transition-all duration-500 hover:scale-105 hover:shadow-2xl group`}
              style={{ animationDelay: feature.delay }}
            >
              <div className="text-6xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Creator Section */}
        <div className="fade-in-up mb-16" style={{ animationDelay: '0.4s' }}>
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 border-2 border-gray-700/50 rounded-3xl p-8 md:p-12 hover:border-red-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar with Image */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-blue-600/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white/10 bg-gray-800">
                  <img 
                    src="/me.jpg" 
                    alt="Abhay Kumar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block mb-3 px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-sm font-semibold">
                  👨‍💻 Creator & Developer
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Abhay Kumar
                </h3>
                <p className="text-white text-lg mb-4 leading-relaxed">
                  Full Stack Web Developer from Kolkata, India
                </p>
                <p className="text-white mb-6 leading-relaxed">
                  A passionate 21-year-old developer dedicated to leveraging technology for social impact. 
                  Created BloodNearMe to address the critical issue of blood shortage in India through an 
                  innovative community-driven platform that connects donors with those in urgent need, 
                  making every drop count in saving precious lives.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-3">
                    <div className="text-2xl font-bold text-red-500">21</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Age</div>
                  </div>
                  <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-3">
                    <div className="text-2xl font-bold text-blue-500">🏙️</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Kolkata</div>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    href="https://abhaypro.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-600/50"
                  >
                    <span>🌐</span>
                    <span>Website</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/abhay-kumar-5216b7319/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-600/50"
                  >
                    <span>💼</span>
                    <span>LinkedIn</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="mailto:abhaypro.cloud@gmail.com"
                    className="group inline-flex items-center gap-2 border-2 border-gray-600 hover:border-red-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-red-600/10"
                  >
                    <span>📧</span>
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="fade-in-up mb-16" style={{ animationDelay: '0.6s' }}>
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border-2 border-gray-700/50 rounded-2xl p-8 md:p-12 hover:border-gray-600/60 transition-all duration-500">
            <h3 className="text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-3">
              <span className="text-4xl">🏥</span>
              Verified Blood Banks & NGOs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Indian Red Cross", icon: "❤️" },
                { name: "AIIMS Blood Bank", icon: "🏥" },
                { name: "Tata Memorial", icon: "🩺" },
                { name: "Rotary Blood Bank", icon: "🔴" }
              ].map((partner, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-gray-700/50 rounded-xl p-6 text-center hover:border-red-600/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-600/10 group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{partner.icon}</div>
                  <p className="text-white font-semibold">{partner.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inspirational Quotes */}
        <div className="fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Words That Inspire</h3>
            <p className="text-gray-400">Quotes that remind us why every donation matters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-600/30 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-500 hover:scale-105 group">
              <div className="text-4xl mb-4 opacity-50 text-red-400">"</div>
              <p className="text-white text-lg italic mb-4 leading-relaxed">
                The blood you donate gives someone another chance at life. One day that someone may be a close relative, a friend, a loved one—or even you.
              </p>
              <div className="text-red-400 font-semibold">— Anonymous</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-2 border-blue-600/30 rounded-2xl p-8 hover:border-blue-600/50 transition-all duration-500 hover:scale-105 group">
              <div className="text-4xl mb-4 opacity-50 text-blue-400">"</div>
              <p className="text-white text-lg italic mb-4 leading-relaxed">
                Every two seconds someone needs blood. Your donation can make a difference between life and death.
              </p>
              <div className="text-blue-400 font-semibold">— Red Cross</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
