import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const mpResponse = await payment.get({ id: Number(id) });
    return NextResponse.json({ status: mpResponse.status });
  } catch {
    return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 });
  }
}
