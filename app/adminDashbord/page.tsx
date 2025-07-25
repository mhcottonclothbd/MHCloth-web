import { Metadata } from "next";
import AdminDashboard from "./components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | MHCloth",
  description: "Admin panel for managing products, orders, and users",
};

/**
 * Admin Dashboard Page
 * Main entry point for the admin dashboard with comprehensive store management features
 */
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  );
}
