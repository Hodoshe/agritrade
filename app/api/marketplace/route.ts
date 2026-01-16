import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, subscription_plan')

    return NextResponse.json({ products: products || [], profiles: profiles || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
