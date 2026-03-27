'use client';

import { useState, useEffect, useMemo } from 'react';
import { findServiceIn, formatPrice, formatQty, type Platform, type Service, type QtyOption } from '@/lib/platforms';

type View = 'home' | 'services' | 'checkout' | 'pix';

// ===== NOTIFICATION TOAST =====
const NOTIFS = [
  { n: 'Felipe S.', p: '2.000 Seguidores BR', plat: 'Instagram', c: '#f9317a' },
  { n: 'Mariana C.', p: '500 Curtidas', plat: 'TikTok', c: '#8b5cf6' },
  { n: 'Lucas M.', p: '10k Views Reels', plat: 'Instagram', c: '#eab308' },
  { n: 'Juliana R.', p: '1.000 Seguidores BR', plat: 'Facebook', c: '#22c55e' },
  { n: 'Rafael T.', p: '5.000 Views Kwai', plat: 'Kwai', c: '#f97316' },
  { n: 'Camila A.', p: '200 Curtidas BR', plat: 'Instagram', c: '#3b82f6' },
];

function SalesToast() {
  const [visible, setVisible] = useState(false);
  const [notif, setNotif] = useState(NOTIFS[0]);

  useEffect(() => {
    const show = () => {
      setNotif(NOTIFS[Math.floor(Math.random() * NOTIFS.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    };
    const t = setTimeout(() => {
      show();
      const interval = setInterval(show, 12000);
      return () => clearInterval(interval);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`fixed bottom-6 left-6 z-50 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 p-4 flex items-center gap-3 max-w-xs">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: notif.c }}>
          {notif.n[0]}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-gray-900 truncate">{notif.n} comprou</div>
          <div className="text-xs text-[#f9317a] font-semibold truncate">{notif.p}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Há poucos minutos · {notif.plat}</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
      </div>
    </div>
  );
}

// ===== WHATSAPP SUPPORT BUTTON =====
const WA_NUMBER = '5521980258450';
const WA_OPTIONS = [
  { emoji: '🔗', label: 'Errei o link do perfil', msg: 'Olá! Errei o link do perfil no meu pedido e preciso corrigir. Pode me ajudar?' },
  { emoji: '💰', label: 'Paguei e não recebi', msg: 'Olá! Realizei o pagamento via PIX mas ainda não recebi meu pedido. Pode verificar?' },
  { emoji: '⏳', label: 'Demora na entrega', msg: 'Olá! Meu pedido está demorando mais do que o previsto. Pode checar o status?' },
  { emoji: '↩️', label: 'Quero reembolso', msg: 'Olá! Gostaria de solicitar o reembolso do meu pedido. Como procedo?' },
  { emoji: '❓', label: 'Tenho uma dúvida', msg: 'Olá! Tenho uma dúvida sobre os serviços da MetricaUp.' },
];

function WhatsAppSupport() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');

  function openWA(msg: string) {
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    setOpen(false);
    setCustom('');
  }

  function sendCustom() {
    if (!custom.trim()) return;
    openWA(custom.trim());
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popover */}
      {open && (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-black/10 w-80 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <div className="font-bold text-sm text-gray-900">Como podemos ajudar?</div>
            <div className="text-xs text-gray-400 mt-0.5">Selecione ou escreva sua mensagem</div>
          </div>
          <div className="p-3 space-y-1">
            {WA_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => openWA(opt.msg)}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <span className="text-lg flex-shrink-0">{opt.emoji}</span>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{opt.label}</span>
                <span className="ml-auto text-gray-300 group-hover:text-gray-500 text-xs">→</span>
              </button>
            ))}
          </div>
          <div className="px-3 pb-3">
            <div className="flex gap-2">
              <input
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition placeholder:text-gray-300"
                placeholder="Ou escreva sua mensagem..."
                value={custom}
                onChange={e => setCustom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendCustom()}
              />
              <button
                onClick={sendCustom}
                disabled={!custom.trim()}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${open ? 'bg-gray-800 rotate-45 scale-95' : 'bg-[#25D366] hover:bg-[#128C7E] hover:scale-105'}`}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.993 0C5.384 0 0 5.373 0 11.97c0 2.096.549 4.062 1.508 5.775L.057 24l6.438-1.685A11.95 11.95 0 0011.993 24c6.61 0 11.994-5.373 11.994-11.97S18.603 0 11.993 0z"/></svg>
        )}
      </button>
    </div>
  );
}

function Badge({ type }: { type: string }) {
  const map: Record<string, string> = {
    br: 'bg-green-50 text-green-700',
    hot: 'bg-orange-50 text-orange-600',
    fast: 'bg-blue-50 text-blue-600',
  };
  const labels: Record<string, string> = { br: '🇧🇷 BR', hot: '🔥 Popular', fast: '⚡ Rápido' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[type]}`}>{labels[type]}</span>;
}

// ===== TRACKING MODAL =====
function TrackingModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; content: React.ReactNode } | null>(null);

  async function track() {
    if (!email.includes('@')) { alert('E-mail inválido'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/pedidos?email=' + encodeURIComponent(email));
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setResult({ ok: false, content: 'Nenhum pedido encontrado para este e-mail.' });
      } else {
        const o = data[0];
        const statusColor = (o.status === 'Aprovado' || o.status === 'Entregue') ? '#16a34a' : o.status === 'Aguardando Pagamento' ? '#b45309' : '#3b82f6';
        setResult({
          ok: true,
          content: (
            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Pedido</span><strong>{o.id}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Serviço</span><span className="font-medium text-right max-w-[60%]">{o.service}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Quantidade</span><span>{formatQty(o.qty)} unid.</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Valor</span><strong className="text-green-600">{formatPrice(o.val)}</strong></div>
              <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-xs px-3 py-1 rounded-full border" style={{ color: statusColor, borderColor: statusColor + '40', background: statusColor + '10' }}>{o.status}</span>
              </div>
            </div>
          )
        });
      }
    } catch { setResult({ ok: false, content: 'Erro ao buscar. Tente novamente.' }); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 text-sm flex items-center justify-center transition">✕</button>
        <div className="text-3xl mb-3 text-center">📦</div>
        <h3 className="font-bold text-xl text-center mb-1">Rastrear Pedido</h3>
        <p className="text-sm text-gray-400 text-center mb-6">Digite o e-mail usado na compra</p>
        <input
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-gray-400 transition text-center mb-3"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && track()}
        />
        <button onClick={track} disabled={loading} className="w-full bg-[#0f0e0c] text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-gray-800 transition mb-4 disabled:opacity-60">
          {loading ? 'Buscando...' : 'Verificar Status'}
        </button>
        {result && (
          <div className={`p-4 rounded-2xl border ${result.ok ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100 text-red-600 text-sm text-center'}`}>
            {result.content}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== FAQ =====
function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full text-left bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-200 transition-all group">
      <div className="p-5 flex items-center justify-between gap-4">
        <span className="font-semibold text-gray-800 text-sm">{q}</span>
        <span className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold transition-all ${open ? 'bg-[#0f0e0c] text-white rotate-45' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>+</span>
      </div>
      {open && <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">{a}</div>}
    </button>
  );
}

// ===== PIX SCREEN =====
function PixScreen({ data, qty, onHome }: { data: { payment_id: number; qr_code_base64: string; qr_code_texto: string }; qty: QtyOption; onHome: () => void }) {
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [timer, setTimer] = useState(30 * 60);

  useEffect(() => {
    const t = setInterval(() => setTimer(prev => { if (prev <= 1) { clearInterval(t); return 0; } return prev - 1; }), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/checar-pagamento/${data.payment_id}`);
        const d = await res.json();
        if (d.status === 'approved') { setPaid(true); clearInterval(poll); }
      } catch { /* ignore */ }
    }, 4000);
    return () => clearInterval(poll);
  }, [data.payment_id]);

  const mins = String(Math.floor(timer / 60)).padStart(2, '0');
  const secs = String(timer % 60).padStart(2, '0');

  function copy() {
    navigator.clipboard.writeText(data.qr_code_texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    if (paid && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: qty.p,
        currency: 'BRL',
      });
    }
  }, [paid, qty.p]);

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="text-3xl font-bold mb-3">Pagamento Confirmado!</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">Seu pedido foi recebido com sucesso. Em breve iniciaremos o processamento e você receberá uma atualização.</p>
          <button onClick={onHome} className="bg-[#0f0e0c] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition">Voltar ao Início</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-28">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Pague com PIX</h1>
          <p className="text-gray-400 text-sm">Escaneie o QR code ou copie o código</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg">
          {/* Amount */}
          <div className="text-center mb-6 pb-6 border-b border-gray-100">
            <div className="text-sm text-gray-400 mb-1">Total a pagar</div>
            <div className="text-4xl font-bold text-green-600">{formatPrice(qty.p)}</div>
            <div className="text-sm text-gray-400 mt-1">⏱ {mins}:{secs}</div>
          </div>

          {/* QR Code */}
          {data.qr_code_base64 && (
            <div className="flex justify-center mb-6">
              <div className="p-3 border-2 border-green-100 rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`data:image/png;base64,${data.qr_code_base64}`} alt="QR PIX" className="w-44 h-44 object-contain" />
              </div>
            </div>
          )}

          {/* Copy */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex gap-2 items-center mb-4">
            <input readOnly value={data.qr_code_texto} className="flex-1 text-xs bg-transparent outline-none text-gray-500 truncate" />
            <button onClick={copy} className={`text-xs font-bold px-4 py-2 rounded-xl transition flex-shrink-0 ${copied ? 'bg-green-500 text-white' : 'bg-[#0f0e0c] text-white hover:bg-gray-800'}`}>
              {copied ? '✓ Copiado!' : 'Copiar'}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mb-6">Após o pagamento, o pedido é processado automaticamente em até 30 minutos.</p>

          <div className="flex gap-3">
            <button onClick={onHome} className="flex-1 border border-gray-200 py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Cancelar</button>
            <button onClick={() => setPaid(true)} className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-green-600 transition">Já Paguei ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== REFUND POLICY MODAL =====
function RefundPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f0f17] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm">Política de Reembolso</div>
              <div className="text-[11px] text-white/30">MetricaUp — Serviços Digitais</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition text-sm">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-sm">
          {/* Rule 1 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-base">✅</span>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">Pedido não iniciado — Reembolso total</div>
              <div className="text-white/50 text-xs leading-relaxed">Se o seu pedido ainda não foi iniciado pelo fornecedor, você tem direito ao reembolso integral do valor pago, sem taxas adicionais.</div>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-base">❌</span>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">Pedido iniciado ou entregue — Sem reembolso</div>
              <div className="text-white/50 text-xs leading-relaxed">Assim que o pedido é enviado ao fornecedor digital, o custo é repassado imediatamente e não pode ser estornado. Isso inclui casos em que a entrega já foi iniciada parcialmente.</div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl px-4 py-3.5">
            <div className="flex items-start gap-2.5">
              <span className="text-blue-400 flex-shrink-0 mt-0.5">ℹ️</span>
              <div className="text-xs text-white/50 leading-relaxed">
                <strong className="text-white/70 font-semibold">Por que não reembolsamos pedidos em andamento?</strong>
                {' '}Diferente de produtos físicos, serviços digitais são processados em tempo real por fornecedores externos. O custo é debitado no momento do envio, tornando o estorno inviável.
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-xs text-white/30 text-center">Em caso de dúvidas, abra nosso chat de suporte no WhatsApp.</div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-2xl font-semibold text-sm transition"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== CHECKOUT SECTION =====
function CheckoutSection({ service, platKey, utmParams, onBack, onPix }: { service: Service; platKey: string; utmParams: any; onBack: () => void; onPix: (d: { payment_id: number; qr_code_base64: string; qr_code_texto: string }, q: QtyOption) => void }) {
  const [qtyIdx, setQtyIdx] = useState(0);
  const [mode, setMode] = useState<'grid' | 'custom'>('grid');
  const [customVal, setCustomVal] = useState('');
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [pubLinks, setPubLinks] = useState<string[]>(['']);

  const isProfile = service.cat === 'seguidores';

  function normalizeProfileLink(raw: string): string {
    const val = raw.trim().replace(/^@/, '');
    if (val.startsWith('http')) return val;
    return `https://instagram.com/${val}`;
  }

  const qty: QtyOption = mode === 'grid'
    ? service.qtys[qtyIdx]
    : (() => {
      const v = parseInt(customVal);
      if (isNaN(v) || v < 100) return { q: 0, p: 0 };
      const b = service.qtys[0];
      return { q: v, p: (b.p / b.q) * v };
    })();

  async function pay() {
    const activeLink = isProfile
      ? normalizeProfileLink(link)
      : pubLinks.filter(l => l.trim()).join(',');

    if (!activeLink) {
      alert(isProfile ? 'Cole o link ou @ do perfil' : 'Adicione pelo menos um link de publicação');
      return;
    }
    if (!qty.q) { alert('Escolha uma quantidade'); return; }
    if (!email.includes('@')) { alert('E-mail inválido'); return; }
    setLoading(true);
    const id = '#' + Math.floor(Math.random() * 90000 + 10000);
    try {
      const res = await fetch('/api/criar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          email,
          whatsapp,
          link: activeLink,
          service: service.name,
          platform: platKey,
          qty: qty.q,
          val: qty.p,
          utmParams
        }),
      });
      const d = await res.json();
      if (!res.ok || d.error) throw new Error(d.error);
      onPix(d, qty);
    } catch (e: unknown) {
      alert('Erro: ' + (e as Error).message);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-500 hover:text-gray-900 transition group">
        <span className="group-hover:-translate-x-1 transition">←</span> Voltar para serviços
      </button>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
        {/* Form */}
        <div className="space-y-6">
          {/* Service header */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: service.iconBg, color: service.iconColor }} dangerouslySetInnerHTML={{ __html: service.icon }} />
            <div>
              <div className="font-bold text-gray-900">{service.name}</div>
              <div className="text-sm text-gray-400 mt-0.5">{service.desc}</div>
              <div className="flex gap-1 mt-2">{service.badges.map(b => <Badge key={b} type={b} />)}</div>
            </div>
          </div>

          {/* Link */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            {isProfile ? (
              <>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">1. Link do Perfil</label>
                <div className="text-xs text-gray-400 mb-3">Aceita link completo ou somente o @usuário</div>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gray-900 transition"
                  placeholder="https://instagram.com/seuperfil ou @seuperfil"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                />
              </>
            ) : (
              <>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-3">1. Link da Publicação</label>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 mb-4 flex items-start gap-2.5">
                  <span className="text-yellow-500 mt-0.5">⚠️</span>
                  <div className="text-xs text-yellow-700 leading-relaxed">
                    Publicações só aceitam links diretos do post (ex: instagram.com/p/xxx). Os <strong className="font-semibold">{formatQty(qty.q || 0)}</strong> itens serão divididos automaticamente entre as <strong className="font-semibold">{pubLinks.filter(l => l.trim()).length || 1}</strong> publicações no checkout.
                  </div>
                </div>
                <div className="space-y-3">
                  {pubLinks.map((pLink, i) => (
                    <div key={i} className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">#{i + 1}</div>
                      <input
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3.5 text-sm outline-none focus:border-gray-800 transition"
                        placeholder="Link da publicação..."
                        value={pLink}
                        onChange={e => {
                          const newLinks = [...pubLinks];
                          newLinks[i] = e.target.value;
                          setPubLinks(newLinks);
                        }}
                      />
                      {pubLinks.length > 1 && (
                        <button
                          onClick={() => setPubLinks(pubLinks.filter((_, idx) => idx !== i))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setPubLinks([...pubLinks, ''])}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3.5 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition"
                  >
                    + Adicionar publicação
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quantity */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">2. Quantidade</label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['grid', 'custom'] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${mode === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                    {m === 'grid' ? 'Pré-seleção' : 'Personalizar'}
                  </button>
                ))}
              </div>
            </div>
            {mode === 'grid' ? (
              <div className="grid grid-cols-3 gap-2.5">
                {service.qtys.map((q, i) => (
                  <button key={i} onClick={() => setQtyIdx(i)} className={`rounded-xl p-3.5 text-center border transition-all ${qtyIdx === i ? 'bg-[#0f0e0c] border-[#0f0e0c] scale-[1.03]' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <div className={`font-bold text-lg ${qtyIdx === i ? 'text-white' : 'text-gray-800'}`}>{formatQty(q.q)}</div>
                    <div className={`text-xs mt-0.5 font-medium ${qtyIdx === i ? 'text-white/70' : 'text-gray-400'}`}>{formatPrice(q.p)}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-3">Mínimo: 100 unidades</p>
                <div className="relative">
                  <input type="number" min="100" placeholder="ex: 1500" value={customVal} onChange={e => setCustomVal(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 font-bold text-lg outline-none pr-16" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">unid.</span>
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">3. Seus Dados</label>
            <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gray-800 transition mb-3" placeholder="E-mail para o recibo *" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gray-800 transition" placeholder="WhatsApp (opcional)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
          </div>
        </div>

        {/* Summary */}
        <div className="top-24 sticky">
          <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-lg">
            <h3 className="font-bold text-lg mb-5 pb-4 border-b border-gray-100">Resumo</h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Serviço</span>
                <span className="font-semibold text-gray-700 text-right max-w-[55%]">{service.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Quantidade</span>
                <span className="font-semibold text-gray-700">{qty.q ? formatQty(qty.q) + ' unid.' : '—'}</span>
              </div>
              
              {!isProfile && pubLinks.filter(l => l.trim()).length > 1 && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 mt-4">
                  <div className="text-[10px] font-bold text-green-700 mb-2 uppercase tracking-wide">📊 DIVISÃO AUTOMÁTICA NO CHECKOUT</div>
                  <div className="space-y-1.5">
                    {pubLinks.filter(l => l.trim()).map((l, i, arr) => {
                      const total = arr.length;
                      const base = Math.floor((qty.q || 0) / total);
                      const rem = (qty.q || 0) % total;
                      const amnt = base + (i < rem ? 1 : 0);
                      
                      let shortUrl = l.trim();
                      try {
                        const u = new URL(shortUrl.startsWith('http') ? shortUrl : `https://${shortUrl}`);
                        shortUrl = u.pathname.substring(0, 15) + (u.pathname.length > 15 ? '...' : '');
                        if (shortUrl === '/' || shortUrl.length < 3) shortUrl = `Publicação #${i + 1}`;
                      } catch {
                        shortUrl = `Publicação #${i + 1}`;
                      }

                      return (
                        <div key={i} className="flex justify-between text-xs items-center">
                          <span className="text-green-600 truncate mr-2" title={l.trim()}>{shortUrl}</span>
                          <span className="font-bold text-green-700 whitespace-nowrap">{formatQty(amnt)} unid.</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {!isProfile && pubLinks.filter(l => l.trim()).length <= 1 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mt-4 flex items-start gap-2.5">
                  <span className="text-blue-500 text-[10px] mt-0.5">ℹ️</span>
                  <span className="text-[11px] text-blue-700 leading-relaxed font-medium">Adicione mais publicações para dividir os itens automaticamente.</span>
                </div>
              )}

            </div>
            <div className="border-t border-dashed border-gray-200 pt-5 mb-6 mt-5">
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-gray-400">Total</span>
                <span className="text-4xl font-bold text-gray-900">{qty.p ? formatPrice(qty.p) : 'R$ 0,00'}</span>
              </div>
            </div>
            {/* Refund Policy Checkbox */}
            <div className="bg-[#0f0f17] border border-white/10 rounded-2xl p-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => setAccepted(v => !v)}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    accepted
                      ? 'bg-purple-600 border-purple-500'
                      : 'bg-transparent border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {accepted && (
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-xs text-white/50 leading-relaxed">
                  Li e concordo com a{' '}
                  <button
                    type="button"
                    onClick={() => setShowRefundModal(true)}
                    className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition font-semibold"
                  >
                    Política de Reembolso
                  </button>
                  . Entendo que pedidos já iniciados não podem ser reembolsados.
                </span>
              </label>
            </div>

            {showRefundModal && <RefundPolicyModal onClose={() => setShowRefundModal(false)} />}

            <button
              onClick={pay}
              disabled={loading || !qty.q || !accepted}
              className={`w-full py-4 rounded-2xl font-bold text-base transition ${
                accepted && qty.q && !loading
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-100'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Gerando PIX...</span>
              ) : (
                accepted ? '💰 Pagar com PIX' : '🔒 Aceite os termos para continuar'
              )}
            </button>
            <div className="flex items-center justify-center gap-3 mt-4">
              <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span className="text-xs text-gray-400">Pagamento 100% seguro via PIX</span>
            </div>
          </div>

          {/* Trust items */}
          <div className="mt-4 space-y-2">
            {[
              { icon: '⚡', text: 'Entrega em até 30 minutos' },
              { icon: '🔒', text: 'Dados protegidos e criptografados' },
              { icon: '↩️', text: 'Garantia de reposição' },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-2.5 text-xs text-gray-400 font-medium">
                <span>{t.icon}</span> {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SERVICES SECTION =====
function ServicesSection({ plat, onBack, onSelect }: { plat: Platform; onBack: () => void; onSelect: (id: string) => void }) {
  const cats = ['todos', ...new Set(plat.services.map(s => s.cat))];
  const [cat, setCat] = useState('todos');
  const CAT_LABELS: Record<string, string> = { todos: 'Todos', seguidores: '👤 Seguidores', curtidas: '❤️ Curtidas', views: '👁️ Views', comentarios: '💬 Comentários', compartilhamentos: '🔁 Compartilhamentos' };
  const list = cat === 'todos' ? plat.services : plat.services.filter(s => s.cat === cat);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-500 hover:text-gray-900 transition group">
        <span className="group-hover:-translate-x-1 transition">←</span> Todas as plataformas
      </button>

      {/* Hero */}
      <div className="rounded-3xl p-12 mb-10 relative overflow-hidden flex items-center justify-between" style={{ background: plat.gradient }}>
        <div>
          <div className="text-white/70 text-sm font-semibold mb-2 uppercase tracking-wider">{plat.services.length} serviços disponíveis</div>
          <div className="font-bold text-5xl text-white mb-3 tracking-tight">{plat.name}</div>
          <div className="text-white/80 text-base max-w-sm leading-relaxed">{plat.desc}</div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-center pointer-events-none overflow-hidden">
          {plat.logo_svg ? (
            <div className="w-64 h-64 text-white opacity-[0.15] -rotate-12 translate-x-12 translate-y-12" dangerouslySetInnerHTML={{ __html: plat.logo_svg }} />
          ) : (
            <div className="text-[120px] opacity-20 select-none leading-none">{plat.emoji}</div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${cat === c ? 'bg-[#0f0e0c] text-white border-[#0f0e0c]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'}`}>
            {CAT_LABELS[c] || c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map(s => (
          <div key={s.id} onClick={() => onSelect(s.id)} className="bg-white border border-gray-100 rounded-3xl p-7 cursor-pointer group hover:border-gray-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: s.iconBg, color: s.iconColor }} dangerouslySetInnerHTML={{ __html: s.icon }} />
              <div className="flex flex-col gap-1 items-end">{s.badges.map(b => <Badge key={b} type={b} />)}</div>
            </div>
            <div className="font-bold text-gray-900 text-xl mb-2">{s.name}</div>
            <div className="text-sm text-gray-400 leading-relaxed mb-6">{s.desc}</div>
            <div className="flex items-end justify-between pt-4 border-t border-gray-50">
              <div>
                <div className="text-xs text-gray-400">A partir de</div>
                <div className="font-bold text-2xl text-gray-900">{formatPrice(s.qtys[0].p)}</div>
                <div className="text-xs text-gray-400">{formatQty(s.qtys[0].q)} unidades</div>
              </div>
              <button className="bg-[#0f0e0c] text-white px-5 py-2.5 rounded-full text-xs font-bold group-hover:bg-[#f9317a] transition-all">
                Comprar →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
const PLAT_CLASSES: Record<string, string> = {
  instagram: 'from-purple-600 via-red-500 to-amber-400',
  tiktok: 'from-gray-950 via-gray-900 to-red-950',
  facebook: 'from-blue-500 to-blue-800',
  kwai: 'from-orange-500 to-amber-400',
};

export default function Home() {
  const [platforms, setPlatforms] = useState<Record<string, Platform>>({});
  const [loadingPlat, setLoadingPlat] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/platforms');
        const data = await res.json();
        if (data && !data.error) setPlatforms(data);
      } catch (err) {
        console.error('Erro ao carregar plataformas:', err);
      } finally {
        setLoadingPlat(false);
      }
    }
    load();
  }, []);

  const [view, setView] = useState<View>('home');
  const [platKey, setPlatKey] = useState('');
  const [service, setService] = useState<Service | null>(null);
  const [pixData, setPixData] = useState<{ payment_id: number; qr_code_base64: string; qr_code_texto: string } | null>(null);
  const [pixQty, setPixQty] = useState<QtyOption | null>(null);
  const [tracking, setTracking] = useState(false);
  const [utmParams, setUtmParams] = useState<any>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const params = {
        source: sp.get('utm_source') || '',
        medium: sp.get('utm_medium') || '',
        campaign: sp.get('utm_campaign') || '',
        content: sp.get('utm_content') || '',
        term: sp.get('utm_term') || ''
      };
      setUtmParams(params);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      if (view === 'home') {
        (window as any).fbq('track', 'PageView');
      } else if (view === 'checkout') {
        (window as any).fbq('track', 'InitiateCheckout');
      }
    }
  }, [view]);

  function goHome() {
    setView('home'); setPlatKey(''); setService(null); setPixData(null); setPixQty(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loadingPlat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#f9317a]/20 border-t-[#f9317a] rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-400">Carregando ofertas...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 md:px-10 py-3.5 flex items-center justify-between">
        <button onClick={goHome} className="font-bold text-xl md:text-[22px] tracking-tight font-clash">
          Metrica<em className="text-[#f9317a] not-italic">Up</em>
        </button>
        <button onClick={() => setTracking(true)} className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gray-500 px-3 md:px-4 py-2 rounded-full hover:bg-gray-100 transition">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          📦 Rastrear Pedido
        </button>
      </nav>

      {tracking && <TrackingModal onClose={() => setTracking(false)} />}
      <SalesToast />
      <WhatsAppSupport />

      {/* VIEWS */}
      {view === 'home' && (
        <main className="bg-[#FAFAFA]">
          {/* Hero */}
          <section className="max-w-6xl mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-10 md:pb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-6 md:mb-10">
              ✨ Crescimento Real nas Redes Sociais
            </div>
            <h1 className="font-bold text-[clamp(36px,8vw,86px)] leading-[0.95] tracking-[-2px] md:tracking-[-3px] mb-5 md:mb-8 max-w-4xl font-clash">
              Mais{' '}
              <span className="relative">
                Seguidores
                <span className="absolute -bottom-1 left-0 right-0 h-2 md:h-2.5 bg-gradient-to-r from-[#f9317a] to-[#f5a623] opacity-30 rounded-sm -z-10" />
              </span>
              {', '}Curtidas & Views
            </h1>
            <div className="flex flex-wrap items-end justify-between gap-5 mb-10 md:mb-16">
              <p className="text-sm md:text-lg text-gray-500 max-w-md leading-relaxed">Pacotes para Instagram, TikTok, Facebook e Kwai. Entrega rápida, resultados reais.</p>
              <div className="flex gap-6 md:gap-10">
                {[['50k+', 'Clientes'], ['99%', 'Satisfação'], ['24h', 'Suporte']].map(([n, l]) => (
                  <div key={l} className="text-right">
                    <div className="font-bold text-2xl md:text-4xl tracking-tight font-clash">{n}</div>
                    <div className="text-xs md:text-sm text-gray-400 font-medium mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(platforms).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => { setPlatKey(key); setView('services'); window.scrollTo({ top: 0 }); }}
                  className={`bg-gradient-to-br ${PLAT_CLASSES[key]} rounded-2xl md:rounded-3xl p-7 md:p-10 text-left relative overflow-hidden min-h-52 md:min-h-64 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 active:scale-[0.98]`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 md:w-[68px] md:h-[68px] rounded-xl md:rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      {p.logo_svg ? (
                        <div className="w-7 h-7 md:w-9 md:h-9 text-white" dangerouslySetInnerHTML={{ __html: p.logo_svg }} />
                      ) : (
                        <span className="text-2xl md:text-3xl">{p.emoji}</span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white text-sm border border-white/20 group-hover:bg-white/30 transition">↗</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 tracking-tight font-clash">{p.name}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {[...new Set(p.services.map(s => s.cat))].slice(0, 3).map(c => (
                        <span key={c} className="text-[10px] md:text-xs font-semibold bg-white/15 text-white px-2.5 py-1 rounded-full border border-white/15 capitalize">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute right-[-10px] bottom-[-20px] pointer-events-none select-none opacity-[0.08]">
                    {p.logo_svg ? (
                      <div className="w-32 h-32 md:w-44 md:h-44 text-white -rotate-12" dangerouslySetInnerHTML={{ __html: p.logo_svg }} />
                    ) : (
                      <div className="text-[100px] md:text-[140px] leading-none">{p.emoji}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* WhatsApp CTA */}
          <section className="max-w-6xl mx-auto px-5 md:px-10 pb-12 md:pb-20">
            <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-6 md:p-9 flex flex-wrap items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="#16a34a" className="w-8 h-8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.993 0C5.384 0 0 5.373 0 11.97c0 2.096.549 4.062 1.508 5.775L.057 24l6.438-1.685A11.95 11.95 0 0011.993 24c6.61 0 11.994-5.373 11.994-11.97S18.603 0 11.993 0z" /></svg>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-base md:text-xl mb-1 font-clash">Precisa de ajuda?</div>
                  <div className="text-gray-500 text-xs md:text-sm">Respondemos em minutos no WhatsApp.</div>
                </div>
              </div>
              <a href="https://wa.me/5521980258450" rel="noreferrer" className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-bold text-sm transition hover:-translate-y-0.5 shadow-md shadow-green-100 flex items-center gap-2 whitespace-nowrap">
                💬 Falar no WhatsApp
              </a>
            </div>
          </section>

          {/* Social proof */}
          <section className="overflow-hidden py-6 mb-4">
            <div className="flex gap-3 whitespace-nowrap" style={{ animation: 'scroll-left 30s linear infinite' }}>
              {[...Array(2)].flatMap(() => [
                '⚡ Entrega em 30 min', '🇧🇷 Seguidores Reais BR', '✅ 50.000+ Clientes', '🔒 Pagamento Seguro', '💰 Menor Preço Garantido', '🏆 Avaliação 5 Estrelas', '♻️ Garantia de Reposição', '📊 Resultados Comprovados'
              ]).map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 whitespace-nowrap shadow-sm flex-shrink-0">{t}</span>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-6xl mx-auto px-5 md:px-10 pb-16 md:pb-24">
            <div className="text-center mb-8 md:mb-12">
              <div className="font-bold text-2xl md:text-4xl tracking-tight mb-2 font-clash">Perguntas Frequentes</div>
              <div className="text-gray-400 text-sm">Tire suas dúvidas antes de comprar</div>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {[
                ['Os seguidores são reais?', 'Sim! Seguidores Mundiais são perfis internacionais verificados. Seguidores Brasileiros são perfis locais com fotos, bio e histórico de publicações.'],
                ['Quanto tempo leva a entrega?', 'A maioria começa em até 30 minutos após a confirmação do pagamento PIX. Pedidos maiores podem levar algumas horas.'],
                ['Minha conta pode ser banida?', 'Nosso método é seguro. Entregamos de forma gradual e realista, respeitando os limites das plataformas.'],
                ['O pagamento é seguro?', 'Sim! Processamos apenas via PIX — o metódo mais rápido e seguro do Brasil. Sem dados de cartão expostos.'],
                ['Posso pedir reembolso?', 'Sim. Caso o serviço não seja entregue no prazo, oferecemos reembolso integral ou reposição dos itens.'],
              ].map(([q, a]) => <Faq key={q} q={q} a={a} />)}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-gray-100 py-10 text-center bg-white">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
              </div>
              <span className="font-bold text-lg font-clash">Metrica<span className="text-[#f9317a]">Up</span></span>
            </div>
            <p className="text-sm text-gray-400 mb-4">© 2025 MetricaUp. Todos os direitos reservados.</p>
            <div className="flex justify-center gap-6">
              {['Termos de Uso', 'Privacidade', 'Contato'].map(l => <a key={l} href="#" className="text-sm text-gray-400 hover:text-gray-700 transition">{l}</a>)}
            </div>
          </footer>
        </main>
      )}

      {view === 'services' && platKey && platforms[platKey] && (
        <ServicesSection
          plat={platforms[platKey]}
          onBack={goHome}
          onSelect={id => {
            const s = findServiceIn(id, platforms);
            if (s) { setService(s); setView('checkout'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          }}
        />
      )}

      {view === 'checkout' && service && (
        <div className="bg-[#FAFAFA] min-h-screen">
          <CheckoutSection
            service={service}
            platKey={platKey}
            utmParams={utmParams}
            onBack={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onPix={(d, q) => { setPixData(d); setPixQty(q); setView('pix'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </div>
      )}

      {view === 'pix' && pixData && pixQty && (
        <PixScreen data={pixData} qty={pixQty} onHome={goHome} />
      )}
    </>
  );
}
