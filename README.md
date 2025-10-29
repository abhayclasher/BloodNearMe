<h1 align="center">🩸 BloodNearMe</h1>

<p align="center">
  <strong>Connecting Blood Donors & Recipients Instantly — Save Lives, One Drop at a Time</strong>
</p>

<p align="center">
  <a href="https://blood-near-me.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌍_Live_Site-blood--near--me.vercel.app-FF4747?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Site" />
  </a>
  <img src="https://img.shields.io/badge/License-BloodNearMe%20Community-red?style=for-the-badge&logo=heart&logoColor=white" alt="License" />
  <img src="https://img.shields.io/badge/Built_with-Next.js_16-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Database-Firebase-orange?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Pages & Previews](#-pages--previews)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Credits](#️-credits)

---

## ✨ Overview

BloodNearMe is a **community-driven, open-source platform** designed to bridge the critical gap between blood donors and those in urgent need across India. Built with modern web technologies, the platform enables instant connections without the friction of sign-ups or lengthy verification processes.

### 🎯 Key Highlights

- **🚀 Zero Friction**: No account required — post requests or register as a donor instantly
- **⚡ Real-time Updates**: Firebase-powered live data synchronization
- **🗺️ Location-Based**: Filter by state, city, and blood group for precise matching
- **📱 Mobile-First**: Fully responsive design optimized for all devices
- **🌙 Dark Mode**: Eye-friendly interface with elegant black-red theme
- **☎️ Direct Contact**: One-click calling to connect donors and recipients immediately

### 💡 Mission & Vision

**🩸 Mission:** Ensure *no life is lost due to blood shortage* by creating an accessible, community-first platform  
**🌍 Vision:** Build *India's largest grassroots blood donation network* powered by technology and compassion

---

## ⚡ Features

### 🔥 Core Features

