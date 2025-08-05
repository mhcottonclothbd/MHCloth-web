import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guest Shopping | MHCloth',
  description: 'Shop as a guest - no account required for easy shopping experience',
}

/**
 * Account page that redirects to guest shopping information
 * Since we removed authentication, all users are guests
 */
export default async function AccountPage() {
  // Redirect to guest shopping info page
  redirect('/account/sign-in')
}