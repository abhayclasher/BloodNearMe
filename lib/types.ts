export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "donor" | "receiver"
  bloodGroup?: string
  state: string
  city: string
  address: string
  createdAt: string
}

export interface BloodRequest {
  id: string
  name: string
  phone: string
  bloodGroup: string
  city: string
  state: string
  hospital: string
  urgency: "low" | "medium" | "high" | "critical"
  unitsNeeded: number
  description: string
  createdAt: Date
  status: "open" | "fulfilled"
}

export interface DonorProfile {
  id: string
  name: string
  phone: string
  bloodGroup: string
  city: string
  state: string
  age: number
  gender: "male" | "female" | "other"
  lastDonationDate?: Date
  available: boolean
  createdAt: Date
}

export const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Puducherry",
]

export const CITIES_BY_STATE: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Aurangabad", "Nashik"],
  Delhi: ["New Delhi", "Delhi"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore", "Belgaum", "Hubli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling", "Malda", "Bardhaman", "Jalpaiguri", "Cooch Behar", "Kharagpur", "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Medinipur", "Purulia", "Bankura", "Birbhum", "Murshidabad"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Jamnagar"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Bikaner"],
  Telangana: ["Hyderabad", "Secunderabad", "Warangal", "Nizamabad"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur"],
}