| Feature | Description |
|---------|-------------|
| 🩸 **Blood Request System** | Post urgent blood requirements with location, blood group, and contact details |
| 👥 **Donor Directory** | Browse verified donors filtered by state, city, and blood group |
| ⚡ **Real-time Updates** | Firebase Firestore ensures instant synchronization across all users |
| 🗺️ **Location-Based Search** | Smart filtering system covering all Indian states and major cities |
| ☎️ **Direct Communication** | One-click calling feature to connect instantly |
| 🌙 **Dark Mode First** | Beautiful dark theme by default with light mode toggle |
| 📱 **Fully Responsive** | Seamless experience across desktop, tablet, and mobile devices |
| 🚫 **No Authentication** | Community-first approach — no login barriers |
| 🔍 **Advanced Filtering** | Search by blood group (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| ⏱️ **Urgent Requests** | Highlighted priority section for critical cases |  

---

## 🧱 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.9+
- **UI Library**: [React 18](https://react.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) + CSS-in-JS
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form + Zod validation
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode

### Backend & Database
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) (NoSQL)
- **Real-time**: Firebase real-time listeners
- **Storage**: Firebase Storage (for future media uploads)

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Deployment**: [Vercel](https://vercel.com/)
- **Analytics**: Vercel Analytics
- **Version Control**: Git & GitHub

### Key Dependencies
```json
{
  "next": "^16.0.0",
  "react": "^18.3.1",
  "firebase": "latest",
  "tailwindcss": "^4.1.9",
  "typescript": "^5.9.3",
  "zod": "3.25.76",
  "react-hook-form": "^7.60.0"
}
```

---

## 🧭 Pages & Previews

### 🏠 Home
Connect instantly with donors and receivers, view urgent requests, and get real-time updates.  
![Home Page](/public/home.png)

---

### 🔍 Find Donors
Search verified donors by **state** and **blood group** — get contact info directly.  
![Find Donors](/public/donors.png)

---

### 🩸 About
Learn about BloodNearMe’s mission, vision, and commitment to saving lives.  
![About Page](/public/about.png)

---

### 👨‍💻 Developer Profile
Meet the creator — a young developer building for a cause.  
![Developer Profile](/public/aboutdev.png)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** package manager ([Install](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))
- **Firebase Account** ([Sign Up](https://firebase.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhayclasher/BloodNearMe.git
   cd BloodNearMe
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase configuration
   - Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 🧩 Project Structure

```bash
BloodNearMe/
│
├── app/                          # Next.js App Router pages
│   ├── about/                    # About page
│   ├── admin/                    # Admin dashboard (future)
│   │   └── dashboard/
│   ├── donor/                    # Donor registration page
│   ├── find/                     # Find donors page
│   ├── request/                  # Blood request form
│   ├── requests/                 # All requests listing
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (Radix)
│   ├── about-section.tsx
│   ├── all-donors.tsx
│   ├── blood-request-form.tsx
│   ├── donor-card.tsx
│   ├── donor-form.tsx
│   ├── donor-map.tsx
│   ├── donor-search.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── urgent-requests.tsx
│
├── lib/                          # Utility functions & configs
│   ├── firebase.ts               # Firebase initialization
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Helper functions
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── public/                       # Static assets
│   └── *.png                     # Screenshots & images
│
├── scripts/                      # Utility scripts
│   └── add-dummy-data.ts
│
├── components.json               # shadcn/ui configuration
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```
## 🚀 Deployment

### Live Site

The application is deployed on **Vercel** for optimal performance and reliability.

🌍 **Visit**: [blood-near-me.vercel.app](https://blood-near-me.vercel.app/)

### Deploy Your Own

#### Option 1: Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abhayclasher/BloodNearMe)

1. Click the button above
2. Connect your GitHub account
3. Add environment variables (Firebase config)
4. Deploy!

#### Option 2: Manual Deployment

```bash
# Install Vercel CLI
pnpm add -g vercel

# Build the project
pnpm build

# Deploy
vercel --prod
```

#### Option 3: Other Platforms

- **Netlify**: Use the included `netlify.toml` configuration
- **Docker**: Build a container with `next build` and `next start`
- **Self-hosted**: Deploy on any Node.js server

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: Open an issue describing the problem
- 💡 **Suggest Features**: Share your ideas for improvements
- 🔧 **Submit Pull Requests**: Fix bugs or add new features
- 📚 **Improve Documentation**: Help make the docs better
- 🌍 **Spread the Word**: Share BloodNearMe with others

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the **BloodNearMe Community License**.  

✅ **Permitted**: Personal use, modifications, non-commercial sharing  
❌ **Restricted**: Commercial use without permission

For commercial licensing inquiries, contact: [abhaypro.cloud@gmail.com](mailto:abhaypro.cloud@gmail.com)

See the [LICENSE](./LICENSE) file for complete terms.


## 🙏 Acknowledgments

- **Firebase** for providing robust real-time database infrastructure
- **Vercel** for seamless deployment and hosting
- **Radix UI** for accessible component primitives
- **Next.js Team** for the incredible React framework
- **Open Source Community** for inspiration and support

---

## 📞 Support & Contact

Need help or have questions?

- 📧 **Email**: [abhaypro.cloud@gmail.com](mailto:abhaypro.cloud@gmail.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/abhayclasher/BloodNearMe/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/abhayclasher/BloodNearMe/discussions)

---

## ❤️ Credits  

<div align="center">

### 👨‍💻 Developed by  
# **Abhay Kumar**  

🧠 **Full Stack Web Developer** | 21 | Kolkata, India 🇮🇳  
*Building technology that saves lives through community collaboration*

### 🏆 About the Developer

- 💻 Passionate about creating impactful solutions with modern web technologies
- 🎯 Focused on healthcare accessibility and social good
- 🎓 Self-taught developer with expertise in React, Next.js, and Firebase
- ♟️ Hobbies: Chess, Cricket, and Open Source Contribution

---

### 🔗 Connect With Me

<p align="center">
  <a href="https://abhaypro.com" target="_blank">
    <img src="https://img.shields.io/badge/🌍_Portfolio-abhaypro.com-FF4747?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
  </a>
  <a href="https://github.com/abhayclasher" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-abhayclasher-1C1C1C?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/abhayclasher" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="mailto:abhaypro.cloud@gmail.com" target="_blank">
    <img src="https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</p>

---

### 💭 Project Philosophy

<p align="center">
  <em>"Every drop counts. Every second matters."</em>
  <br><br>
  This project was born from a simple belief: <strong>technology should serve humanity</strong>.<br>
  In emergencies, every second counts. BloodNearMe eliminates barriers between<br>
  those who need blood and those willing to donate.<br><br>
  <strong>No bureaucracy. No delays. Just humanity helping humanity.</strong>
</p>

---

<p align="center">
  ⭐ <strong>If this project helped you or someone you know, please star it!</strong> ⭐<br>
  Your support motivates continued development and helps others discover this resource.
</p>

<p align="center">
  <br>
  ❤️ <strong>Made with passion in India</strong> 🇮🇳<br>
  <sub>Dedicated to everyone working to make healthcare accessible</sub>
</p>

</div>

