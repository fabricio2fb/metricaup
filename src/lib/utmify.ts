export async function sendUTMifyEvent(data: {
  orderId: string;
  status: 'waiting_payment' | 'paid' | 'canceled' | 'refunded';
  email: string;
  phone?: string;
  totalPrice: number;
  productName: string;
  qty: number;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
}) {
  const token = process.env.UTMIFY_API_TOKEN;
  if (!token || token === 'INSIRA_SEU_TOKEN_AQUI') {
    console.warn('UTMIFY_API_TOKEN não configurado.');
    return;
  }

  try {
    const body = {
      orderId: data.orderId,
      status: data.status,
      paymentMethod: 'pix',
      totalPriceInCents: Math.round(data.totalPrice * 100),
      customer: {
        email: data.email,
        phone: data.phone?.replace(/\D/g, ''),
      },
      products: [
        {
          id: data.productName,
          name: data.productName,
          quantity: data.qty,
          priceInCents: Math.round(data.totalPrice * 100),
        }
      ],
      utmParams: data.utmParams || {}
    };

    const res = await fetch('https://api.utmify.com.br/v1/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Erro UTMify:', err);
    }
  } catch (err) {
    console.error('Erro ao enviar evento UTMify:', err);
  }
}
