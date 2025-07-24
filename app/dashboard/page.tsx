import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import DashboardContent from './widget/DashboardContent'
import { getUserOrders, calculateDashboardStats } from '@/lib/database'

export const metadata: Metadata = {
  title: 'Dashboard | Physical Store',
  description: 'Manage your account, orders, and preferences',
}

/**
 * Protected dashboard page for authenticated users
 * Redirects to sign-in if not authenticated
 */
export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/account/sign-in')
  }
  
  // Serialize user data to pass to client component
  const serializedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddresses: user.emailAddresses.map(email => ({
      emailAddress: email.emailAddress,
      id: email.id
    })),
    imageUrl: user.imageUrl,
    createdAt: user.createdAt || Date.now(),
    lastSignInAt: user.lastSignInAt || null
  }
  
  // Fetch user orders and calculate stats
  const orders = await getUserOrders(user.id)
  const stats = calculateDashboardStats(orders)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardContent 
        user={serializedUser} 
        orders={orders}
        stats={stats}
      />
    </div>
  )
}