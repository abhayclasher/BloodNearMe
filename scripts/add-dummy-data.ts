import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

// TODO: Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const dummyRequests = [
  {
    name: "Abhay Kumar",
    phone: "+91 98765 43210",
    bloodGroup: "O+",
    state: "West Bengal",
    city: "Kolkata",
    hospital: "Apollo Hospital",
    urgency: "critical",
    unitsNeeded: 2,
    description: "Emergency surgery required",
    status: "open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    name: "Anjali Verma",
    phone: "+91 87654 32109",
    bloodGroup: "A+",
    state: "Delhi",
    city: "New Delhi",
    hospital: "Max Healthcare",
    urgency: "high",
    unitsNeeded: 1,
    description: "Post-operative transfusion needed",
    status: "open",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    name: "Rajesh Singh",
    phone: "+91 76543 21098",
    bloodGroup: "B+",
    state: "Maharashtra",
    city: "Mumbai",
    hospital: "Lilavati Hospital",
    urgency: "high",
    unitsNeeded: 3,
    description: "Accident victim, urgent blood needed",
    status: "open",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    name: "Priya Sharma",
    phone: "+91 65432 10987",
    bloodGroup: "AB-",
    state: "Karnataka",
    city: "Bangalore",
    hospital: "Fortis Hospital",
    urgency: "critical",
    unitsNeeded: 2,
    description: "Rare blood group needed urgently",
    status: "open",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    name: "Vikram Desai",
    phone: "+91 54321 09876",
    bloodGroup: "O-",
    state: "Tamil Nadu",
    city: "Chennai",
    hospital: "Apollo Speciality Hospital",
    urgency: "normal",
    unitsNeeded: 1,
    description: "Routine blood transfusion",
    status: "open",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    name: "Neha Patel",
    phone: "+91 43210 98765",
    bloodGroup: "B-",
    state: "Gujarat",
    city: "Ahmedabad",
    hospital: "Sterling Hospital",
    urgency: "normal",
    unitsNeeded: 1,
    description: "Planned surgery blood requirement",
    status: "open",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
]

const dummyDonors = [
  {
    fullName: "Arjun Reddy",
    age: 28,
    bloodGroup: "O+",
    gender: "male",
    state: "Telangana",
    city: "Hyderabad",
    pinCode: "500001",
    phoneNumber: "+91 98765 12345",
    dob: "1996-05-15",
    available: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    fullName: "Sneha Gupta",
    age: 25,
    bloodGroup: "A+",
    gender: "female",
    state: "Delhi",
    city: "New Delhi",
    pinCode: "110001",
    phoneNumber: "+91 87654 12345",
    dob: "1999-08-22",
    available: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    fullName: "Rohan Kapoor",
    age: 32,
    bloodGroup: "B+",
    gender: "male",
    state: "Maharashtra",
    city: "Mumbai",
    pinCode: "400001",
    phoneNumber: "+91 76543 12345",
    dob: "1992-03-10",
    available: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    fullName: "Divya Nair",
    age: 27,
    bloodGroup: "AB+",
    gender: "female",
    state: "Kerala",
    city: "Kochi",
    pinCode: "682001",
    phoneNumber: "+91 65432 12345",
    dob: "1997-11-30",
    available: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    fullName: "Aditya Singh",
    age: 30,
    bloodGroup: "O-",
    gender: "male",
    state: "Punjab",
    city: "Chandigarh",
    pinCode: "160001",
    phoneNumber: "+91 54321 12345",
    dob: "1994-07-18",
    available: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    fullName: "Pooja Deshmukh",
    age: 26,
    bloodGroup: "B-",
    gender: "female",
    state: "Madhya Pradesh",
    city: "Indore",
    pinCode: "452001",
    phoneNumber: "+91 43210 12345",
    dob: "1998-09-05",
    available: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
]

async function addDummyData() {
  try {
    console.log("Starting to add sample data...")

    // Add blood requests
    console.log("Adding blood requests...")
    for (const request of dummyRequests) {
      await addDoc(collection(db, "bloodRequests"), {
        ...request,
        createdAt: serverTimestamp(),
      })
    }
    console.log("Added", dummyRequests.length, "blood requests")

    // Add donors
    console.log("Adding donors...")
    for (const donor of dummyDonors) {
      await addDoc(collection(db, "donors"), {
        ...donor,
        createdAt: serverTimestamp(),
      })
    }
    console.log("Added", dummyDonors.length, "donors")

    console.log("Sample data added successfully!")
  } catch (error) {
    console.error("Error adding sample data:", error)
  }
}

addDummyData()
