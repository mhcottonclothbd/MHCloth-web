import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!code) return NextResponse.json({ success: false, error: 'Missing code' }, { status: 400 })
    const expected = process.env.ADMIN_OTP_CODE
    if (!expected) return NextResponse.json({ success: false, error: 'Server not configured' }, { status: 500 })
    if (code !== expected) return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 401 })

    // Promote to admin session (if OTP pending cookie exists)
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    })
    res.cookies.set('admin_otp_pending', '', { path: '/', maxAge: 0 })
    return res
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}


