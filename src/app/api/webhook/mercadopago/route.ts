import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { sendUTMifyEvent } from '@/lib/utmify';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

const STATUS_MAP: Record<string, string> = {
  approved: 'Aprovado',
  pending: 'Aguardando Pagamento',
  in_process: 'Em Processamento',
  rejected: 'Cancelado',
  cancelled: 'Cancelado',
  refunded: 'Cancelado',
};

async function sendPushNotification(title: string, body: string) {
  try {
    await fetch('https://www.metricaup.shop/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url: '/admin' }),
    });
  } catch (err) {
    console.error('Webhook: erro ao enviar push:', err);
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const paymentId = body.data.id;

    let mpData;
    try {
      mpData = await payment.get({ id: Number(paymentId) });
    } catch {
      console.log(`Webhook: pagamento ${paymentId} não encontrado no MP (pode ser teste)`);
      return NextResponse.json({ received: true, note: 'payment not found' }, { status: 200 });
    }

    if (!mpData?.status) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const novoStatus = STATUS_MAP[mpData.status] || 'Aguardando Pagamento';

    const { error } = await supabase
      .from('pedidos')
      .update({ status: novoStatus })
      .eq('mp_id', String(paymentId));

    if (error) {
      console.error('Webhook: erro ao atualizar Supabase:', error.message);
    } else {
      console.log(`Webhook: pedido mp_id=${paymentId} → ${novoStatus}`);
    }

    if (mpData.status === 'approved') {
      const amount = mpData.transaction_amount
        ? `R$ ${Number(mpData.transaction_amount).toFixed(2).replace('.', ',')}`
        : '';

      await sendPushNotification(
        '💰 Pagamento Aprovado!',
        `Novo pedido confirmado${amount ? ' — ' + amount : ''}. Acesse o painel para ver os detalhes.`
      );

      // 🚀 UTMify — Registrar venda aprovada com as UTMs originais
      const { data: pedido } = await supabase
        .from('pedidos')
        .select('*')
        .eq('mp_id', String(paymentId))
        .single();

      if (pedido) {
        await sendUTMifyEvent({
          orderId: pedido.id,
          status: 'paid',
          email: pedido.email,
          phone: pedido.whatsapp,
          totalPrice: Number(pedido.val),
          productName: pedido.service,
          qty: Number(pedido.qty),
          utmParams: {
            source: pedido.utm_source,
            medium: pedido.utm_medium,
            campaign: pedido.utm_campaign,
            content: pedido.utm_content,
            term: pedido.utm_term
          }
        });
      }
    }

    return NextResponse.json({ received: true, status: novoStatus }, { status: 200 });
  } catch (err) {
    console.error('Webhook erro inesperado:', err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}