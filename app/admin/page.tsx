import { AdminDashboard } from "@/app/admin/components/AdminDashboard";
import AdminLogin from "@/app/admin/components/AdminLogin";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Admin Dashboard - MHCloth",
  description:
    "Comprehensive admin dashboard for managing your ecommerce store",
};

// Ensure no caching so cookie checks always run on the server
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Main admin dashboard page component
 * Renders the complete admin interface with all management features
 */
export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminGate = cookieStore.get("admin_session")?.value === "1";
  const accessToken = cookieStore.get("sb-access-token")?.value;

  // Allow access if either admin_session or sb-access-token is present
  if (!adminGate && !accessToken) {
    return <AdminLogin />;
  }

  // Proceed based on cookie gate only; API routes/middleware enforce admin for mutations

  return <AdminDashboard />;
}
