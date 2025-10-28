import React, { useState } from "react";

// Example data, replace with your actual data
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const INDIAN_STATES = ["Maharashtra", "Karnataka", "Delhi"];
const CITIES = ["Mumbai", "Pune", "Bangalore", "Delhi"];

type FormData = {
  gender: string;
  bloodGroup: string;
  state: string;
  city: string;
  role: string;
};

export default function ProfileForm() {
  const [formData, setFormData] = useState<FormData>({
    gender: "",
    bloodGroup: "",
    state: "",
    city: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Example: Filter cities based on state (implement your own logic)
  const cities = CITIES;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Your submit logic here
    setTimeout(() => {
      setLoading(false);
      setError(null);
      // Success logic
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-2">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Blood Group</label>
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">Select Blood Group</option>
          {BLOOD_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-4">I want to</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="donor"
              checked={formData.role === "donor"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Donate Blood</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="receiver"
              checked={formData.role === "receiver"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Receive Blood</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-light disabled:opacity-50 transition"
      >
        {loading ? "Saving..." : "Complete Profile"}
      </button>
    </form>
  );
}