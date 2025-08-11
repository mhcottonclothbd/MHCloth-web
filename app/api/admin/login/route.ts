import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ success: false, error: 'Server not configured' }, { status: 500 })
    }

    // 1) Sign in via Supabase Auth using anon client
    const supabaseAnon = createClient(supabaseUrl, anonKey)
    const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({ email, password })
    if (signInError || !signInData?.session) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // 2) Verify is_admin via service role
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 })
    if (listErr) {
      return NextResponse.json({ success: false, error: 'Auth service unavailable' }, { status: 503 })
    }
    const found = list.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (!found || !found.user_metadata?.is_admin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // 3) Set cookies
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', '1', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    })
    const { access_token, refresh_token, expires_at } = signInData.session
    const ttl = Math.max(1, (expires_at ?? Math.floor(Date.now() / 1000) + 3600) - Math.floor(Date.now() / 1000))
    res.cookies.set('sb-access-token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ttl,
    })
    if (refresh_token) {
      res.cookies.set('sb-refresh-token', refresh_token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }
    return res
  } catch (err: any) {
    console.error('Admin login error:', err)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}


