require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
// Uso da chave de serviço para ter plenos direitos sem expor ao frontend
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

if(!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('AVISO: Faltam as chaves do Supabase nas variáveis de ambiente!');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Configuração Mercado Pago
const { MercadoPagoConfig, Payment } = require('mercadopago');
const MP_ACCESS_TOKEN = (process.env.MP_ACCESS_TOKEN || '').trim();
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
const payment = new Payment(client);

// Helper para logs de webhook
const fs = require('fs');
const logWebhook = (data) => {
    const logPath = path.join(__dirname, 'webhook_logs.txt');
    const msg = `[${new Date().toLocaleString()}] ${JSON.stringify(data)}\n`;
    fs.appendFileSync(logPath, msg);
};

// Criar Pedido (Original mantido por compatibilidade se necessário, mas usaremos a nova /api/criar-pix)
app.post('/api/pedidos', async (req, res) => {
  const { error, data } = await supabase.from('pedidos').insert([req.body]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// Criar Pix no Mercado Pago
app.post('/api/criar-pix', async (req, res) => {
  try {
    const { id, email, whatsapp, link, service, qty, val } = req.body;
    
    const body = {
      transaction_amount: Number(val),
      description: `Servico digital #ORD-${id}`,
      payment_method_id: 'pix',
      payer: {
        email: email,
        identification: {
          type: 'CPF',
          number: '00000000000'
        }
      },
      installments: 1
    };

    const mpResponse = await payment.create({ body });
    
    const pixData = {
      mp_id: String(mpResponse.id),
      pix_qr_text: mpResponse.point_of_interaction.transaction_data.qr_code,
      pix_qr_base64: mpResponse.point_of_interaction.transaction_data.qr_code_base64,
      expiracao: mpResponse.date_of_expiration,
      status: 'Aguardando Pagamento'
    };

    const { error } = await supabase.from('pedidos').insert([{
      id, email, whatsapp, link, service, qty, val,
      ...pixData
    }]);

    if (error) throw error;

    res.json({
      payment_id: mpResponse.id,
      qr_code_base64: pixData.pix_qr_base64,
      qr_code_texto: pixData.pix_qr_text,
      expiracao: pixData.expiracao
    });

  } catch (err) {
    console.error('Erro ao criar Pix:', err);
    res.status(500).json({ error: 'Erro ao gerar Pix. Verifique seu token do MP.' });
  }
});

// Checar Pagamento individual (Polling do Frontend)
app.get('/api/checar-pagamento/:id', async (req, res) => {
  try {
    const mpId = req.params.id;
    const mpResponse = await payment.get({ id: mpId });
    res.json({ status: mpResponse.status });
  } catch (err) {
    res.status(404).json({ error: 'Pagamento não encontrado' });
  }
});

// Webhook Mercado Pago (Notificações Automáticas)
app.post('/webhook/mercadopago', async (req, res) => {
  res.sendStatus(200); // Responder OK imediatamente

  try {
    const { action, data } = req.body;
    logWebhook(req.body);

    if (action === 'payment.created' || action === 'payment.updated') {
        const paymentId = data.id;
        const mpResponse = await payment.get({ id: paymentId });
        
        if (mpResponse.status === 'approved') {
            await supabase
                .from('pedidos')
                .update({ status: 'Aprovado' })
                .eq('mp_id', String(paymentId));
            
            console.log(`[MP] Pedido ${paymentId} aprovado com sucesso!`);
        }
    }
  } catch (err) {
    console.error('Erro no Webhook:', err.message);
  }
});

// Listar Pedidos ou Rastrear Pedido (se tiver email na query)
app.get('/api/pedidos', async (req, res) => {
  const email = req.query.email;
  let query = supabase.from('pedidos').select('*').order('created_at', { ascending: false });
  
  if (email) {
    query = query.eq('email', email);
  }
  
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Atualizar Status
app.patch('/api/pedidos/:id', async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const { error } = await supabase.from('pedidos').update({ status }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Limpar Pedidos
app.delete('/api/pedidos', async (req, res) => {
  const { error } = await supabase.from('pedidos').delete().neq('id', '0');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Servir arquivos estáticos do frontend da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rotas principais
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota do painel de administração
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n================================`);
  console.log(`Backend e Frontend rodando com sucesso!`);
  console.log(`Acesse o site principal: http://localhost:${PORT}`);
  console.log(`Acesse o painel VIP: http://localhost:${PORT}/admin`);
  console.log(`================================\n`);
});
