"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { getDbClient } from "@/lib/firebase";
import type { BloodRequest, DonorProfile, User } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalReceivers: 0,
    openRequests: 0,
    fulfilledRequests: 0,
    donorsByBloodGroup: {} as Record<string, number>,
    requestsByBloodGroup: {} as Record<string, number>,
    requestsByUrgency: {} as Record<string, number>,
  });
  const [recentRequests, setRecentRequests] = useState<BloodRequest[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const db = getDbClient();
      if (!db) return;

      // Fetch total donors
      const donorsSnapshot = await getDocs(collection(db, "donors"));
      const totalDonors = donorsSnapshot.size;
      const donorsData = donorsSnapshot.docs.map((doc) => doc.data() as DonorProfile);

      // Fetch total receivers (assuming users with role "receiver" are receivers)
      const receiversQuery = query(collection(db, "users"), where("role", "==", "receiver"));
      const receiversSnapshot = await getDocs(receiversQuery);
      const totalReceivers = receiversSnapshot.size;

      // Fetch blood requests
      const requestsSnapshot = await getDocs(collection(db, "bloodRequests"));
      const allRequests = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(), // Convert Firestore Timestamp to Date
      })) as BloodRequest[];
      const openRequests = allRequests.filter((req) => req.status === "open").length;
      const fulfilledRequests = allRequests.filter((req) => req.status === "fulfilled").length;

      // Calculate donors by blood group
      const donorsByBloodGroup = donorsData.reduce((acc, donor) => {
        if (donor.bloodGroup) {
          acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Calculate requests by blood group and urgency
      const requestsByBloodGroup = allRequests.reduce((acc, req) => {
        acc[req.bloodGroup] = (acc[req.bloodGroup] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const requestsByUrgency = allRequests.reduce((acc, req) => {
        acc[req.urgency] = (acc[req.urgency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        totalDonors,
        totalReceivers,
        openRequests,
        fulfilledRequests,
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
        createdAt: doc.data().createdAt.toDate(),
      })) as BloodRequest[];
      setRecentRequests(recentRequestsData);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
}
