import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found, return default
      return NextResponse.json({ ads: 0, plataforma: 0 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ads = Number(body.ads) || 0;
  const plataforma = Number(body.plataforma) || 0;

  const { error } = await supabase
    .from('gastos')
    .upsert({
      id: 1,
      ads,
      plataforma,
      updated_at: new Date().toISOString(),
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true, ads, plataforma });
}
