import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const { data: requests } = await supabaseAdmin
      .from('payment_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (!requests) {
      return NextResponse.json({ payments: [] })
    }

    const userIds = Array.from(new Set(requests.map(r => r.user_id)))
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds)

    const paymentsWithUsers = requests.map(r => ({
      ...r,
      user_email: profiles?.find(p => p.id === r.user_id)?.email || 'Unknown',
      user_name: profiles?.find(p => p.id === r.user_id)?.full_name || 'Unknown'
    }))

    return NextResponse.json({ payments: paymentsWithUsers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, requestId, userId, plan } = await request.json()

    if (action === 'approve') {
      const listings = plan === 'starter' ? 10 : plan === 'professional' ? 50 : 1

      await supabaseAdmin
        .from('profiles')
        .update({ subscription_plan: plan, listings_remaining: listings })
        .eq('id', userId)

      await supabaseAdmin
        .from('payment_requests')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', requestId)

      return NextResponse.json({ success: true })
    }

    if (action === 'reject') {
      await supabaseAdmin
        .from('payment_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
