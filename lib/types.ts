export interface User {
  age: string
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
  urgency: "normal" | "urgent" | "critical"
  unitsNeeded: number
  description: string
  reason?: string
  createdAt: Date
  status: "open" | "fulfilled"
}

export interface DonorProfile {
  phoneNumber: string
  fullName: string
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

export const BLOOD_REQUEST_REASONS = [
  "Surgery/Operation",
  "Accident/Trauma",
  "Cancer Treatment",
  "Chronic Disease",
  "Anemia",
  "Pregnancy Complications",
  "Organ Transplant",
  "Blood Disorder",
  "Emergency Medical Condition",
  "Other",
]

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
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

export const CITIES_BY_STATE: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Kakinada", "Tirupati", 
    "Kadapa", "Anantapur", "Vizianagaram", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", 
    "Tenali", "Proddatur", "Chittoor", "Hindupur", "Bhimavaram", "Madanapalle", "Guntakal", "Dharmavaram",
    "Gudivada", "Srikakulam", "Narasaraopet", "Tadipatri", "Tadepalligudem", "Chilakaluripet"
  ],
  "Arunachal Pradesh": [
    "Itanagar", "Naharlagun", "Pasighat", "Namsai", "Tezu", "Ziro", "Bomdila", "Tawang", "Aalo", 
    "Roing", "Changlang", "Khonsa", "Seppa", "Daporijo", "Anini"
  ],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", 
    "Dhubri", "Goalpara", "Karimganj", "Diphu", "Haflong", "Sivasagar", "Golaghat", "Kokrajhar", 
    "Hailakandi", "Barpeta", "Nalbari", "Mangaldoi", "Hojai", "Lanka", "Lumding", "Morigaon"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", 
    "Katihar", "Munger", "Chhapra", "Saharsa", "Sasaram", "Hajipur", "Dehri", "Siwan", "Motihari", 
    "Nawada", "Bagaha", "Buxar", "Kishanganj", "Sitamarhi", "Jamalpur", "Jehanabad", "Aurangabad", 
    "Lakhisarai", "Sheikhpura", "Madhubani", "Samastipur", "Bettiah"
  ],
  "Chhattisgarh": [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", 
    "Ambikapur", "Mahasamund", "Dhamtari", "Chirmiri", "Bhatapara", "Dalli-Rajhara", "Naila Janjgir", 
    "Tilda Newra", "Mungeli", "Manendragarh", "Sakti"
  ],
  "Goa": [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", 
    "Cuncolim", "Quepem", "Pernem", "Canacona", "Valpoi", "Sanguem"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", 
    "Gandhidham", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch", "Mehsana", 
    "Bhuj", "Porbandar", "Palanpur", "Valsad", "Vapi", "Gondal", "Veraval", "Godhra", "Patan", 
    "Kalol", "Dahod", "Botad", "Amreli", "Deesa", "Jetpur"
  ],
  "Haryana": [
    "Faridabad", "Gurgaon", "Gurugram", "Hisar", "Rohtak", "Panipat", "Karnal", "Sonipat", "Yamunanagar", 
    "Panchkula", "Bhiwani", "Bahadurgarh", "Jind", "Sirsa", "Thanesar", "Kaithal", "Palwal", "Rewari", 
    "Hansi", "Narnaul", "Fatehabad", "Gohana", "Tohana", "Narwana", "Mandi Dabwali"
  ],
  "Himachal Pradesh": [
    "Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi", "Nahan", "Sundarnagar", "Kullu", 
    "Hamirpur", "Una", "Bilaspur", "Chamba", "Kangra", "Nurpur", "Manali", "Dalhousie", "Kasauli"
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", 
    "Ramgarh", "Medininagar", "Chirkunda", "Dumka", "Sahibganj", "Chaibasa", "Gumla", "Godda", 
    "Pakur", "Lohardaga", "Jhumri Telaiya", "Madhupur"
  ],
  "Karnataka": [
    "Bangalore", "Bengaluru", "Mysore", "Hubli", "Mangalore", "Belgaum", "Davanagere", "Bellary", 
    "Bijapur", "Shimoga", "Tumkur", "Raichur", "Bidar", "Hospet", "Hassan", "Gadag-Betageri", 
    "Udupi", "Robertsonpet", "Bhadravati", "Chitradurga", "Kolar", "Mandya", "Chikmagalur", "Gangavati", 
    "Bagalkot", "Ranebennuru", "Karwar", "Gulbarga", "Ramanagara", "Yadgir"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Palakkad", "Alappuzha", "Malappuram", 
    "Kannur", "Kottayam", "Kasaragod", "Pathanamthitta", "Ernakulam", "Idukki", "Wayanad", "Thalassery", 
    "Ponnani", "Vatakara", "Kanhangad", "Payyanur", "Koyilandy", "Mattannur", "Punalur", "Nilambur", 
    "Cherthala", "Perinthalmanna", "Ottappalam", "Tirur", "Kalpetta", "Changanassery"
  ],
  "Madhya Pradesh": [
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", 
    "Rewa", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Morena", "Bhind", "Chhindwara", "Guna", 
    "Shivpuri", "Vidisha", "Damoh", "Mandsaur", "Khargone", "Neemuch", "Pithampur", "Hoshangabad", 
    "Itarsi", "Sehore", "Betul", "Seoni", "Datia", "Nagda"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", 
    "Navi Mumbai", "Sangli", "Malegaon", "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", 
    "Ichalkaranji", "Jalgaon", "Bhusawal", "Panvel", "Nanded", "Satara", "Beed", "Yavatmal", "Wardha", 
    "Gondia", "Barshi", "Achalpur", "Osmanabad", "Nandurbar", "Washim", "Hinganghat", "Palghar", 
    "Vasai-Virar", "Mira-Bhayandar", "Kalyan-Dombivli", "Ulhasnagar", "Bhiwandi"
  ],
  "Manipur": [
    "Imphal", "Thoubal", "Churachandpur", "Bishnupur", "Ukhrul", "Senapati", "Jiribam", "Kakching", 
    "Moirang", "Mayang Imphal", "Yairipok"
  ],
  "Meghalaya": [
    "Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara", "Williamnagar", "Resubelpara", "Nongpoh", 
    "Mairang", "Cherrapunji", "Mawlai"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Mamit", "Lawngtlai"
  ],
  "Nagaland": [
    "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon", "Kiphire", 
    "Longleng", "Peren"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", 
    "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Balangir", "Rayagada", "Bhawanipatna", "Angul", 
    "Barbil", "Kendujhar", "Sunabeda", "Talcher", "Paradip", "Phulbani", "Koraput", "Dhenkanal"
  ],
  "Punjab": [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", 
    "Batala", "Moga", "Malerkotla", "Khanna", "Phagwara", "Muktsar", "Barnala", "Rajpura", "Firozpur", 
    "Kapurthala", "Faridkot", "Sangrur", "Nabha", "Mansa", "Gurdaspur", "Abohar", "Rupnagar", 
    "Zirakpur", "Kharar", "Fazilka", "Tarn Taran", "Samana"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", 
    "Sikar", "Pali", "Sri Ganganagar", "Kishangarh", "Tonk", "Beawar", "Hanumangarh", "Dhaulpur", 
    "Churu", "Jhunjhunu", "Barmer", "Sawai Madhopur", "Nagaur", "Makrana", "Sujangarh", "Sardarshahar", 
    "Chittorgarh", "Bundi", "Mount Abu", "Banswara", "Dungarpur"
  ],
  "Sikkim": [
    "Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang", "Naya Bazar"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Tiruppur", "Salem", "Erode", "Tirunelveli", 
    "Vellore", "Thoothukudi", "Thanjavur", "Dindigul", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam", 
    "Hosur", "Nagercoil", "Kanchipuram", "Kumarapalayam", "Karaikkudi", "Neyveli", "Cuddalore", 
    "Kumbakonam", "Tiruvannamalai", "Pollachi", "Rajapalayam", "Gudiyattam", "Pudukkottai", "Vaniyambadi",
    "Ambur", "Nagapattinam", "Theni", "Krishnagiri", "Dharmapuri", "Tirupattur"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahabubnagar", 
    "Nalgonda", "Adilabad", "Suryapet", "Siddipet", "Miryalaguda", "Jagtial", "Mancherial", "Nirmal", 
    "Kamareddy", "Kothagudem", "Bodhan", "Palwancha", "Mandamarri", "Bhongir", "Vikarabad", "Jangaon", 
    "Sircilla", "Wanaparthy", "Medak", "Secunderabad"
  ],
  "Tripura": [
    "Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Khowai", "Ambassa", "Ranir Bazar", 
    "Sonamura", "Sabroom", "Teliamura"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Allahabad", "Bareilly", 
    "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", 
    "Mathura", "Rampur", "Shahjahanpur", "Farrukhabad", "Maunath Bhanjan", "Hapur", "Ayodhya", "Etawah", 
    "Mirzapur", "Bulandshahr", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli", "Orai", "Sitapur", 
    "Bahraich", "Modinagar", "Unnao", "Jaunpur", "Lakhimpur", "Hathras", "Banda", "Pilibhit", "Barabanki", 
    "Khurja", "Gonda", "Mainpuri", "Lalitpur", "Etah", "Deoria", "Basti", "Faizabad", "Greater Noida"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kotdwar", 
    "Ramnagar", "Pithoragarh", "Jaspur", "Manglaur", "Nainital", "Mussoorie", "Tehri", "Pauri", 
    "Bageshwar", "Almora", "Champawat", "Srinagar", "Uttarkashi"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Baharampur", "Habra", 
    "Kharagpur", "Shantipur", "Dankuni", "Darjeeling", "Alipurduar", "Balurghat", "Basirhat", "Bankura", 
    "Chakdaha", "Raiganj", "Jalpaiguri", "Santipur", "Krishnanagar", "Nabadwip", "Medinipur", "Purulia", 
    "Birbhum", "Murshidabad", "Malda", "Cooch Behar", "Haldia", "Bhatpara", "Panihati", "Kamarhati", 
    "Baranagar", "Kulti", "Raniganj", "Rajarhat", "Madhyamgram", "Barddhaman", "Chandannagar", 
    "Barrackpore", "Serampore", "Bally", "Naihati", "Titagarh", "Jangipur", "Islampur", "Bangaon"
  ],
  // Union Territories
  "Andaman and Nicobar Islands": [
    "Port Blair", "Car Nicobar", "Diglipur", "Mayabunder", "Rangat", "Havelock Island", "Neil Island"
  ],
  "Chandigarh": [
    "Chandigarh", "Mani Majra"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman", "Diu", "Silvassa", "Dadra", "Nagar Haveli"
  ],
  "Delhi": [
    "New Delhi", "Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", 
    "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi", "Shahdara", 
    "Dwarka", "Rohini", "Narela", "Najafgarh", "Karol Bagh", "Saket", "Vasant Kunj", "Connaught Place"
  ],
  "Jammu and Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua", "Udhampur", "Pulwama", "Rajouri", 
    "Punch", "Kupwara", "Leh", "Kargil", "Ganderbal", "Bandipore", "Budgam", "Doda", "Kishtwar", 
    "Ramban", "Reasi", "Samba"
  ],
  "Ladakh": [
    "Leh", "Kargil", "Nubra", "Zanskar", "Diskit", "Panamik"
  ],
  "Lakshadweep": [
    "Kavaratti", "Agatti", "Andrott", "Amini", "Kalpeni", "Kadmat", "Kiltan", "Chetlat", "Bitra", "Minicoy"
  ],
  "Puducherry": [
    "Puducherry", "Pondicherry", "Karaikal", "Yanam", "Mahe", "Ozhukarai", "Ariankuppam"
  ],
}
