import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/push';

export async function POST(req: NextRequest) {
  try {
    const { title, body, url } = await req.json();
    const result = await sendAdminNotification(title, body, url);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Erro ao enviar notificação push:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
