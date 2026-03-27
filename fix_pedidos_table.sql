-- Adicionar coluna platform à tabela pedidos
ALTER TABLE pedidos ADD COLUMN platform text;

-- Opcional: Tentar preencher pedidos existentes baseando-se no nome do serviço
UPDATE pedidos SET platform = 'instagram' WHERE service ILIKE '%instagram%' OR service ILIKE '%reels%' OR service ILIKE '%stories%';
UPDATE pedidos SET platform = 'tiktok' WHERE service ILIKE '%tiktok%';
UPDATE pedidos SET platform = 'facebook' WHERE service ILIKE '%facebook%';
UPDATE pedidos SET platform = 'kwai' WHERE service ILIKE '%kwai%';
UPDATE pedidos SET platform = 'instagram' WHERE platform IS NULL; -- fallback
