🩸 BloodNearMe
Find Blood Donors and Receivers Near You – Instantly.
<p align="center"> <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=nextdotjs" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" /> <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /> </p>
🌍 Overview

BloodNearMe is an India-based, real-time blood donor and receiver platform that connects people instantly.
No sign-up or authentication — just pure, fast, life-saving connections.

🩸 Submit your details as a donor or request blood as a receiver,
and your post appears instantly on the feed with a direct Contact button.

🌙 Dark mode is default, because life looks better that way.

🖼 Preview

🧭 Here’s a quick look at the design and feel of the app

<p align="center"> <img src="https://github.com/abhayclasher/BloodNearMe/assets/preview1.png" width="800" alt="Home Page" /> </p> <p align="center"> <img src="https://github.com/abhayclasher/BloodNearMe/assets/preview2.png" width="800" alt="Feed Page" /> </p>
🚀 Key Features

✨ No Login Required – Use instantly, no friction.
📍 Smart Location Forms – State & City data for all of India.
🩸 Instant Feed Posting – Requests go live the moment you submit.
📱 One-Tap Contact – Connect instantly through call or email.
🌙 Dark Mode by Default – Sleek, modern interface with light toggle.
⚡ Realtime Updates – Firestore ensures instant syncing.
🎨 Responsive Design – Beautiful on mobile, tablet, or desktop.

🧩 Tech Stack
Category	Technology
Framework	Next.js 16 (App Router, TypeScript)
UI Library	Tailwind CSS + shadcn/ui
Database	Firebase Firestore
Hosting	Vercel
Animation	Framer Motion
Version Control	Git + GitHub
🧱 Project Structure
BloodNearMe/
├── app/
│   ├── donor/              # Donor registration page
│   ├── request/            # Receiver request form
│   ├── feed/               # Live feed of posts
│   ├── layout.tsx          # Root layout (dark/light mode)
│   ├── globals.css         # Tailwind base styles
│   └── page.tsx            # Home page
│
├── components/
│   ├── donor-form.tsx
│   ├── request-form.tsx
│   ├── post-card.tsx
│   ├── navbar.tsx
│   └── theme-toggle.tsx
│
├── lib/
│   ├── firebase.ts         # Firestore setup
│   └── data.ts             # Indian states & cities
│
├── public/
│   └── icons/, assets/
│
├── .env.example
├── package.json
└── README.md

⚙️ Setup & Installation
1️⃣ Clone this Repository
git clone https://github.com/abhayclasher/BloodNearMe.git
cd BloodNearMe

2️⃣ Install Dependencies
npm install

3️⃣ Configure Firebase

Go to Firebase Console

Create a project and enable Firestore Database

Copy your credentials and create a .env file:

NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

4️⃣ Run Locally
npm run dev


🌐 Visit: http://localhost:3000

⚒️ Build Commands
Command	Description
npm run dev	Start local dev server
npm run build	Create optimized production build
npm start	Run the production server
npm run lint	Lint and format code
☁️ Deploy to Vercel

Go to https://vercel.com

Click Import Project → GitHub → BloodNearMe

Add .env values to Environment Variables

Click Deploy 🚀

Your project will be live globally within minutes!

🧠 How It Works

1️⃣ Donor or receiver fills out the form.
2️⃣ Data is sent to Firebase Firestore.
3️⃣ Feed page listens to Firestore updates.
4️⃣ Posts appear instantly with name, location, and contact button.

🎨 UI Highlights

💎 Dark Mode Default — smooth, eye-friendly palette.
🎛 Light Mode Toggle — for day readers.
🩸 Post Cards — minimal, bold, and color-coded by urgency.
📞 Contact Buttons — tel: and mailto: integrated for direct reach.
📶 Realtime Firestore Sync — automatic post updates, no refresh.

❤️ Contributing

Contributions welcome!

Fork this repo

Create a feature branch

Commit your changes

Submit a PR

📜 License

🪶 Licensed under the MIT License.
Feel free to modify and share with attribution.

✨ Credits & Acknowledgments

Built with ❤️ by Abhay
Special thanks to:

Next.js, Tailwind CSS, Firebase

Open-source contributors supporting lifesaving tech

📱 Follow & Connect
<p align="center"> <a href="mailto:abhaypro.cloud@gmail.com"><img src="https://img.shields.io/badge/Email%20Me-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a> <a href="https://github.com/abhayclasher"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a> <a href="https://www.linkedin.com/in/abhayclasher"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /></a> </p>

💡 “Every drop counts. Every donor matters.”
