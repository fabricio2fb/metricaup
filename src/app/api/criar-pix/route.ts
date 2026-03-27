import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { sendAdminNotification } from '@/lib/push';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: NextRequest) {
  try {
    const { id, email, whatsapp, link, service, platform, qty, val } = await req.json();

    const body = {
      transaction_amount: Number(val),
      description: `Servico digital #ORD-${id}`,
      payment_method_id: 'pix',
      payer: { email, identification: { type: 'CPF', number: '00000000000' } },
      installments: 1,
    };

    const mpResponse = await payment.create({ body });
    const pixData = {
      mp_id: String(mpResponse.id),
      pix_qr_text: mpResponse.point_of_interaction?.transaction_data?.qr_code || '',
      pix_qr_base64: mpResponse.point_of_interaction?.transaction_data?.qr_code_base64 || '',
      expiracao: mpResponse.date_of_expiration,
      status: 'Aguardando Pagamento',
    };

    const { error } = await supabase.from('pedidos').insert([{ id, email, whatsapp, link, service, platform, qty, val, ...pixData }]);
    if (error) throw error;

    // 🔔 Push — novo pedido pendente entrando
    await sendAdminNotification(
      '⏳ Novo Pedido Aguardando Pagamento',
      `${service} — R$ ${Number(val).toFixed(2).replace('.', ',')} · ${email}`
    );

    return NextResponse.json({
      payment_id: mpResponse.id,
      qr_code_base64: pixData.pix_qr_base64,
      qr_code_texto: pixData.pix_qr_text,
      expiracao: pixData.expiracao,
    });
  } catch (err: unknown) {
    console.error('Erro ao criar Pix:', err);
    return NextResponse.json({ error: 'Erro ao gerar PIX. Verifique o token do MP.' }, { status: 500 });
  }
}
