import { Metadata } from "next";
import AdminDashboard from "./components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Physical Store",
  description:
    "Comprehensive admin dashboard for managing your e-commerce store",
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
