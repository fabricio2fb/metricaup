'use client';

import { useState } from 'react';
import { PLATFORMS, findService, formatPrice, formatQty, type Service, type QtyOption } from '@/lib/platforms';

// ===== VIEWS =====
type View = 'home' | 'services' | 'checkout' | 'pix' | 'success';

// ===== NOTIFICATION =====
const NOTIFS = [
  { n: 'Felipe', p: '2.000 Seguidores BR', t: 'Há 1 minuto', c: 'f9317a' },
  { n: 'Mariana', p: '500 Curtidas Mundiais', t: 'Há 3 minutos', c: '3b82f6' },
  { n: 'Lucas', p: '10k Views Reels', t: 'Há 5 minutos', c: 'eab308' },
  { n: 'Juliana', p: '1.000 Seguidores BR', t: 'Agora', c: '22c55e' },
];

// ===== BADGE HELPER =====
function Badge({ type }: { type: string }) {
  if (type === 'br') return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700 tracking-wide">BR</span>;
  if (type === 'hot') return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 tracking-wide">🔥 Popular</span>;
  if (type === 'fast') return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 tracking-wide">⚡ Rápido</span>;
  return null;
}

// ===== FAQ ITEM =====
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`bg-white border rounded-2xl overflow-hidden cursor-pointer transition-all ${open ? 'border-gray-300 bg-gray-50' : 'border-[#E5E7EB]'}`}
    >
      <div className="p-6 flex items-center justify-between gap-4">
        <span className="font-semibold text-[#1a1916]">{q}</span>
        <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-lg font-bold transition-transform ${open ? 'bg-[#0f0e0c] text-white rotate-45' : 'bg-gray-100 text-gray-500'}`}>+</span>
      </div>
      {open && <div className="px-6 pb-6 text-sm text-[#6B7280] leading-relaxed">{a}</div>}
    </div>
  );
}

// ===== TRACKING MODAL =====
function TrackingModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<{ ok: boolean; html: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function trackOrder() {
    if (!email || !email.includes('@')) { alert('E-mail inválido'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/pedidos?email=' + encodeURIComponent(email));
      const data = await res.json();
      if (!res.ok || !data?.length) {
        setResult({ ok: false, html: 'Nenhum pedido encontrado! Verifique o e-mail.' });
      } else {
        const o = data[0];
        setResult({ ok: true, html: `Pedido: <strong>${o.id}</strong> — ${o.service} — ${formatQty(o.qty)} unid. — R$ ${Number(o.val).toFixed(2).replace('.', ',')} — Status: <strong>${o.status}</strong>` });
      }
    } catch { setResult({ ok: false, html: 'Erro ao buscar pedido.' }); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-md relative shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">✕</button>
        <div className="text-3xl mb-4">📦</div>
        <h3 className="font-clash text-2xl font-bold mb-2">Rastrear Pedido</h3>
        <p className="text-sm text-gray-500 mb-6">Digite o e-mail usado no pedido para verificar o status.</p>
        <input
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-gray-800 mb-4 text-center"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          onClick={trackOrder}
          disabled={loading}
          className="w-full bg-[#0f0e0c] text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition mb-4"
        >
          {loading ? 'Buscando...' : 'Buscar Pedido'}
        </button>
        {result && (
          <div className={`p-4 rounded-xl text-sm text-left border ${result.ok ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'}`} dangerouslySetInnerHTML={{ __html: result.html }} />
        )}
      </div>
    </div>
  );
}

