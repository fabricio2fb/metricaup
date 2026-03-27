ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS utm_campaign text;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS utm_content text;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS utm_term text;
