import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST — salvar nova subscription
export async function POST(req: NextRequest) {
  try {
    const { subscription } = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Subscription inválida' }, { status: 400 });
    }

    // Upsert por endpoint para não duplicar
    const { error } = await supabaseAdmin
      .from('push_subscriptions')
      .upsert({ subscription, endpoint: subscription.endpoint }, { onConflict: 'endpoint' });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar subscription:', err);
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }
}

// DELETE — remover subscription
export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', endpoint);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
