-- MetricaUp / segui — tabela de configurações do site (pixels, etc)
-- Rode no SQL Editor do Supabase.

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- Seed com valores padrão (vazios ou os atuais)
insert into public.site_settings (key, value) values
  ('facebook_pixel_id', '1817329335605520'),
  ('google_analytics_id', ''),
  ('google_ads_id', ''),
  ('google_ads_label', ''),
  ('google_tag_manager_id', '')
on conflict (key) do nothing;

-- Trigger para updated_at
drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

-- Policy: leitura pública anônima (precisa para o layout server component)
drop policy if exists "site_settings_select_anon" on public.site_settings;
create policy "site_settings_select_anon" on public.site_settings
  for select using (true);

-- Policy: escrita apenas com service_role (via API /api/settings que usa service_role)
drop policy if exists "site_settings_update_service" on public.site_settings;
create policy "site_settings_update_service" on public.site_settings
  for all using (true) with check (true);
