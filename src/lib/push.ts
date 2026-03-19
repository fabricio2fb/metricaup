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

export async function sendAdminNotification(title: string, body: string, url: string = '/admin') {
  try {
    const { data: subs, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('subscription');

    if (error || !subs || subs.length === 0) {
      console.log('Push: Nenhuma inscrição encontrada no Supabase.');
      return { sent: 0 };
    }

    const payload = JSON.stringify({ title, body, url });
    let sent = 0;
    const failed: string[] = [];

    await Promise.all(
      subs.map(async (row: any) => {
        try {
          await webpush.sendNotification(row.subscription, payload);
          sent++;
        } catch (err: any) {
          if (err.statusCode === 404 || err.statusCode === 410) {
            failed.push(row.subscription.endpoint);
          }
        }
      })
    );

    if (failed.length > 0) {
      for (const endpoint of failed) {
        await supabaseAdmin
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', endpoint);
      }
    }

    return { sent, failed: failed.length };
  } catch (err) {
    console.error('Push: Erro crítico ao enviar:', err);
    return { error: err };
  }
}
