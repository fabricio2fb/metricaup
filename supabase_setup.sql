-- MetricaUp / segui - setup completo para Supabase
-- Rode este arquivo no SQL Editor do Supabase.
-- O app usa Next.js API Routes com SUPABASE_SERVICE_ROLE_KEY; por isso o RLS fica ativo
-- sem policies publicas de escrita/leitura nas tabelas operacionais.

begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.platforms (
  id text primary key,
  name text not null,
  emoji text not null default '',
  description text not null default '',
  gradient text not null default '',
  logo_svg text,
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  platform_id text not null references public.platforms(id) on delete cascade,
  category text not null,
  name text not null,
  description text not null default '',
  icon text not null default '',
  icon_bg text not null default '#f3f4f6',
  icon_color text not null default '#111827',
  badges text[] not null default '{}',
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_variants (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.services(id) on delete cascade,
  qty integer not null check (qty > 0),
  price numeric(10,2) not null check (price >= 0),
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, qty)
);

create table if not exists public.pedidos (
  id text primary key,
  email text not null,
  whatsapp text,
  link text not null,
  service text not null,
  platform text,
  qty integer not null check (qty > 0),
  val numeric(10,2) not null check (val >= 0),
  status text not null default 'Aguardando Pagamento',
  mp_id text,
  pix_qr_text text,
  pix_qr_base64 text,
  expiracao timestamptz,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  affiliate_code text,
  affiliate_commission_rate numeric(5,4) not null default 0,
  affiliate_commission_value numeric(10,2) not null default 0,
  affiliate_payment_status text not null default 'unpaid',
  affiliate_paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliates (
  code text primary key,
  name text,
  email text,
  whatsapp text,
  pix_key text,
  commission_rate numeric(5,4) not null default 0.10,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gastos (
  id uuid primary key default gen_random_uuid(),
  ads numeric(10,2) not null default 0 check (ads >= 0),
  plataforma numeric(10,2) not null default 0 check (plataforma >= 0),
  data date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Colunas de compatibilidade para bancos que ja tinham parte da estrutura.
alter table public.platforms add column if not exists logo_svg text;
alter table public.pedidos add column if not exists platform text;
alter table public.pedidos add column if not exists utm_source text;
alter table public.pedidos add column if not exists utm_medium text;
alter table public.pedidos add column if not exists utm_campaign text;
alter table public.pedidos add column if not exists utm_content text;
alter table public.pedidos add column if not exists utm_term text;
alter table public.pedidos add column if not exists affiliate_code text;
alter table public.pedidos add column if not exists affiliate_commission_rate numeric(5,4) not null default 0;
alter table public.pedidos add column if not exists affiliate_commission_value numeric(10,2) not null default 0;
alter table public.pedidos add column if not exists affiliate_payment_status text not null default 'unpaid';
alter table public.pedidos add column if not exists affiliate_paid_at timestamptz;

create index if not exists idx_platforms_order on public.platforms ("order");
create index if not exists idx_services_platform_order on public.services (platform_id, "order");
create index if not exists idx_service_variants_service_order on public.service_variants (service_id, "order");
create index if not exists idx_pedidos_created_at on public.pedidos (created_at desc);
create index if not exists idx_pedidos_email on public.pedidos (email);
create index if not exists idx_pedidos_mp_id on public.pedidos (mp_id);
create index if not exists idx_pedidos_platform on public.pedidos (platform);
create index if not exists idx_pedidos_affiliate_code on public.pedidos (affiliate_code);
create index if not exists idx_pedidos_affiliate_payment_status on public.pedidos (affiliate_payment_status);
create index if not exists idx_affiliates_active on public.affiliates (active);
create index if not exists idx_gastos_data_created_at on public.gastos (data desc, created_at desc);
create index if not exists idx_push_subscriptions_endpoint on public.push_subscriptions (endpoint);

drop trigger if exists trg_platforms_updated_at on public.platforms;
create trigger trg_platforms_updated_at
before update on public.platforms
for each row execute function public.set_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists trg_service_variants_updated_at on public.service_variants;
create trigger trg_service_variants_updated_at
before update on public.service_variants
for each row execute function public.set_updated_at();

drop trigger if exists trg_pedidos_updated_at on public.pedidos;
create trigger trg_pedidos_updated_at
before update on public.pedidos
for each row execute function public.set_updated_at();

drop trigger if exists trg_affiliates_updated_at on public.affiliates;
create trigger trg_affiliates_updated_at
before update on public.affiliates
for each row execute function public.set_updated_at();

drop trigger if exists trg_gastos_updated_at on public.gastos;
create trigger trg_gastos_updated_at
before update on public.gastos
for each row execute function public.set_updated_at();

drop trigger if exists trg_push_subscriptions_updated_at on public.push_subscriptions;
create trigger trg_push_subscriptions_updated_at
before update on public.push_subscriptions
for each row execute function public.set_updated_at();

alter table public.platforms enable row level security;
alter table public.services enable row level security;
alter table public.service_variants enable row level security;
alter table public.pedidos enable row level security;
alter table public.affiliates enable row level security;
alter table public.gastos enable row level security;
alter table public.push_subscriptions enable row level security;

-- Seed base das plataformas usadas pelo frontend/admin.
insert into public.platforms (id, name, emoji, description, gradient, logo_svg, "order")
values
  (
    'instagram',
    'Instagram',
    '📸',
    'Seguidores, curtidas, views, reels e stories para crescer com prova social.',
    'linear-gradient(135deg, #7c3aed 0%, #ef4444 55%, #f59e0b 100%)',
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.061 1.365-.333 2.632-1.308 3.607-.975.975-2.242 1.247-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.365-.061-2.632-.333-3.607-1.308-.975-.975-1.247-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.247 3.608-1.308 1.266-.058 1.645-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    1
  ),
  (
    'tiktok',
    'TikTok',
    '🎵',
    'Views, curtidas e engajamento para videos e perfis no TikTok.',
    'linear-gradient(135deg, #030712 0%, #111827 55%, #7f1d1d 100%)',
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.417 6.417 0 01-1.87-1.49v6.52c-.03 2.1-.79 4.21-2.3 5.79-1.88 1.88-4.7 2.41-7.1 1.34-2.58-1.02-4.22-3.83-3.86-6.6.14-1.93 1.3-3.79 3.03-4.66 1.04-.54 2.22-.72 3.39-.54V13.1c-.88-.16-1.82-.04-2.6.4-.85.45-1.44 1.37-1.5 2.33-.14 1.25.68 2.5 1.84 2.92 1.22.46 2.7.2 3.6-.66.68-.7 1.04-1.68 1.02-2.65V.02z"/></svg>',
    2
  ),
  (
    'facebook',
    'Facebook',
    '👥',
    'Servicos digitais para paginas, publicacoes e videos no Facebook.',
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    3
  ),
  (
    'kwai',
    'Kwai',
    '🎬',
    'Impulsionamento para videos e perfis no Kwai.',
    'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 17h-8v-10h8v10z"/></svg>',
    4
  )
on conflict (id) do update set
  name = excluded.name,
  emoji = excluded.emoji,
  description = excluded.description,
  gradient = excluded.gradient,
  logo_svg = excluded.logo_svg,
  "order" = excluded."order",
  updated_at = now();

-- Opcional: cadastre os servicos/valores reais pelo painel /admin.
-- Exemplo de formato para um servico:
-- insert into public.services (id, platform_id, category, name, description, icon, icon_bg, icon_color, badges, "order")
-- values ('instagram-seguidores', 'instagram', 'seguidores', 'Seguidores Instagram', 'Seguidores para perfil publico.', '🌍', '#fce7f3', '#db2777', array['popular'], 1)
-- on conflict (id) do update set name = excluded.name;
--
-- insert into public.service_variants (service_id, qty, price, "order")
-- values ('instagram-seguidores', 1000, 29.90, 1)
-- on conflict (service_id, qty) do update set price = excluded.price, "order" = excluded."order";

commit;
