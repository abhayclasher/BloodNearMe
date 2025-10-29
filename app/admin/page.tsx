"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getDbClient } from "@/lib/firebase";
import type { BloodRequest, DonorProfile, User } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BLOOD_GROUPS, INDIAN_STATES, BLOOD_REQUEST_REASONS, CITIES_BY_STATE } from "@/lib/types";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalReceivers: 0,
    totalUsers: 0,
    openRequests: 0,
    fulfilledRequests: 0,
    totalRequests: 0,
    donorsByBloodGroup: {} as Record<string, number>,
    requestsByBloodGroup: {} as Record<string, number>,
    requestsByUrgency: {} as Record<string, number>,
  });
  const [recentRequests, setRecentRequests] = useState<BloodRequest[]>([]);
  const [allDonors, setAllDonors] = useState<DonorProfile[]>([]);
  const [allRequests, setAllRequests] = useState<BloodRequest[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [editingDonor, setEditingDonor] = useState<DonorProfile | null>(null);
  const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDonorOpen, setIsEditDonorOpen] = useState(false);
  const [isEditRequestOpen, setIsEditRequestOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "donors" | "requests" | "fulfilled" | "users">("overview");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [allCities, setAllCities] = useState<string[]>([]);

  const fetchStats = async () => {
    const db = getDbClient();
    if (!db) return;

    try {
      // Fetch total donors
      const donorsSnapshot = await getDocs(collection(db, "donors"));
      const totalDonors = donorsSnapshot.size;
      const donorsData = donorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        lastDonationDate: doc.data().lastDonationDate?.toDate?.() || undefined,
      })) as DonorProfile[];
      setAllDonors(donorsData);
      console.log("Loaded donors:", donorsData.length);

      // Fetch total receivers
      const receiversQuery = query(collection(db, "users"), where("role", "==", "receiver"));
      const receiversSnapshot = await getDocs(receiversQuery);
      const totalReceivers = receiversSnapshot.size;

      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const totalUsers = usersSnapshot.size;
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setAllUsers(usersData);
      console.log("Loaded users:", usersData.length);

      // Fetch blood requests
      const requestsSnapshot = await getDocs(collection(db, "bloodRequests"));
      const allRequestsData = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as BloodRequest[];
      setAllRequests(allRequestsData);
      console.log("Loaded requests:", allRequestsData.length);
      console.log("Sample request:", allRequestsData[0]);
      
      // Extract unique cities from donors and requests
      const donorCities = donorsData.map(d => d.city).filter(Boolean);
      const requestCities = allRequestsData.map(r => r.city).filter(Boolean);
      const uniqueCities = Array.from(new Set([...donorCities, ...requestCities])).sort();
      setAllCities(uniqueCities);
      
      const openRequests = allRequestsData.filter((req) => req.status === "open").length;
      const fulfilledRequests = allRequestsData.filter((req) => req.status === "fulfilled").length;

      // Calculate donors by blood group
      const donorsByBloodGroup = donorsData.reduce((acc, donor) => {
        if (donor.bloodGroup) {
          acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Calculate requests by blood group and urgency
      const requestsByBloodGroup = allRequestsData.reduce((acc, req) => {
        acc[req.bloodGroup] = (acc[req.bloodGroup] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const requestsByUrgency = allRequestsData.reduce((acc, req) => {
        acc[req.urgency] = (acc[req.urgency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        totalDonors,
        totalReceivers,
        totalUsers,
        openRequests,
        fulfilledRequests,
        totalRequests: allRequestsData.length,
        donorsByBloodGroup,
        requestsByBloodGroup,
        requestsByUrgency,
      });

      // Fetch recent requests
      const recentRequestsQuery = query(
        collection(db, "bloodRequests"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentRequestsSnapshot = await getDocs(recentRequestsQuery);
      const recentRequestsData = recentRequestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as BloodRequest[];
      setRecentRequests(recentRequestsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'cla3her') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const handleUpdateDonor = async () => {
    if (!editingDonor) return;
    const db = getDbClient();
    if (!db) return;

    try {
      // Filter out undefined values
      const updateData: any = {};
      if (editingDonor.fullName !== undefined) updateData.fullName = editingDonor.fullName;
      if (editingDonor.name !== undefined) updateData.name = editingDonor.name;
      if (editingDonor.phone !== undefined) updateData.phone = editingDonor.phone;
      if (editingDonor.phoneNumber !== undefined) updateData.phoneNumber = editingDonor.phoneNumber;
      if (editingDonor.bloodGroup !== undefined) updateData.bloodGroup = editingDonor.bloodGroup;
      if (editingDonor.city !== undefined) updateData.city = editingDonor.city;
      if (editingDonor.state !== undefined) updateData.state = editingDonor.state;
      if (editingDonor.age !== undefined) updateData.age = editingDonor.age;
      if (editingDonor.gender !== undefined) updateData.gender = editingDonor.gender;
      if (editingDonor.available !== undefined) updateData.available = editingDonor.available;

      await updateDoc(doc(db, "donors", editingDonor.id), updateData);
      toast.success("Donor updated successfully");
      setIsEditDonorOpen(false);
      setEditingDonor(null);
      fetchStats();
    } catch (error) {
      console.error("Error updating donor:", error);
      toast.error("Failed to update donor");
    }
  };

  const handleDeleteDonor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donor?")) return;
    const db = getDbClient();
    if (!db) return;

    try {
      await deleteDoc(doc(db, "donors", id));
      toast.success("Donor deleted successfully");
      fetchStats();
    } catch (error) {
      console.error("Error deleting donor:", error);
      toast.error("Failed to delete donor");
    }
  };

  const handleUpdateRequest = async () => {
    if (!editingRequest) return;
    const db = getDbClient();
    if (!db) return;

    try {
      // Filter out undefined values
      const updateData: any = {};
      if (editingRequest.name !== undefined) updateData.name = editingRequest.name;
      if (editingRequest.phone !== undefined) updateData.phone = editingRequest.phone;
      if (editingRequest.bloodGroup !== undefined) updateData.bloodGroup = editingRequest.bloodGroup;
      if (editingRequest.city !== undefined) updateData.city = editingRequest.city;
      if (editingRequest.state !== undefined) updateData.state = editingRequest.state;
      if (editingRequest.hospital !== undefined) updateData.hospital = editingRequest.hospital;
      if (editingRequest.urgency !== undefined) updateData.urgency = editingRequest.urgency;
      if (editingRequest.unitsNeeded !== undefined) updateData.unitsNeeded = editingRequest.unitsNeeded;
      if (editingRequest.description !== undefined) updateData.description = editingRequest.description;
      if (editingRequest.reason !== undefined && editingRequest.reason !== "") {
        updateData.reason = editingRequest.reason;
        // Sync description with reason for backward compatibility
        updateData.description = editingRequest.reason;
      }
      if (editingRequest.status !== undefined) updateData.status = editingRequest.status;

      console.log("Updating request with data:", updateData);
      await updateDoc(doc(db, "bloodRequests", editingRequest.id), updateData);
      toast.success("Request updated successfully");
      setIsEditRequestOpen(false);
      setEditingRequest(null);
      fetchStats();
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update request");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    const db = getDbClient();
    if (!db) return;

    try {
      await deleteDoc(doc(db, "bloodRequests", id));
      toast.success("Request deleted successfully");
      fetchStats();
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const db = getDbClient();
    if (!db) return;

    try {
      // Filter out undefined values
      const updateData: any = {};
      if (editingUser.name !== undefined) updateData.name = editingUser.name;
      if (editingUser.email !== undefined) updateData.email = editingUser.email;
      if (editingUser.phone !== undefined) updateData.phone = editingUser.phone;
      if (editingUser.bloodGroup !== undefined) updateData.bloodGroup = editingUser.bloodGroup;
      if (editingUser.city !== undefined) updateData.city = editingUser.city;
      if (editingUser.state !== undefined) updateData.state = editingUser.state;
      if (editingUser.address !== undefined) updateData.address = editingUser.address;
      if (editingUser.age !== undefined) updateData.age = editingUser.age;
      if (editingUser.role !== undefined) updateData.role = editingUser.role;

      await updateDoc(doc(db, "users", editingUser.id), updateData);
      toast.success("User updated successfully");
      setIsEditUserOpen(false);
      setEditingUser(null);
      fetchStats();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const db = getDbClient();
    if (!db) return;

    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User deleted successfully");
      fetchStats();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "cla3her") {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'cla3her');
      setPasswordError("");
      toast.success("Welcome to Admin Dashboard!");
    } else {
      setPasswordError("Incorrect password. Please try again.");
      toast.error("Incorrect password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPassword("");
    toast.success("Logged out successfully");
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card border-2 border-red-600/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                🔒
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                Admin Access
              </h1>
              <p className="text-gray-400">Enter password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="password" className="text-white mb-2 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 ${
                    passwordError ? "border-red-500" : ""
                  }`}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3"
              >
                🔓 Access Dashboard
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background pt-4 pb-4 px-4 md:pt-6 md:pb-8 md:px-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage donors, requests, and monitor platform stats</p>
        </div>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          🚪 Logout
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-gray-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
            activeTab === "overview"
              ? "border-red-600 text-red-500"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab("donors")}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
            activeTab === "donors"
              ? "border-red-600 text-red-500"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          👥 Donors ({stats.totalDonors})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
            activeTab === "requests"
              ? "border-red-600 text-red-500"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          🆘 Requests ({stats.totalRequests})
        </button>
        <button
          onClick={() => setActiveTab("fulfilled")}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
            activeTab === "fulfilled"
              ? "border-red-600 text-red-500"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          ✅ Fulfilled ({stats.fulfilledRequests})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
            activeTab === "users"
              ? "border-red-600 text-red-500"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          👤 Users ({stats.totalUsers})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-800/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setActiveTab("donors")}
            >
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <span className="text-2xl">👥</span> Total Donors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-blue-500">{stats.totalDonors}</p>
                <p className="text-sm text-gray-500 mt-2">Registered donors</p>
                <p className="text-xs text-blue-400 mt-2">Click to view all →</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-800/30 hover:border-green-600/50 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setActiveTab("requests")}
            >
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <span className="text-2xl">📋</span> Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-green-500">{stats.totalRequests}</p>
                <p className="text-sm text-gray-500 mt-2">All blood requests</p>
                <p className="text-xs text-green-400 mt-2">Click to view all →</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-800/30 hover:border-orange-600/50 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setActiveTab("requests")}
            >
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <span className="text-2xl">🚨</span> Open Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-orange-500">{stats.openRequests}</p>
                <p className="text-sm text-gray-500 mt-2">Pending requests</p>
                <p className="text-xs text-orange-400 mt-2">Click to view all →</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-800/30 hover:border-red-600/50 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setActiveTab("fulfilled")}
            >
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <span className="text-2xl">✅</span> Fulfilled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-red-500">{stats.fulfilledRequests}</p>
                <p className="text-sm text-gray-500 mt-2">Completed requests</p>
                <p className="text-xs text-red-400 mt-2">Click to view all →</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🩸</span> Donors by Blood Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {BLOOD_GROUPS.map((group) => (
                    <div key={group} className="flex items-center justify-between">
                      <span className="font-semibold text-red-500">{group}</span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-red-600 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${((stats.donorsByBloodGroup[group] || 0) / stats.totalDonors) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold w-8 text-right">
                          {stats.donorsByBloodGroup[group] || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📊</span> Requests by Blood Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {BLOOD_GROUPS.map((group) => (
                    <div key={group} className="flex items-center justify-between">
                      <span className="font-semibold text-orange-500">{group}</span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-orange-600 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${((stats.requestsByBloodGroup[group] || 0) / stats.totalRequests) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold w-8 text-right">
                          {stats.requestsByBloodGroup[group] || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span> Requests by Urgency
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.requestsByUrgency).length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No urgency data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(stats.requestsByUrgency)
                      .sort((a, b) => {
                        const order = { critical: 0, high: 1, medium: 2, low: 3 };
                        const aKey = a[0].toLowerCase();
                        const bKey = b[0].toLowerCase();
                        return (order[aKey as keyof typeof order] ?? 999) - (order[bKey as keyof typeof order] ?? 999);
                      })
                      .map(([urgency, count]) => (
                        <div key={urgency} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                urgency.toLowerCase() === "critical"
                                  ? "bg-red-600"
                                  : urgency.toLowerCase() === "high"
                                  ? "bg-orange-600"
                                  : urgency.toLowerCase() === "medium"
                                  ? "bg-yellow-600"
                                  : "bg-green-600"
                              }`}
                            ></div>
                            <span className="font-medium capitalize">{urgency}</span>
                          </div>
                          <span className="text-2xl font-bold">{count}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Requests */}
          <Card className="bg-card/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🕐</span> Recent Blood Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead>Name</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Units</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRequests.map((request) => (
                      <TableRow key={request.id} className="border-gray-800 hover:bg-gray-900/50">
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded font-semibold">
                            {request.bloodGroup}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-400">{request.city}</TableCell>
                        <TableCell className="text-gray-400">{request.hospital}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.urgency === "critical"
                                ? "bg-red-900/30 text-red-400"
                                : request.urgency === "urgent"
                                ? "bg-orange-900/30 text-orange-400"
                                : "bg-green-900/30 text-green-400"
                            }`}
                          >
                            {request.urgency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.status === "open"
                                ? "bg-orange-900/30 text-orange-400"
                                : "bg-green-900/30 text-green-400"
                            }`}
                          >
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold">{request.unitsNeeded}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Donors Tab */}
      {activeTab === "donors" && (
        <Card className="bg-card/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">👥</span> All Donors
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="cityFilter" className="text-sm text-gray-400">Filter by City:</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-[200px] bg-gray-900 border-gray-700">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {allCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDonors
                    .filter((donor) => selectedCity === "all" || donor.city === selectedCity)
                    .map((donor) => (
                    <TableRow key={donor.id} className="border-gray-800 hover:bg-gray-900/50">
                      <TableCell className="font-medium">{donor.fullName || donor.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded font-semibold">
                          {donor.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400">{donor.phone || donor.phoneNumber}</TableCell>
                      <TableCell className="text-gray-400">{donor.city}</TableCell>
                      <TableCell className="text-gray-400">{donor.age}</TableCell>
                      <TableCell className="text-gray-400 capitalize">{donor.gender}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            donor.available
                              ? "bg-green-900/30 text-green-400"
                              : "bg-gray-900/30 text-gray-400"
                          }`}
                        >
                          {donor.available ? "Available" : "Not Available"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={isEditDonorOpen && editingDonor?.id === donor.id} onOpenChange={(open) => {
                            setIsEditDonorOpen(open);
                            if (!open) setEditingDonor(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-900/20 border-blue-800 text-blue-400 hover:bg-blue-900/40"
                                onClick={() => setEditingDonor(donor)}
                              >
                                ✏️ Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Donor</DialogTitle>
                                <DialogDescription>Update donor information</DialogDescription>
                              </DialogHeader>
                              {editingDonor && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="fullName">Full Name</Label>
                                      <Input
                                        id="fullName"
                                        value={editingDonor.fullName}
                                        onChange={(e) =>
                                          setEditingDonor({ ...editingDonor, fullName: e.target.value, name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="phone">Phone</Label>
                                      <Input
                                        id="phone"
                                        value={editingDonor.phone || editingDonor.phoneNumber}
                                        onChange={(e) =>
                                          setEditingDonor({ ...editingDonor, phone: e.target.value, phoneNumber: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="bloodGroup">Blood Group</Label>
                                      <Select
                                        value={editingDonor.bloodGroup}
                                        onValueChange={(value) =>
                                          setEditingDonor({ ...editingDonor, bloodGroup: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {BLOOD_GROUPS.map((bg) => (
                                            <SelectItem key={bg} value={bg}>
                                              {bg}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="age">Age</Label>
                                      <Input
                                        id="age"
                                        type="number"
                                        value={editingDonor.age}
                                        onChange={(e) =>
                                          setEditingDonor({ ...editingDonor, age: parseInt(e.target.value) })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="state">State</Label>
                                      <Select
                                        value={editingDonor.state}
                                        onValueChange={(value) =>
                                          setEditingDonor({ ...editingDonor, state: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {INDIAN_STATES.map((state) => (
                                            <SelectItem key={state} value={state}>
                                              {state}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="city">City</Label>
                                      <Input
                                        id="city"
                                        value={editingDonor.city}
                                        onChange={(e) =>
                                          setEditingDonor({ ...editingDonor, city: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="gender">Gender</Label>
                                      <Select
                                        value={editingDonor.gender}
                                        onValueChange={(value: "male" | "female" | "other") =>
                                          setEditingDonor({ ...editingDonor, gender: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="male">Male</SelectItem>
                                          <SelectItem value="female">Female</SelectItem>
                                          <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="available">Availability</Label>
                                      <Select
                                        value={editingDonor.available ? "true" : "false"}
                                        onValueChange={(value) =>
                                          setEditingDonor({ ...editingDonor, available: value === "true" })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="true">Available</SelectItem>
                                          <SelectItem value="false">Not Available</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <Button onClick={handleUpdateDonor} className="bg-red-600 hover:bg-red-700">
                                    Save Changes
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40"
                            onClick={() => handleDeleteDonor(donor.id)}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <Card className="bg-card/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🆘</span> All Blood Requests
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="cityFilterReq" className="text-sm text-gray-400">Filter by City:</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-[200px] bg-gray-900 border-gray-700">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {allCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRequests
                    .filter((request) => selectedCity === "all" || request.city === selectedCity)
                    .map((request) => (
                    <TableRow key={request.id} className="border-gray-800 hover:bg-gray-900/50">
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded font-semibold">
                          {request.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400">{request.phone}</TableCell>
                      <TableCell className="text-gray-400">{request.hospital}</TableCell>
                      <TableCell className="text-gray-400">{request.city}</TableCell>
                      <TableCell className="font-bold">{request.unitsNeeded}</TableCell>
                      <TableCell className="text-gray-400">{request.reason || '-'}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            request.urgency === "critical"
                              ? "bg-red-900/30 text-red-400"
                              : request.urgency === "urgent"
                              ? "bg-orange-900/30 text-orange-400"
                              : "bg-green-900/30 text-green-400"
                          }`}
                        >
                          {request.urgency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            request.status === "open"
                              ? "bg-orange-900/30 text-orange-400"
                              : "bg-green-900/30 text-green-400"
                          }`}
                        >
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={isEditRequestOpen && editingRequest?.id === request.id} onOpenChange={(open) => {
                            setIsEditRequestOpen(open);
                            if (!open) setEditingRequest(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-900/20 border-blue-800 text-blue-400 hover:bg-blue-900/40"
                                onClick={() => setEditingRequest(request)}
                              >
                                ✏️ Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Blood Request</DialogTitle>
                                <DialogDescription>Update request information and status</DialogDescription>
                              </DialogHeader>
                              {editingRequest && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="name">Name</Label>
                                      <Input
                                        id="name"
                                        value={editingRequest.name}
                                        onChange={(e) =>
                                          setEditingRequest({ ...editingRequest, name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="reqPhone">Phone</Label>
                                      <Input
                                        id="reqPhone"
                                        value={editingRequest.phone}
                                        onChange={(e) =>
                                          setEditingRequest({ ...editingRequest, phone: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="reqBloodGroup">Blood Group</Label>
                                      <Select
                                        value={editingRequest.bloodGroup}
                                        onValueChange={(value) =>
                                          setEditingRequest({ ...editingRequest, bloodGroup: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {BLOOD_GROUPS.map((bg) => (
                                            <SelectItem key={bg} value={bg}>
                                              {bg}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="unitsNeeded">Units Needed</Label>
                                      <Select
                                        value={editingRequest.unitsNeeded.toString()}
                                        onValueChange={(value) =>
                                          setEditingRequest({ ...editingRequest, unitsNeeded: parseInt(value) })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from({ length: 5 }, (_, i) => i + 1).map((unit) => (
                                            <SelectItem key={unit} value={unit.toString()}>
                                              {unit} {unit === 1 ? 'Unit' : 'Units'}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="reason">Reason</Label>
                                    <Select
                                      value={editingRequest.reason || "Other"}
                                      onValueChange={(value) => {
                                        console.log("Reason changed to:", value);
                                        setEditingRequest({ ...editingRequest, reason: value });
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Reason" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {BLOOD_REQUEST_REASONS.map((reason) => (
                                          <SelectItem key={reason} value={reason}>
                                            {reason}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="hospital">Hospital</Label>
                                    <Input
                                      id="hospital"
                                      value={editingRequest.hospital}
                                      onChange={(e) =>
                                        setEditingRequest({ ...editingRequest, hospital: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="reqState">State</Label>
                                      <Select
                                        value={editingRequest.state}
                                        onValueChange={(value) =>
                                          setEditingRequest({ ...editingRequest, state: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {INDIAN_STATES.map((state) => (
                                            <SelectItem key={state} value={state}>
                                              {state}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="reqCity">City</Label>
                                      <Input
                                        id="reqCity"
                                        value={editingRequest.city}
                                        onChange={(e) =>
                                          setEditingRequest({ ...editingRequest, city: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="urgency">Urgency</Label>
                                      <Select
                                        value={editingRequest.urgency}
                                        onValueChange={(value: "normal" | "urgent" | "critical") =>
                                          setEditingRequest({ ...editingRequest, urgency: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="normal">✓ Normal</SelectItem>
                                          <SelectItem value="urgent">⚠️ Urgent</SelectItem>
                                          <SelectItem value="critical">🚨 Critical</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="status">Status</Label>
                                      <Select
                                        value={editingRequest.status}
                                        onValueChange={(value: "open" | "fulfilled") =>
                                          setEditingRequest({ ...editingRequest, status: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="open">Open</SelectItem>
                                          <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                      id="description"
                                      value={editingRequest.description}
                                      onChange={(e) =>
                                        setEditingRequest({ ...editingRequest, description: e.target.value })
                                      }
                                    />
                                  </div>
                                  <Button onClick={handleUpdateRequest} className="bg-red-600 hover:bg-red-700">
                                    Save Changes
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fulfilled Tab */}
      {activeTab === "fulfilled" && (
        <Card className="bg-card/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">✅</span> Fulfilled Blood Requests
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="cityFilterFulfilled" className="text-sm text-gray-400">Filter by City:</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-[200px] bg-gray-900 border-gray-700">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {allCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRequests
                    .filter(req => req.status === "fulfilled")
                    .filter((request) => selectedCity === "all" || request.city === selectedCity)
                    .map((request) => (
                    <TableRow key={request.id} className="border-gray-800 hover:bg-gray-900/50">
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded font-semibold">
                          {request.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400">{request.phone}</TableCell>
                      <TableCell className="text-gray-400">{request.hospital}</TableCell>
                      <TableCell className="text-gray-400">{request.city}</TableCell>
                      <TableCell className="font-bold">{request.unitsNeeded}</TableCell>
                      <TableCell className="text-gray-400">{request.reason || '-'}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            request.urgency === "critical"
                              ? "bg-red-900/30 text-red-400"
                              : request.urgency === "urgent"
                              ? "bg-orange-900/30 text-orange-400"
                              : "bg-green-900/30 text-green-400"
                          }`}
                        >
                          {request.urgency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={isEditRequestOpen && editingRequest?.id === request.id} onOpenChange={(open) => {
                            setIsEditRequestOpen(open);
                            if (!open) setEditingRequest(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-900/20 border-blue-800 text-blue-400 hover:bg-blue-900/40"
                                onClick={() => setEditingRequest(request)}
                              >
                                ✏️ Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Blood Request</DialogTitle>
                                <DialogDescription>Update request information and status</DialogDescription>
                              </DialogHeader>
                              {editingRequest && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="name">Name</Label>
                                      <Input
                                        id="name"
                                        value={editingRequest.name}
                                        onChange={(e) =>
                                          setEditingRequest({ ...editingRequest, name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="reqPhone">Phone</Label>
                                      <Input
                                        id="reqPhone"
                                        value={editingRequest.phone}
                                        onChange={(e) =>
                                          setEditingRequest({ ...editingRequest, phone: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="reqBloodGroup">Blood Group</Label>
                                      <Select
                                        value={editingRequest.bloodGroup}
                                        onValueChange={(value) =>
                                          setEditingRequest({ ...editingRequest, bloodGroup: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {BLOOD_GROUPS.map((bg) => (
                                            <SelectItem key={bg} value={bg}>
                                              {bg}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="unitsNeeded">Units Needed</Label>
                                      <Select
                                        value={editingRequest.unitsNeeded.toString()}
                                        onValueChange={(value) =>
                                          setEditingRequest({ ...editingRequest, unitsNeeded: parseInt(value) })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from({ length: 5 }, (_, i) => i + 1).map((unit) => (
                                            <SelectItem key={unit} value={unit.toString()}>
                                              {unit} {unit === 1 ? 'Unit' : 'Units'}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="reason">Reason</Label>
                                    <Select
                                      value={editingRequest.reason || "Other"}
                                      onValueChange={(value) => {
                                        console.log("Reason changed to:", value);
                                        setEditingRequest({ ...editingRequest, reason: value });
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Reason" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {BLOOD_REQUEST_REASONS.map((reason) => (
                                          <SelectItem key={reason} value={reason}>
                                            {reason}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="hospital">Hospital</Label>
                                    <Input
                                      id="hospital"
                                      value={editingRequest.hospital}
                                      onChange={(e) =>
                                        setEditingRequest({ ...editingRequest, hospital: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="reqState">State</Label>
                                      <Select
                                        value={editingRequest.state}
                                        onValueChange={(value) =>
                                          setEditingRequest({ ...editingRequest, state: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {INDIAN_STATES.map((state) => (
                                            <SelectItem key={state} value={state}>
                                              {state}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="reqCity">City</Label>
                                      <Input
                                        id="reqCity"
                                        value={editingRequest.city}
                                        onChange={(e) =>
                                          setEditingRequest({ ...editingRequest, city: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="urgency">Urgency</Label>
                                      <Select
                                        value={editingRequest.urgency}
                                        onValueChange={(value: "normal" | "urgent" | "critical") =>
                                          setEditingRequest({ ...editingRequest, urgency: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="normal">✓ Normal</SelectItem>
                                          <SelectItem value="urgent">⚠️ Urgent</SelectItem>
                                          <SelectItem value="critical">🚨 Critical</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="status">Status</Label>
                                      <Select
                                        value={editingRequest.status}
                                        onValueChange={(value: "open" | "fulfilled") =>
                                          setEditingRequest({ ...editingRequest, status: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="open">Open</SelectItem>
                                          <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                      id="description"
                                      value={editingRequest.description}
                                      onChange={(e) =>
                                        setEditingRequest({ ...editingRequest, description: e.target.value })
                                      }
                                    />
                                  </div>
                                  <Button onClick={handleUpdateRequest} className="bg-red-600 hover:bg-red-700">
                                    Save Changes
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card className="bg-card/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">👤</span> All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-2">No users found</p>
                <p className="text-gray-500 text-sm">Users will appear here once they register</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((user) => (
                      <TableRow key={user.id} className="border-gray-800 hover:bg-gray-900/50">
                        <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-400">{user.email || 'N/A'}</TableCell>
                        <TableCell className="text-gray-400">{user.phone || 'N/A'}</TableCell>
                        <TableCell>
                          {user.bloodGroup ? (
                            <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded font-semibold">
                              {user.bloodGroup}
                            </span>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === "donor"
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-green-900/30 text-green-400"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-400">{user.city || 'N/A'}</TableCell>
                        <TableCell className="text-gray-400">{user.age || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={isEditUserOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                              setIsEditUserOpen(open);
                              if (!open) setEditingUser(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-blue-900/20 border-blue-800 text-blue-400 hover:bg-blue-900/40"
                                  onClick={() => setEditingUser(user)}
                                >
                                  ✏️ Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-card border-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                  <DialogDescription>Update user information</DialogDescription>
                                </DialogHeader>
                                {editingUser && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="userName">Name</Label>
                                        <Input
                                          id="userName"
                                          value={editingUser.name}
                                          onChange={(e) =>
                                            setEditingUser({ ...editingUser, name: e.target.value })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="userEmail">Email</Label>
                                        <Input
                                          id="userEmail"
                                          value={editingUser.email}
                                          onChange={(e) =>
                                            setEditingUser({ ...editingUser, email: e.target.value })
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="userPhone">Phone</Label>
                                        <Input
                                          id="userPhone"
                                          value={editingUser.phone}
                                          onChange={(e) =>
                                            setEditingUser({ ...editingUser, phone: e.target.value })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="userBloodGroup">Blood Group</Label>
                                        <Select
                                          value={editingUser.bloodGroup || ""}
                                          onValueChange={(value) =>
                                            setEditingUser({ ...editingUser, bloodGroup: value })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select blood group" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {BLOOD_GROUPS.map((bg) => (
                                              <SelectItem key={bg} value={bg}>
                                                {bg}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="userState">State</Label>
                                        <Select
                                          value={editingUser.state}
                                          onValueChange={(value) =>
                                            setEditingUser({ ...editingUser, state: value })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_STATES.map((state) => (
                                              <SelectItem key={state} value={state}>
                                                {state}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="userCity">City</Label>
                                        <Input
                                          id="userCity"
                                          value={editingUser.city}
                                          onChange={(e) =>
                                            setEditingUser({ ...editingUser, city: e.target.value })
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="userAge">Age</Label>
                                        <Input
                                          id="userAge"
                                          value={editingUser.age}
                                          onChange={(e) =>
                                            setEditingUser({ ...editingUser, age: e.target.value })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="userRole">Role</Label>
                                        <Select
                                          value={editingUser.role}
                                          onValueChange={(value: "donor" | "receiver") =>
                                            setEditingUser({ ...editingUser, role: value })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="donor">Donor</SelectItem>
                                            <SelectItem value="receiver">Receiver</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="userAddress">Address</Label>
                                      <Input
                                        id="userAddress"
                                        value={editingUser.address}
                                        onChange={(e) =>
                                          setEditingUser({ ...editingUser, address: e.target.value })
                                        }
                                      />
                                    </div>
                                    <Button onClick={handleUpdateUser} className="bg-red-600 hover:bg-red-700">
                                      Save Changes
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
