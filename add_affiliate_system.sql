-- Sistema inicial de afiliados para o MetricaUp.
-- Rode no SQL Editor do Supabase se o banco ja existe.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

alter table public.pedidos add column if not exists affiliate_code text;
alter table public.pedidos add column if not exists affiliate_commission_rate numeric(5,4) not null default 0;
alter table public.pedidos add column if not exists affiliate_commission_value numeric(10,2) not null default 0;
alter table public.pedidos add column if not exists affiliate_payment_status text not null default 'unpaid';
alter table public.pedidos add column if not exists affiliate_paid_at timestamptz;

create index if not exists idx_pedidos_affiliate_code on public.pedidos (affiliate_code);
create index if not exists idx_pedidos_affiliate_payment_status on public.pedidos (affiliate_payment_status);
create index if not exists idx_affiliates_active on public.affiliates (active);

drop trigger if exists trg_affiliates_updated_at on public.affiliates;
create trigger trg_affiliates_updated_at
before update on public.affiliates
for each row execute function public.set_updated_at();

alter table public.affiliates enable row level security;

-- Exemplo para cadastrar um afiliado:
-- insert into public.affiliates (code, name, email, whatsapp, pix_key, commission_rate)
-- values ('JOAO10', 'Joao Silva', 'joao@email.com', '5521999999999', 'joao@email.com', 0.10)
-- on conflict (code) do update set
--   name = excluded.name,
--   email = excluded.email,
--   whatsapp = excluded.whatsapp,
--   pix_key = excluded.pix_key,
--   commission_rate = excluded.commission_rate;

-- Relatorio simples:
-- select
--   affiliate_code,
--   count(*) as pedidos,
--   sum(val) as faturamento,
--   sum(affiliate_commission_value) as comissao
-- from public.pedidos
-- where affiliate_code is not null
-- group by affiliate_code
-- order by comissao desc;
