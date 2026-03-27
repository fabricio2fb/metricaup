import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Buscar Plataformas
    const { data: platforms, error: pError } = await supabase
      .from('platforms')
      .select('*')
      .order('order', { ascending: true });

    if (pError) throw pError;

    // 2. Buscar Serviços
    const { data: services, error: sError } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });

    if (sError) throw sError;

    // 3. Buscar Variantes
    const { data: variants, error: vError } = await supabase
      .from('service_variants')
      .select('*')
      .order('order', { ascending: true });

    if (vError) throw vError;

    // 4. Estruturar Dados no Formato Esperado pelo Frontend
    const structured: Record<string, any> = {};

    platforms.forEach((p: any) => {
      structured[p.id] = {
        name: p.name,
        emoji: p.emoji,
        logo_svg: p.logo_svg,
        desc: p.description,
        gradient: p.gradient,
        services: services
          .filter((s: any) => s.platform_id === p.id)
          .map((s: any) => ({
            id: s.id,
            cat: s.category,
            name: s.name,
            desc: s.description,
            icon: s.icon,
            iconBg: s.icon_bg,
            iconColor: s.icon_color,
            badges: s.badges || [],
            qtys: variants
              .filter((v: any) => v.service_id === s.id)
              .map((v: any) => ({ q: v.qty, p: Number(v.price) }))
          }))
      };
    });

    return NextResponse.json(structured);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
