"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getDbClient } from "@/lib/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// --- HeroHeader Component ---
function HeroHeader() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-8 px-6 rounded-lg mb-8 shadow">
      <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-lg">Manage users, requests, and platform statistics.</p>
    </div>
  );
}

export default function AdminClient() {
  // --- Admin login state ---
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  // --- Stats and data ---
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalReceivers: 0,
    openRequests: 0,
    fulfilledRequests: 0,
    donorsByBloodGroup: {} as Record<string, number>,
    requestsByBloodGroup: {} as Record<string, number>,
    requestsByUrgency: {} as Record<string, number>,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- User edit state ---
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<any>>({});

  // --- Request edit state ---
  const [editRequestId, setEditRequestId] = useState<string | null>(null);
  const [editRequestData, setEditRequestData] = useState<Partial<any>>({});

  // --- Admin login handler ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password.");
    }
  };

  // --- Fetch stats, users, requests ---
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchStats = async () => {
      const db = getDbClient();
      if (!db) return;

      // Donors
      const donorsSnapshot = await getDocs(collection(db, "donors"));
      const totalDonors = donorsSnapshot.size;
      const donorsData = donorsSnapshot.docs.map((doc) => doc.data());

      // Receivers
      const receiversQuery = query(collection(db, "users"), where("role", "==", "receiver"));
      const receiversSnapshot = await getDocs(receiversQuery);
      const totalReceivers = receiversSnapshot.size;

      // Requests
      const requestsSnapshot = await getDocs(collection(db, "bloodRequests"));
      const allRequests = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? null,
      }));
      const openRequests = allRequests.filter((req) => req.status === "open").length;
      const fulfilledRequests = allRequests.filter((req) => req.status === "fulfilled").length;

      // Group stats
      const donorsByBloodGroup = donorsData.reduce((acc: any, donor: any) => {
        if (donor.bloodGroup) acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
        return acc;
      }, {});
      const requestsByBloodGroup = allRequests.reduce((acc: any, req: any) => {
        acc[req.bloodGroup] = (acc[req.bloodGroup] || 0) + 1;
        return acc;
      }, {});
      const requestsByUrgency = allRequests.reduce((acc: any, req: any) => {
        acc[req.urgency] = (acc[req.urgency] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalDonors,
        totalReceivers,
        openRequests,
        fulfilledRequests,
        donorsByBloodGroup,
        requestsByBloodGroup,
        requestsByUrgency,
      });

      // Recent requests
      const recentRequestsQuery = query(
        collection(db, "bloodRequests"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentRequestsSnapshot = await getDocs(recentRequestsQuery);
      const recentRequestsData = recentRequestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? null,
      }));
      setRecentRequests(recentRequestsData);
    };

    const fetchUsers = async () => {
      const db = getDbClient();
      if (!db) return;
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    };

    const fetchRequests = async () => {
      const db = getDbClient();
      if (!db) return;
      const requestsSnapshot = await getDocs(collection(db, "bloodRequests"));
      const requestsData = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? null,
      }));
      setRequests(requestsData);
    };

    fetchStats();
    fetchUsers();
    fetchRequests();
  }, [isAuthenticated]);

  // --- User Management Handlers ---
  const handleEditUser = (user: any) => {
    setEditUserId(user.id);
    setEditUserData(user);
  };

  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    if (!editUserId) return;
    setLoading(true);
    try {
      const db = getDbClient();
      if (!db) return;
      const userRef = doc(db, "users", editUserId);
      await updateDoc(userRef, editUserData);
      setUsers((prev) =>
        prev.map((u) => (u.id === editUserId ? { ...u, ...editUserData } : u))
      );
      setEditUserId(null);
      setEditUserData({});
    } catch (err) {
      alert("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      const db = getDbClient();
      if (!db) return;
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // --- Request Management Handlers ---
  const handleEditRequest = (req: any) => {
    setEditRequestId(req.id);
    setEditRequestData(req);
  };

  const handleEditRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveRequest = async () => {
    if (!editRequestId) return;
    setLoading(true);
    try {
      const db = getDbClient();
      if (!db) return;
      const reqRef = doc(db, "bloodRequests", editRequestId);
      await updateDoc(reqRef, editRequestData);
      setRequests((prev) =>
        prev.map((r) => (r.id === editRequestId ? { ...r, ...editRequestData } : r))
      );
      setEditRequestId(null);
      setEditRequestData({});
    } catch (err) {
      alert("Failed to update request.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (reqId: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    setLoading(true);
    try {
      const db = getDbClient();
      if (!db) return;
      await deleteDoc(doc(db, "bloodRequests", reqId));
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
    } catch (err) {
      alert("Failed to delete request.");
    } finally {
      setLoading(false);
    }
  };

  // --- CSV Export ---
  const exportCSV = (data: any[], filename: string, headers: string[]) => {
    if (!data || data.length === 0) return;
    const csv = [
      headers.join(","),
      ...data.map((item) =>
        headers
          .map((h) => {
            let value = item[h] === undefined || item[h] === null ? "" : String(item[h]);
            if (value.includes(",") || value.includes('"') || value.includes("\n")) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Render ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
        <div className="bg-white border border-gray-300 rounded-lg p-8 max-w-md w-full shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Admin Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <HeroHeader />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalDonors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Receivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalReceivers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.openRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fulfilled Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.fulfilledRequests}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Donors by Blood Group</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {Object.entries(stats.donorsByBloodGroup).map(([group, count]) => (
                <li key={group}>
                  {group}: {count}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Requests by Blood Group</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {Object.entries(stats.requestsByBloodGroup).map(([group, count]) => (
                <li key={group}>
                  {group}: {count}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Requests by Urgency</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {Object.entries(stats.requestsByUrgency).map(([urgency, count]) => (
                <li key={urgency}>
                  {urgency}: {count}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Blood Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.bloodGroup}</TableCell>
                    <TableCell>{request.city}</TableCell>
                    <TableCell>{request.urgency}</TableCell>
                    <TableCell>{request.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* --- User Management Table --- */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            User Management
            <button
              onClick={() =>
                exportCSV(
                  users,
                  "users.csv",
                  ["id", "name", "email", "role", "bloodGroup", "city", "state"]
                )
              }
              className="ml-4 bg-green-600 text-white px-2 py-1 rounded"
            >
              Export Users (CSV)
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) =>
                editUserId === user.id ? (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        name="name"
                        value={editUserData.name || ""}
                        onChange={handleEditUserChange}
                        className="border px-2 py-1 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        name="email"
                        value={editUserData.email || ""}
                        onChange={handleEditUserChange}
                        className="border px-2 py-1 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <select
                        name="role"
                        value={editUserData.role || ""}
                        onChange={handleEditUserChange}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="donor">Donor</option>
                        <option value="receiver">Receiver</option>
                        <option value="admin">Admin</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <input
                        name="bloodGroup"
                        value={editUserData.bloodGroup || ""}
                        onChange={handleEditUserChange}
                        className="border px-2 py-1 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        name="city"
                        value={editUserData.city || ""}
                        onChange={handleEditUserChange}
                        className="border px-2 py-1 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        name="state"
                        value={editUserData.state || ""}
                        onChange={handleEditUserChange}
                        className="border px-2 py-1 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={handleSaveUser}
                        disabled={loading}
                        className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditUserId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.bloodGroup}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>{user.state}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={loading}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- Blood Request Management Table --- */}
      <Card>
        <CardHeader>
          <CardTitle>
            Blood Request Management
            <button
              onClick={() =>
                exportCSV(
                  requests,
                  "requests.csv",
                  ["id", "bloodGroup", "city", "urgency", "status", "createdAt"]
                )
              }
              className="ml-4 bg-green-600 text-white px-2 py-1 rounded"
            >
              Export Requests (CSV)
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Group</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) =>
                editRequestId === req.id ? (
                  <TableRow key={req.id}>
                    <TableCell>
                      <input
                        name="bloodGroup"
                        value={editRequestData.bloodGroup || ""}
                        onChange={handleEditRequestChange}
                        className="border px-2 py-1 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        name="city"
                        value={editRequestData.city || ""}
                        onChange={handleEditRequestChange}
                        className="border px-2 py-1 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        name="urgency"
                        value={editRequestData.urgency || ""}
                        onChange={handleEditRequestChange}
                        className="border px-2 py-1 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <select
                        name="status"
                        value={editRequestData.status || ""}
                        onChange={handleEditRequestChange}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="open">Open</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      {req.createdAt ? new Date(req.createdAt).toLocaleString() : ""}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={handleSaveRequest}
                        disabled={loading}
                        className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditRequestId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={req.id}>
                    <TableCell>{req.bloodGroup}</TableCell>
                    <TableCell>{req.city}</TableCell>
                    <TableCell>{req.urgency}</TableCell>
                    <TableCell>{req.status}</TableCell>
                    <TableCell>
                      {req.createdAt ? new Date(req.createdAt).toLocaleString() : ""}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleEditRequest(req)}
                        className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(req.id)}
                        disabled={loading}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}