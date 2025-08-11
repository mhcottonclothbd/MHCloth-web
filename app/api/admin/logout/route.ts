import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  // Clear admin gate and Supabase cookies
  res.cookies.set('admin_session', '', { path: '/', maxAge: 0 })
  res.cookies.set('sb-access-token', '', { path: '/', maxAge: 0 })
  res.cookies.set('sb-refresh-token', '', { path: '/', maxAge: 0 })
  return res
}


