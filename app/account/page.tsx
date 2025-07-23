import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account | Physical Store',
  description: 'Manage your account settings and preferences',
}

/**
 * Account page that redirects to sign-in if not authenticated
 * or to dashboard if authenticated
 */
export default async function AccountPage() {
  const user = await currentUser()
  
  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/account/sign-in')
  }
}