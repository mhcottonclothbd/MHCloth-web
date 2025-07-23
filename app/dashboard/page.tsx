import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import DashboardContent from './widget/DashboardContent'

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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardContent user={user} />
    </div>
  )
}