import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const settings: Record<string, string> = {}
  for (const row of data || []) {
    settings[row.key] = row.value
  }
  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const updates = body as Record<string, string>

    const upsertData = Object.entries(updates).map(([key, value]) => ({
      key,
      value: String(value ?? ''),
    }))

    const { error } = await supabase.from('site_settings').upsert(upsertData, {
      onConflict: 'key',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
