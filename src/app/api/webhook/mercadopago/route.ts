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
    await fetch('https://www.metricaup.shop/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url: '/admin' }),
    });
  } catch (err) {
    console.error('Webhook: erro ao enviar push:', err);
  }
}

async function sendToUtmify(paymentId: string | number, mpData: any) {
  try {
    await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'x-api-token': process.env.UTMIFY_API_TOKEN || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: String(paymentId),
        status: 'paid',
        customerName: mpData.payer?.first_name || 'Cliente',
        customerEmail: mpData.payer?.email || '',
        customerPhone: mpData.payer?.phone?.number || '',
        totalPrice: mpData.transaction_amount,
        paymentMethod: mpData.payment_type_id === 'credit_card' ? 'credit_card' : 'pix',
        items: [
          {
            title: mpData.description || 'Pedido Apoiêfy',
            quantity: 1,
            unitPrice: mpData.transaction_amount,
          },
        ],
      }),
    });
    console.log(`UTMify: venda registrada — mp_id=${paymentId}`);
  } catch (err) {
    console.error('UTMify: erro ao registrar venda:', err);
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

      await sendToUtmify(paymentId, mpData);
    }

    return NextResponse.json({ received: true, status: novoStatus }, { status: 200 });
  } catch (err) {
    console.error('Webhook erro inesperado:', err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}