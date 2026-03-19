import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';

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
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `https://${process.env.VERCEL_URL || 'metricaup.vercel.app'}`
      : 'http://localhost:3000';

    await fetch(`${baseUrl}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url: '/admin' }),
    });
  } catch (err) {
    console.error('Webhook: erro ao enviar push:', err);
  }
}

export async function POST(req: NextRequest) {
  // IMPORTANTE: sempre retornar 200 para o MP parar de reenviar
  try {
    const body = await req.json();

    // Ignorar notificações que não são de pagamento
    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const paymentId = body.data.id;

    // Buscar o pagamento no Mercado Pago
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

    // Atualizar no Supabase pelo mp_id
    const { error } = await supabase
      .from('pedidos')
      .update({ status: novoStatus })
      .eq('mp_id', String(paymentId));

    if (error) {
      console.error('Webhook: erro ao atualizar Supabase:', error.message);
    } else {
      console.log(`Webhook: pedido mp_id=${paymentId} → ${novoStatus}`);
    }

    // 🔔 Disparar push notification quando pagamento for aprovado
    if (mpData.status === 'approved') {
      const amount = mpData.transaction_amount
        ? `R$ ${Number(mpData.transaction_amount).toFixed(2).replace('.', ',')}`
        : '';
      await sendPushNotification(
        '💰 Pagamento Aprovado!',
        `Novo pedido confirmado${amount ? ' — ' + amount : ''}. Acesse o painel para ver os detalhes.`
      );
    }

    return NextResponse.json({ received: true, status: novoStatus }, { status: 200 });
  } catch (err) {
    console.error('Webhook erro inesperado:', err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
