"use client";

import { useState } from "react";

// Mock data for demonstration
const mockStats = {
  totalDonors: 150,
  totalReceivers: 200,
  openRequests: 45,
  fulfilledRequests: 155
};

export default function AdminDashboardPage() {
  const [stats] = useState(mockStats);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-muted-foreground mb-2">Total Donors</h3>
          <p className="text-3xl font-bold">{stats.totalDonors}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-muted-foreground mb-2">Total Receivers</h3>
          <p className="text-3xl font-bold">{stats.totalReceivers}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-muted-foreground mb-2">Open Requests</h3>
          <p className="text-3xl font-bold">{stats.openRequests}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-muted-foreground mb-2">Fulfilled Requests</h3>
          <p className="text-3xl font-bold">{stats.fulfilledRequests}</p>
        </div>
      </div>

      {/* Placeholder message */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Database Integration Required</h2>
        <p className="text-muted-foreground">
          This admin dashboard requires a database integration to display real data.
          Please implement your preferred database solution to enable full functionality.
        </p>
      </div>
    </div>
  );
}