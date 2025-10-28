import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import type { Auth } from "firebase/auth"
import type { Firestore } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage"

// Read config from NEXT_PUBLIC_ env vars (safe to reference in client builds)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Lazy init: only initialize Firebase on the client (browser). This prevents
// server-side builds (Next export) from running browser-specific firebase code
// which can fail during static export.
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

if (typeof window !== "undefined") {
  // Importing these modules at top-level can be fine, but initialization
  // should only happen in the browser. Use getApps to avoid double-init.
  const { getAuth } = require("firebase/auth")
  const { getFirestore } = require("firebase/firestore")
  const { getStorage } = require("firebase/storage")

  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
}

export { auth, db, storage }
export default app