// ===== PIX SECTION =====
function PixSection({ pixData, selectedQty, onHome }: { pixData: { payment_id: number; qr_code_base64: string; qr_code_texto: string }; selectedQty: QtyOption; onHome: () => void }) {
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(pixData.qr_code_texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center max-w-lg w-full shadow-lg">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8" style={{ animation: 'pop 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 className="font-clash text-3xl font-bold mb-3">Pagamento Confirmado!</h2>
          <p className="text-gray-500 mb-8">Seu pedido foi recebido. Em breve iniciaremos o processamento.</p>
          <button onClick={onHome} className="bg-[#0f0e0c] text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">Voltar ao Início</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-28">
      <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-md w-full shadow-lg text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><path d="M8 12l2.5 2.5 5-5"/></svg>
        </div>
        <h2 className="font-clash text-2xl font-bold mb-1">Pague com PIX</h2>
        <p className="text-4xl font-clash font-bold text-green-600 mb-6">{formatPrice(selectedQty.p)}</p>

        {pixData.qr_code_base64 && (
          <div className="mx-auto mb-6 w-52 h-52 border-4 border-green-100 rounded-2xl overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code PIX" className="w-full h-full object-contain" />
          </div>
        )}

        <p className="text-xs text-gray-400 mb-3">Ou copie o código abaixo:</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 flex gap-2 items-center">
          <input className="flex-1 text-xs bg-transparent outline-none text-gray-600 truncate" readOnly value={pixData.qr_code_texto} />
          <button onClick={copyCode} className="text-xs bg-[#0f0e0c] text-white px-3 py-1.5 rounded-lg font-bold shrink-0 hover:bg-gray-700 transition">
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-6">⏱ O código expira em 30 minutos. Após o pagamento, o pedido é processado automaticamente.</p>

        <div className="flex gap-3">
          <button onClick={onHome} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={() => setPaid(true)} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition">Já Paguei ✓</button>
        </div>
      </div>
    </div>
  );
}

// ===== CHECKOUT SECTION =====
function CheckoutSection({
  service, onBack, onPix
}: {
  service: Service;
  onBack: () => void;
  onPix: (data: { payment_id: number; qr_code_base64: string; qr_code_texto: string }, qty: QtyOption) => void;
}) {
  const [selectedQtyIdx, setSelectedQtyIdx] = useState(0);
  const [customQty, setCustomQty] = useState('');
  const [qtyMode, setQtyMode] = useState<'grid' | 'custom'>('grid');
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedQty: QtyOption = qtyMode === 'grid'
    ? service.qtys[selectedQtyIdx]
    : (() => {
        const v = parseInt(customQty);
        if (isNaN(v) || v < 100) return { q: 0, p: 0 };
        const base = service.qtys[0];
        return { q: v, p: (base.p / base.q) * v };
      })();

  async function doPay() {
    if (!link) { alert('Cole o link do perfil.'); return; }
    if (!selectedQty.q) { alert('Selecione uma quantidade.'); return; }
    if (!email || !email.includes('@')) { alert('E-mail inválido.'); return; }

    setLoading(true);
    const id = '#' + Math.floor(Math.random() * 90000 + 10000);
    try {
      const res = await fetch('/api/criar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email, whatsapp, link, service: service.name, qty: selectedQty.q, val: selectedQty.p })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      onPix(data, selectedQty);
    } catch (err: unknown) {
      alert('Erro ao gerar PIX: ' + (err as Error).message);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold hover:bg-[#0f0e0c] hover:text-white hover:border-[#0f0e0c] transition">← Voltar</button>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-start">
        {/* Left: Form */}
        <div className="bg-white border border-gray-200 rounded-3xl p-9 shadow-sm">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: service.iconBg, color: service.iconColor }} dangerouslySetInnerHTML={{ __html: service.icon }} />
            <div>
              <div className="font-clash text-xl font-bold">{service.name}</div>
              <div className="text-sm text-gray-500 mt-0.5">{service.desc}</div>
            </div>
          </div>

          {/* Step 1: Link */}
          <div className="flex gap-4 mb-7">
            <div className="w-7 h-7 rounded-full bg-[#0f0e0c] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-1">1</div>
            <div className="flex-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 block">Link do Perfil ou Publicação</label>
              <input className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-gray-800 transition" placeholder="https://instagram.com/nome_do_perfil" value={link} onChange={e => setLink(e.target.value)} />
            </div>
          </div>

          {/* Step 2: Qty */}
          <div className="flex gap-4 mb-7">
            <div className="w-7 h-7 rounded-full bg-[#0f0e0c] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-1">2</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Quantidade</label>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                  {(['grid', 'custom'] as const).map(m => (
                    <button key={m} onClick={() => setQtyMode(m)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${qtyMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>{m === 'grid' ? 'Opções' : 'Personalizado'}</button>
                  ))}
                </div>
              </div>
              {qtyMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-3">
                  {service.qtys.map((q, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedQtyIdx(i)}
                      className={`rounded-2xl p-4 text-center cursor-pointer border transition ${selectedQtyIdx === i ? 'bg-[#0f0e0c] border-[#0f0e0c] scale-[1.02]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className={`font-clash text-xl font-bold ${selectedQtyIdx === i ? 'text-white' : 'text-gray-900'}`}>{formatQty(q.q)}</div>
                      <div className={`text-xs mt-1 ${selectedQtyIdx === i ? 'text-white/70' : 'text-gray-400'}`}>{formatPrice(q.p)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 mb-3">Digite a quantidade desejada (mínimo 100 unidades).</p>
                  <div className="relative">
                    <input className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-lg font-bold outline-none font-clash pr-16" type="number" min="100" placeholder="1000" value={customQty} onChange={e => setCustomQty(e.target.value)} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">unid.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Contact */}
          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-full bg-[#0f0e0c] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-1">3</div>
            <div className="flex-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 block">Seus Dados</label>
              <input className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-gray-800 transition mb-3" placeholder="E-mail para recibo" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-gray-800 transition" placeholder="WhatsApp (opcional)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm top-24 sticky">
          <h3 className="font-clash text-xl font-bold mb-5 pb-4 border-b border-gray-100">Resumo do Pedido</h3>
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm text-gray-500"><span>Serviço</span><span className="font-semibold text-gray-800">{service.name}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Quantidade</span><span className="font-semibold text-gray-800">{selectedQty.q ? formatQty(selectedQty.q) + ' unid.' : '—'}</span></div>
          </div>
          <hr className="border-dashed border-gray-200 mb-5" />
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold">Total</span>
            <span className="font-clash text-3xl font-bold">{selectedQty.p ? formatPrice(selectedQty.p) : 'R$ 0,00'}</span>
          </div>
          <button
            onClick={doPay}
            disabled={loading || !selectedQty.q}
            className="w-full bg-green-500 text-white py-5 rounded-2xl font-clash text-lg font-bold hover:bg-green-600 transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? 'Gerando PIX...' : '💰 Pagar com PIX'}
          </button>
          <div className="flex justify-center gap-2 mt-4">
            {['PIX', 'SEGURO', 'BR'].map(tag => (
              <span key={tag} className="text-[10px] bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 font-bold text-gray-400 tracking-wide">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SERVICES SECTION =====
function ServicesSection({ platKey, onBack, onCheckout }: { platKey: string; onBack: () => void; onCheckout: (sid: string) => void }) {
  const plat = PLATFORMS[platKey];
  const cats = ['todos', ...new Set(plat.services.map(s => s.cat))];
  const [cat, setCat] = useState('todos');
  const CAT_LABELS: Record<string, string> = { todos: 'Todos', seguidores: 'Seguidores', curtidas: 'Curtidas', views: 'Views', comentarios: 'Comentários', compartilhamentos: 'Compartilhamentos' };

  const list = cat === 'todos' ? plat.services : plat.services.filter(s => s.cat === cat);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-2 mb-9 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold hover:bg-[#0f0e0c] hover:text-white hover:border-[#0f0e0c] transition">← Voltar</button>

      {/* Hero */}
      <div className="rounded-3xl p-14 mb-10 relative overflow-hidden flex items-center justify-between gap-5 shadow-lg" style={{ background: plat.gradient }}>
        <div className="relative z-10">
          <div className="font-clash text-6xl font-bold text-white leading-none mb-3">{plat.name}</div>
          <div className="text-white/80 text-base max-w-xs">{plat.desc}</div>
        </div>
        <div className="text-8xl relative z-10" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.2))' }}>{plat.emoji}</div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-9">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition ${cat === c ? 'bg-[#0f0e0c] border-[#0f0e0c] text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'}`}>
            {CAT_LABELS[c] || c}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map(s => (
          <div key={s.id} onClick={() => onCheckout(s.id)} className="bg-white border border-gray-200 rounded-3xl p-8 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex justify-between items-start mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: s.iconBg, color: s.iconColor }} dangerouslySetInnerHTML={{ __html: s.icon }} />
              <div className="flex flex-col gap-1 items-end">{s.badges.map(b => <Badge key={b} type={b} />)}</div>
            </div>
            <div className="font-clash text-xl font-bold mb-2">{s.name}</div>
            <div className="text-sm text-gray-400 mb-7 leading-relaxed">{s.desc}</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-gray-400">A partir de</div>
                <div className="font-clash text-2xl font-bold">{formatPrice(s.qtys[0].p)}</div>
                <div className="text-xs text-gray-400">{formatQty(s.qtys[0].q)} unidades</div>
              </div>
              <button className="bg-[#0f0e0c] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#f9317a] transition-all hover:scale-105">Selecionar →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
export default function Home() {
  const [view, setView] = useState<View>('home');
  const [currentPlat, setCurrentPlat] = useState('');
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [pixData, setPixData] = useState<{ payment_id: number; qr_code_base64: string; qr_code_texto: string } | null>(null);
  const [pixQty, setPixQty] = useState<QtyOption | null>(null);
  const [trackingOpen, setTrackingOpen] = useState(false);

  function goHome() {
    setView('home');
    setCurrentPlat('');
    setCurrentService(null);
    setPixData(null);
    setPixQty(null);
  }

  const PLAT_KEYS = Object.keys(PLATFORMS);
  const PLAT_CLASSES: Record<string, string> = {
    instagram: 'bg-gradient-to-br from-purple-700 via-red-500 to-amber-400',
    tiktok: 'bg-gradient-to-br from-gray-950 via-gray-900 to-red-950',
    facebook: 'bg-gradient-to-br from-blue-500 to-blue-900',
    kwai: 'bg-gradient-to-br from-orange-500 to-orange-400',
  };

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4 bg-white/85 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <span className="font-clash text-2xl font-bold tracking-tight">Metrica<em className="text-[#f9317a] not-italic">Up</em></span>
        <button onClick={() => setTrackingOpen(true)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 px-4 py-2 rounded-full hover:bg-gray-100 transition">📦 Rastrear Pedido</button>
      </nav>

      {trackingOpen && <TrackingModal onClose={() => setTrackingOpen(false)} />}

      {/* VIEWS */}
      {view === 'home' && (
        <main>
          {/* Hero */}
          <section className="max-w-6xl mx-auto px-12 pt-40 pb-20">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-700 mb-8">
              ✨ Crescimento Real nas Redes Sociais
            </div>
            <h1 className="font-clash text-[clamp(48px,7vw,92px)] font-bold leading-none tracking-[-3px] mb-8 max-w-4xl">
              Mais{' '}
              <span className="relative inline-block">
                Seguidores
                <span className="absolute bottom-2 left-0 right-0 h-2 rounded bg-gradient-to-r from-[#f9317a] to-[#f5a623] opacity-40 -z-10" />
              </span>
              {', '}Curtidas & Views
            </h1>
            <div className="flex flex-wrap items-end justify-between gap-10 mb-20">
              <p className="text-lg text-gray-500 max-w-lg leading-relaxed">Pacotes de engajamento para Instagram, TikTok, Facebook e Kwai. Entrega rápida, suporte 24h e resultados garantidos.</p>
              <div className="flex gap-10">
                {[['50k+', 'Clientes'], ['99%', 'Satisfação'], ['24h', 'Suporte']].map(([num, label]) => (
                  <div key={label} className="text-right">
                    <div className="font-clash text-4xl font-bold tracking-tight">{num}</div>
                    <div className="text-sm text-gray-400 font-semibold mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Cards */}
            <div className="grid grid-cols-2 gap-6">
              {PLAT_KEYS.map(key => {
                const p = PLATFORMS[key];
                return (
                  <div
                    key={key}
                    onClick={() => { setCurrentPlat(key); setView('services'); window.scrollTo({ top: 0 }); }}
                    className={`${PLAT_CLASSES[key]} rounded-3xl p-10 cursor-pointer relative overflow-hidden min-h-72 flex flex-col justify-between hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-18 h-18 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center text-3xl w-[72px] h-[72px]">{p.emoji}</div>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition">↗</div>
                    </div>
                    <div>
                      <div className="font-clash text-4xl font-bold text-white leading-none mb-3">{p.name}</div>
                      <div className="flex gap-2 flex-wrap">
                        {[...new Set(p.services.map(s => s.cat))].slice(0, 3).map(c => (
                          <span key={c} className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 capitalize">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-20px] text-[160px] opacity-[0.08] leading-none pointer-events-none">{p.emoji}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* WhatsApp CTA */}
          <section className="max-w-6xl mx-auto px-12 pb-24">
            <div className="bg-white border border-gray-200 rounded-3xl p-10 flex flex-wrap items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.993 0C5.384 0 0 5.373 0 11.97c0 2.096.549 4.062 1.508 5.775L.057 24l6.438-1.685A11.95 11.95 0 0011.993 24c6.61 0 11.994-5.373 11.994-11.97S18.603 0 11.993 0z"/></svg>
                </div>
                <div>
                  <div className="font-clash text-2xl font-bold mb-1">Precisa de ajuda?</div>
                  <div className="text-gray-500 text-base">Fale com nossa equipe no WhatsApp e receba atendimento imediato.</div>
                </div>
              </div>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-9 py-4 rounded-full font-bold text-base hover:bg-[#128C7E] transition hover:-translate-y-0.5 shadow-lg shadow-green-200 flex items-center gap-2 whitespace-nowrap">
                💬 Falar no WhatsApp
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-6xl mx-auto px-12 pb-24">
            <div className="text-center mb-14">
              <div className="font-clash text-4xl font-bold tracking-tight mb-3">Perguntas Frequentes</div>
              <div className="text-gray-400">Tire suas dúvidas antes de comprar.</div>
            </div>
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {[
                ['Os seguidores são reais?', 'Sim! Trabalhamos com perfis de alta qualidade. Seguidores Mundiais são perfis internacionais e Seguidores Brasileiros são perfis locais com atividade comprovada.'],
                ['Quanto tempo leva a entrega?', 'A maioria dos pedidos começa em até 30 minutos após a confirmação do pagamento. Pedidos grandes podem levar algumas horas para completar.'],
                ['Minha conta pode ser banida?', 'Nosso método é seguro e discreto. Entregamos de forma gradual, respeitando os limites das plataformas para proteção máxima.'],
                ['O pagamento é seguro?', 'Sim! Processamos pagamentos via PIX, o método mais seguro e rápido do Brasil. Seu dinheiro só é liberado após confirmação do serviço.'],
                ['Posso pedir reembolso?', 'Sim! Caso o serviço não seja entregue no prazo combinado, oferecemos reembolso total ou reposição dos itens.'],
              ].map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#FAFAFA] py-16 text-center border-t border-gray-100">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="bg-blue-500 rounded-lg w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
              </div>
              <span className="font-clash text-xl font-bold">Metrica<span className="text-[#f9317a]">Up</span></span>
            </div>
            <p className="text-sm text-gray-400 mb-4">© 2025 MetricaUp. Todos os direitos reservados.</p>
            <div className="flex justify-center gap-6">
              {['Termos de Uso', 'Privacidade', 'Contato'].map(l => <a key={l} href="#" className="text-sm text-gray-400 hover:text-gray-700 transition">{l}</a>)}
            </div>
          </footer>
        </main>
      )}

      {view === 'services' && currentPlat && (
        <ServicesSection
          platKey={currentPlat}
          onBack={goHome}
          onCheckout={sid => {
            const s = findService(sid);
            if (s) { setCurrentService(s); setView('checkout'); window.scrollTo({ top: 0 }); }
          }}
        />
      )}

      {view === 'checkout' && currentService && (
        <CheckoutSection
          service={currentService}
          onBack={() => { setView('services'); window.scrollTo({ top: 0 }); }}
          onPix={(data, qty) => { setPixData(data); setPixQty(qty); setView('pix'); window.scrollTo({ top: 0 }); }}
        />
      )}

      {view === 'pix' && pixData && pixQty && (
        <PixSection pixData={pixData} selectedQty={pixQty} onHome={goHome} />
      )}
    </>
  );
}
