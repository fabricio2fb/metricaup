# MetricaUp - Sistema de Vendas com Mercado Pago Pix

Este projeto é uma landing page de venda de serviços digitais com checkout transparente via Pix (Mercado Pago) e backend seguro em Node.js.

## Como configurar o Mercado Pago

1. Vá ao [Painel de Desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel).
2. Crie uma aplicação ou selecione uma existente.
3. Em **Credenciais de Produção**, copie o seu **Access Token**.
4. Cole o token no arquivo `.env.local` na variável `MP_ACCESS_TOKEN`.

## Como configurar o Supabase (Banco de Dados)

Execute o seguinte script no seu **SQL Editor** do Supabase para preparar a tabela de pedidos:

```sql
-- Adicionar campos necessários para o Mercado Pago e Pix
ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS mp_id TEXT,
ADD COLUMN IF NOT EXISTS pix_qr_text TEXT,
ADD COLUMN IF NOT EXISTS pix_qr_base64 TEXT,
ADD COLUMN IF NOT EXISTS expiracao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;
```

## Instruções de Deploy na Render.com

Para colocar o site no ar (online):

1. Crie uma conta no [Render.com](https://render.com).
2. Clique em **New** > **Web Service**.
3. Conecte seu repositório do GitHub com este código.
4. Em **Build Command**, use: `npm install`
5. Em **Start Command**, use: `node server.js`
6. Vá na aba **Environment** e adicione todas as variáveis do seu `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MP_ACCESS_TOKEN`
7. Após o deploy, copie a URL do seu site (ex: `https://meusite.onrender.com`).

### Configurando o Webhook (Opcional, para aprovação automática)

1. No painel do Mercado Pago, vá em **Webhooks**.
2. Cole a URL: `https://seu-site.onrender.com/webhook/mercadopago`
3. Marque os eventos de **Pagamentos (payments)** e salve.

## Comandos Locais

```bash
# Instalar dependências
npm install

# Rodar em localhost:3000
node server.js
```

---
*Desenvolvido por Antigravity AI*
