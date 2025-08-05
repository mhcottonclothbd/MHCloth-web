import { Metadata } from 'next'
import { AdminDashboard } from './components/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - MHCloth',
  description: 'Comprehensive admin dashboard for managing your ecommerce store',
}

/**
 * Main admin dashboard page component
 * Renders the complete admin interface with all management features
 */
export default function AdminPage() {
  return <AdminDashboard />
}