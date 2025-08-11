import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 })
    }

    // Only one admin allowed via env configuration
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase()
    const adminPassword = process.env.ADMIN_PASSWORD || ''
    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ success: false, error: 'Server not configured' }, { status: 500 })
    }

    if (email.toLowerCase() !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // Optional: IP-based OTP gate for new IPs
    const requireOtp = process.env.ADMIN_REQUIRE_OTP === '1'
    if (requireOtp) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') || 'unknown'
      const known = process.env.ADMIN_WHITELIST_IPS?.split(',').map((s) => s.trim()).filter(Boolean) || []
      if (!known.includes(ip)) {
        // Issue a short-lived challenge cookie and signal client to request OTP
        const res = NextResponse.json({ success: false, otpRequired: true })
        res.cookies.set('admin_otp_pending', '1', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV==='production', path: '/', maxAge: 300 })
        return res
      }
    }

    // Set admin session cookie
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    })
    return res
  } catch (err: any) {
    console.error('Admin login error:', err)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}


