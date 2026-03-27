import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: platforms, error: pErr } = await supabase.from('platforms').select('*').order('order');
    if (pErr) throw pErr;

    const { data: services, error: sErr } = await supabase.from('services').select('*').order('order');
    if (sErr) throw sErr;

    const { data: variants, error: vErr } = await supabase.from('service_variants').select('*').order('order');
    if (vErr) throw vErr;

    return NextResponse.json({ platforms, services, variants });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { type, id, data } = await req.json();

    if (type === 'service') {
      const { error } = await supabase.from('services').update(data).eq('id', id);
      if (error) throw error;
    } else if (type === 'variant') {
      const { error } = await supabase.from('service_variants').update(data).eq('id', id);
      if (error) throw error;
    } else if (type === 'delete_variant') {
      const { error } = await supabase.from('service_variants').delete().eq('id', id);
      if (error) throw error;
    } else if (type === 'add_variant') {
      const { error } = await supabase.from('service_variants').insert([data]);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
