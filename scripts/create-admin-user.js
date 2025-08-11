/*
  One-off script to create the initial admin user in Supabase Auth.
  Usage:
    NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-admin-user.js
*/
const { createClient } = require('@supabase/supabase-js')

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env')
  }
  const adminEmail = process.env.ADMIN_EMAIL || 'mhcottonclothbd@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD || '2hHJ*FIlLdc2*+Mjd31-31hzff'

  const admin = createClient(supabaseUrl, serviceKey)

  // Check if user exists
  const { data: existing, error: listErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  })
  if (listErr) throw listErr
  const found = existing.users?.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase())
  if (found) {
    console.log('Admin user already exists:', found.id)
    // Ensure metadata is_admin = true
    await admin.auth.admin.updateUserById(found.id, {
      user_metadata: { ...(found.user_metadata || {}), is_admin: true },
      email_confirm: true,
    })
    console.log('Ensured is_admin metadata set and email confirmed')
    return
  }

  // Create user
  const { data: created, error } = await admin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { is_admin: true, role: 'admin' },
  })
  if (error) throw error
  console.log('Admin user created:', created.user?.id)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


