import { NextRequest, NextResponse } from 'next/server'

// Minimal admin session creation for demo/admin use only.
// In real deployment, integrate with Supabase Auth and set cookie after verifying is_admin().

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => ({}))
    const token = typeof body?.token === 'string' ? body.token : null
    // Accept any non-empty token in dev; require exact shared secret in prod
    const secret = process.env.ADMIN_SHARED_SECRET
    // If no secret configured in prod, fall back to accepting any non-empty token
    const isDev = process.env.NODE_ENV !== 'production'
    const valid = isDev ? !!token : (secret ? token === secret : !!token)
    if (!valid) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', '1', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60, // 1 hour
    })
    return res
}

export async function DELETE() {
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', '', { path: '/', maxAge: 0 })
    return res
}


