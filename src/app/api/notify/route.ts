import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { title, body, url } = await req.json();

    // Buscar todas as subscriptions salvas
    const { data: subs, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('subscription');

    if (error || !subs || subs.length === 0) {
      return NextResponse.json({ sent: 0, note: 'Nenhuma subscription encontrada' });
    }

    const payload = JSON.stringify({
      title: title || '📦 Novo Pedido — MetricaUp',
      body: body || 'Um novo pedido foi recebido!',
      url: url || '/admin',
    });

    let sent = 0;
    const failed: string[] = [];

    await Promise.all(
      subs.map(async (row) => {
        try {
          await webpush.sendNotification(row.subscription, payload);
          sent++;
        } catch (err: unknown) {
          const e = err as { statusCode?: number };
          // Subscription expirada — remover
          if (e.statusCode === 404 || e.statusCode === 410) {
            failed.push(JSON.stringify(row.subscription.endpoint));
          }
        }
      })
    );

    // Limpar subscriptions mortas
    if (failed.length > 0) {
      for (const endpoint of failed) {
        await supabaseAdmin
          .from('push_subscriptions')
          .delete()
          .eq('subscription->>endpoint', endpoint.replace(/^"|"$/g, ''));
      }
    }

    return NextResponse.json({ sent, failed: failed.length });
  } catch (err) {
    console.error('Erro ao enviar notificação push:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
