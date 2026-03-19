import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP envia notificações de tipo "payment"
    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;
    const mpData = await payment.get({ id: Number(paymentId) });

    if (!mpData || !mpData.id) {
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 });
    }

    // Mapear status do MP para o status do sistema
    const statusMap: Record<string, string> = {
      approved: 'Aprovado',
      pending: 'Aguardando Pagamento',
      in_process: 'Em Processamento',
      rejected: 'Cancelado',
      cancelled: 'Cancelado',
      refunded: 'Cancelado',
    };
    const novoStatus = statusMap[mpData.status || ''] || 'Aguardando Pagamento';

    // Atualizar o pedido no Supabase usando o mp_id
    const { error } = await supabase
      .from('pedidos')
      .update({ status: novoStatus })
      .eq('mp_id', String(paymentId));

    if (error) {
      console.error('Erro ao atualizar pedido via webhook:', error);
    }

    return NextResponse.json({ ok: true, status: novoStatus });
  } catch (err) {
    console.error('Erro no webhook MP:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
