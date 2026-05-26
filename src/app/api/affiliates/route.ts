import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEFAULT_COMMISSION_RATE = 0.10;
const ADMIN_TOKEN = 'f4b4ff99ed0fa4911366ad6dd8f1119149c671516cf2f83634807773680b9d32';

function sanitizeAffiliateCode(value: unknown) {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24);
}

function normalizeEmail(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function makeCode(name: string) {
  const base = sanitizeAffiliateCode(name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ''));
  return `${base || 'AFILIADO'}${Math.floor(Math.random() * 900 + 100)}`;
}

async function makeUniqueCode(name: string) {
  for (let i = 0; i < 8; i++) {
    const code = makeCode(name);
    const { data } = await supabase.from('affiliates').select('code').eq('code', code).maybeSingle();
    if (!data) return code;
  }
  return `AF${Date.now().toString(36).toUpperCase()}`;
}

async function getDashboard(code: string, email: string) {
  let query = supabase
    .from('affiliates')
    .select('*')
    .eq('email', email)
    .eq('active', true);

  if (code) query = query.eq('code', code);

  const { data: affiliate, error: affiliateError } = await query
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (affiliateError || !affiliate) {
    return { error: 'Afiliado não encontrado. Confira o e-mail informado.', status: 404 };
  }

  const affiliateCode = affiliate.code;
  const { data: orders, error: ordersError } = await supabase
    .from('pedidos')
    .select('id, service, val, status, affiliate_commission_value, affiliate_payment_status, affiliate_paid_at, created_at')
    .eq('affiliate_code', affiliateCode)
    .order('created_at', { ascending: false });

  if (ordersError) {
    return { error: ordersError.message, status: 500 };
  }

  const allOrders = orders || [];
  const approved = allOrders.filter((order: any) => order.status === 'Aprovado' || order.status === 'Entregue');
  const available = approved.filter((order: any) => order.affiliate_payment_status !== 'paid');
  const paid = approved.filter((order: any) => order.affiliate_payment_status === 'paid');
  const pending = allOrders.filter((order: any) => order.status === 'Aguardando Pagamento');

  return {
    affiliate,
    stats: {
      totalOrders: allOrders.length,
      approvedOrders: approved.length,
      pendingOrders: pending.length,
      revenue: approved.reduce((sum: number, order: any) => sum + Number(order.val || 0), 0),
      commission: available.reduce((sum: number, order: any) => sum + Number(order.affiliate_commission_value || 0), 0),
      paidCommission: paid.reduce((sum: number, order: any) => sum + Number(order.affiliate_commission_value || 0), 0),
      pendingCommission: pending.reduce((sum: number, order: any) => sum + Number(order.affiliate_commission_value || 0), 0),
    },
    orders: allOrders.slice(0, 8),
  };
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('admin') === '1') {
    if (req.headers.get('x-admin-token') !== ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { data: affiliates, error: affiliatesError } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (affiliatesError) {
      return NextResponse.json({ error: affiliatesError.message }, { status: 500 });
    }

    const { data: orders, error: ordersError } = await supabase
      .from('pedidos')
      .select('affiliate_code, val, status, affiliate_commission_value, affiliate_payment_status, affiliate_paid_at, created_at')
      .not('affiliate_code', 'is', null);

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    const enriched = (affiliates || []).map((affiliate: any) => {
      const affiliateOrders = (orders || []).filter((order: any) => order.affiliate_code === affiliate.code);
      const approved = affiliateOrders.filter((order: any) => order.status === 'Aprovado' || order.status === 'Entregue');
      const available = approved.filter((order: any) => order.affiliate_payment_status !== 'paid');
      const paid = approved.filter((order: any) => order.affiliate_payment_status === 'paid');
      const pending = affiliateOrders.filter((order: any) => order.status === 'Aguardando Pagamento');

      return {
        ...affiliate,
        stats: {
          totalOrders: affiliateOrders.length,
          approvedOrders: approved.length,
          pendingOrders: pending.length,
          revenue: approved.reduce((sum: number, order: any) => sum + Number(order.val || 0), 0),
          commission: available.reduce((sum: number, order: any) => sum + Number(order.affiliate_commission_value || 0), 0),
          paidCommission: paid.reduce((sum: number, order: any) => sum + Number(order.affiliate_commission_value || 0), 0),
          pendingCommission: pending.reduce((sum: number, order: any) => sum + Number(order.affiliate_commission_value || 0), 0),
        },
      };
    });

    return NextResponse.json(enriched);
  }

  const code = sanitizeAffiliateCode(req.nextUrl.searchParams.get('code'));
  const email = normalizeEmail(req.nextUrl.searchParams.get('email'));

  if (!email) {
    return NextResponse.json({ error: 'E-mail é obrigatório.' }, { status: 400 });
  }

  const result = await getDashboard(code, email);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = normalizeEmail(body.email);
    const whatsapp = String(body.whatsapp || '').trim();
    const pixKey = String(body.pixKey || '').trim();
    const code = await makeUniqueCode(name);

    if (!name || !email.includes('@') || !pixKey) {
      return NextResponse.json({ error: 'Nome, e-mail e chave PIX são obrigatórios.' }, { status: 400 });
    }

    const { error } = await supabase.from('affiliates').insert([{
      code,
      name,
      email,
      whatsapp,
      pix_key: pixKey,
      commission_rate: DEFAULT_COMMISSION_RATE,
      active: true,
    }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Este código de afiliado já está em uso.' }, { status: 409 });
      }
      throw error;
    }

    const result = await getDashboard(code, email);
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao cadastrar afiliado.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (req.headers.get('x-admin-token') !== ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await req.json();
    const code = sanitizeAffiliateCode(body.code);
    if (!code) {
      return NextResponse.json({ error: 'Código do afiliado é obrigatório.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('pedidos')
      .update({
        affiliate_payment_status: 'paid',
        affiliate_paid_at: new Date().toISOString(),
      })
      .eq('affiliate_code', code)
      .in('status', ['Aprovado', 'Entregue'])
      .or('affiliate_payment_status.is.null,affiliate_payment_status.neq.paid');

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao marcar comissão como paga.' }, { status: 500 });
  }
}
