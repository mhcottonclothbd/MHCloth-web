import { redirect } from 'next/navigation'

/**
 * Root page that redirects to home
 * This maintains clean URL structure while using individual route folders
 */
export default function RootPage() {
  redirect('/home')
}
