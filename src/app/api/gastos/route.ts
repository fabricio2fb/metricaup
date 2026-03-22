import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .order('data', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ads = Number(body.ads) || 0;
    const plataforma = Number(body.plataforma) || 0;
    const data = body.data || new Date().toISOString().split('T')[0];

    const { error, data: insertedData } = await supabase
      .from('gastos')
      .insert([{ ads, plataforma, data }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ success: true, gasto: insertedData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
