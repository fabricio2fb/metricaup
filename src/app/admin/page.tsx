'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface Order {
  id: string;
  email: string;
  whatsapp?: string;
  link: string;
  service: string;
  platform?: string; // New column
  qty: number;
  val: number;
  status: string;
  created_at: string;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const H_EMAIL = '6c1d162092e4828cb7abb1d6e802a47b693d79185e5b63022128f5e1be95ff42';
const H_PASS  = 'bb3abc9277e6bb56f44ff114d3fabb6fc9e2f5cfaacef38b30809d2a43cc8b5c';
const H_CODE  = '1f70605832904ce607ab09b924407ce119a6f0dd9bd61e944e3091c65e30d3d6';
const H_TOKEN = 'f4b4ff99ed0fa4911366ad6dd8f1119149c671516cf2f83634807773680b9d32';

async function sha256(str: string) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// PLATFORMS movidos para carregar do banco de dados no componente principal

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'Aguardando Pagamento': { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  'Aprovado': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Em Processamento': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  'Entregue': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  'Cancelado': { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
};
const STATUSES = Object.keys(STATUS_STYLES);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getOrderPlatform(order: Order): string {
  const name = (order.service || '').toLowerCase();
  if (name.includes('instagram') || name.includes('reels') || name.includes('stories')) return 'instagram';
  if (name.includes('tiktok')) return 'tiktok';
  if (name.includes('facebook')) return 'facebook';
  if (name.includes('kwai')) return 'kwai';
  return 'instagram'; // fallback
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || { bg: 'bg-white/10', text: 'text-white/50', dot: 'bg-white/30' };
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${s.bg} ${s.text} whitespace-nowrap uppercase tracking-tighter`}>
      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const hEmail = await sha256(email.trim().toLowerCase());
      const hPass = await sha256(pass);
      const hCode = await sha256(code.trim());

      if (hEmail === H_EMAIL && hPass === H_PASS && hCode === H_CODE) {
        if (remember) {
          localStorage.setItem('admin_auth_token', H_TOKEN);
        } else {
          sessionStorage.setItem('admin_auth', '1');
        }
        onLogin();
      } else {
        setError('Credenciais ou código de segurança incorretos.');
      }
    } catch {
      setError('Erro ao processar login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 bg-[#f9317a] rounded-xl flex items-center justify-center shadow-lg shadow-pink-900/30">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">Metrica<span className="text-[#f9317a]">Up</span></span>
          </div>
          <p className="text-white/40 text-sm">Acesso Restrito — Controle Administrativo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[2px] mb-2 block">E-mail Administrativo</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-white/30 transition placeholder:text-white/10"
              placeholder="seu@email.com"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              autoComplete="email"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[2px] mb-2 block">Sua Senha</label>
              <div className="relative">
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-white/30 transition placeholder:text-white/10 pr-10"
                  placeholder="••••••••"
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => { setPass(e.target.value); setError(''); }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition">
                  {showPass ? '👁' : '👁‍🗨'}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[2px] mb-2 block">Código (PIN)</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-white/30 transition placeholder:text-white/10"
                placeholder="0000"
                maxLength={4}
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="sr-only"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${remember ? 'bg-[#f9317a] border-[#f9317a]' : 'border-white/10 group-hover:border-white/20'}`}>
              {remember && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs text-white/40 group-hover:text-white/60 transition">Manter-me logado</span>
          </label>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5 text-red-400 text-xs flex items-center gap-2.5 animate-shake">
              <span className="text-base text-red-500">⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !pass || !code}
            className="w-full bg-[#f9317a] hover:bg-[#e0195f] text-white py-4 rounded-xl font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Validando...</>
            ) : 'Acessar Dashboard Admin'}
          </button>
        </form>

        <p className="text-center text-white/10 text-xs mt-8 uppercase tracking-[1px]">Protocolo de Segurança Ativo</p>
      </div>
    </div>
  );
}

// ─── EDITOR TAB ─────────────────────────────────────────────────────────────
function EditorTab() {
  const [data, setData] = useState<{ platforms: any[]; services: any[]; variants: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlat, setSelectedPlat] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      const d = await res.json();
      setData(d);
      if (d.platforms?.length > 0 && !selectedPlat) {
        setSelectedPlat(d.platforms[0].id);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [selectedPlat]);

  useEffect(() => { loadData(); }, []);

  async function updateService(id: string, update: any) {
    setSaving(true);
    await fetch('/api/admin/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'service', id, data: update })
    });
    await loadData();
    setSaving(false);
  }

  async function updateVariant(id: string, update: any) {
    setSaving(true);
    await fetch('/api/admin/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'variant', id, data: update })
    });
    await loadData();
    setSaving(false);
  }

  async function addVariant(serviceId: string) {
    setSaving(true);
    await fetch('/api/admin/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'add_variant',
        data: { service_id: serviceId, qty: 100, price: 5.00, order: 99 }
      })
    });
    await loadData();
    setSaving(false);
  }

  async function deleteVariant(id: string) {
    if (!confirm('Excluir este preço?')) return;
    setSaving(true);
    await fetch('/api/admin/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'delete_variant', id })
    });
    await loadData();
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-center py-12 text-white/30">Erro ao carregar dados.</div>;

  const currentServices = data.services.filter(s => s.platform_id === selectedPlat);

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      {/* Platforms List */}
      <div className="space-y-1">
        <div className="text-[10px] text-white/25 uppercase tracking-widest px-3 mb-2 font-bold">Plataformas</div>
        {data.platforms.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelectedPlat(p.id); setSelectedService(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${selectedPlat === p.id ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}
          >
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              {p.logo_svg ? (
                <div className="w-5 h-5 text-white" dangerouslySetInnerHTML={{ __html: p.logo_svg }} />
              ) : (
                <span className="text-lg">{p.emoji}</span>
              )}
            </div>
            <span className="font-semibold text-xs">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Services List / Editor */}
      <div className="space-y-4">
        {!selectedService ? (
          <>
            <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-bold px-1">Serviços Disponíveis</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {currentServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:border-white/20 transition-all flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.icon_bg, color: s.icon_color }} dangerouslySetInnerHTML={{ __html: s.icon }} />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm truncate">{s.name}</div>
                    <div className="text-[10px] text-white/20 truncate">{s.category}</div>
                  </div>
                  <span className="text-white/20 group-hover:text-white/40">→</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-white/8 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedService(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">←</button>
                <div>
                  <div className="text-[10px] text-white/25 uppercase tracking-widest font-bold">Editando Serviço</div>
                  <div className="font-bold text-lg">{selectedService.name}</div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedService.icon_bg, color: selectedService.icon_color }} dangerouslySetInnerHTML={{ __html: selectedService.icon }} />
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-white/30 uppercase font-bold block mb-2 px-1">Nome do Serviço</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f9317a]/50 transition"
                      value={selectedService.name}
                      onChange={e => setSelectedService({ ...selectedService, name: e.target.value })}
                      onBlur={() => updateService(selectedService.id, { name: selectedService.name })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/30 uppercase font-bold block mb-2 px-1">Descrição</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f9317a]/50 transition h-24 resize-none"
                      value={selectedService.description}
                      onChange={e => setSelectedService({ ...selectedService, description: e.target.value })}
                      onBlur={() => updateService(selectedService.id, { description: selectedService.description })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/30 uppercase font-bold block mb-2 px-1">Ícone (Emoji ou SVG)</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f9317a]/50 transition"
                      value={selectedService.icon}
                      onChange={e => setSelectedService({ ...selectedService, icon: e.target.value })}
                      onBlur={() => updateService(selectedService.id, { icon: selectedService.icon })}
                    />
                  </div>
                </div>

                {/* Variants Editor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] text-white/30 uppercase font-bold">Tabela de Preços</label>
                    <button onClick={() => addVariant(selectedService.id)} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-all font-bold">+ NOVO PREÇO</button>
                  </div>
                  <div className="space-y-2">
                    {data.variants.filter(v => v.service_id === selectedService.id).sort((a,b) => a.order - b.order).map(v => (
                      <div key={v.id} className="flex items-center gap-2 bg-black/20 p-2 rounded-xl group/var">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div className="relative">
                            <input
                              type="number"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs outline-none focus:border-white/30 transition text-center font-bold"
                              value={v.qty}
                              onChange={e => {
                                const newVal = parseInt(e.target.value);
                                const updatedVariants = data.variants.map(varitem => varitem.id === v.id ? { ...varitem, qty: newVal } : varitem);
                                setData({ ...data, variants: updatedVariants });
                              }}
                              onBlur={(e) => updateVariant(v.id, { qty: parseInt(e.target.value) })}
                            />
                            <div className="absolute -top-1.5 left-2 bg-[#111] px-1 text-[8px] text-white/20 font-bold uppercase">Qtd</div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs outline-none focus:border-white/30 transition text-center font-bold text-emerald-400"
                              value={v.price}
                              onChange={e => {
                                const newVal = parseFloat(e.target.value);
                                const updatedVariants = data.variants.map(varitem => varitem.id === v.id ? { ...varitem, price: newVal } : varitem);
                                setData({ ...data, variants: updatedVariants });
                              }}
                              onBlur={(e) => updateVariant(v.id, { price: parseFloat(e.target.value) })}
                            />
                            <div className="absolute -top-1.5 left-2 bg-[#111] px-1 text-[8px] text-white/20 font-bold uppercase">R$</div>
                          </div>
                        </div>
                        <button onClick={() => deleteVariant(v.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all opacity-0 group-hover/var:opacity-100 italic font-serif">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-4">
                <span className="text-xl">💡</span>
                <p className="text-xs text-blue-300 leading-relaxed">
                  As alterações são salvas <strong>automaticamente</strong> assim que você sai de um campo (onBlur). Novos preços aparecem instantaneamente na página oficial.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {saving && (
        <div className="fixed bottom-6 right-6 bg-white text-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">Salvando no banco...</span>
        </div>
      )}
    </div>
  );
}
function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-2.5 flex flex-col justify-between h-auto">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm">{icon}</span>
        {sub && <span className="text-[8px] text-white/20 font-bold">{sub}</span>}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold text-white truncate">{value}</div>
        <div className="text-[9px] text-white/30 font-semibold uppercase tracking-tighter truncate">{label}</div>
      </div>
    </div>
  );
}

// ─── COPY BUTTON ─────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold transition border ${copied ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/8 border-white/10 text-white/30 hover:text-white/60 hover:bg-white/12'}`}
      title="Copiar link"
    >
      {copied ? '✓' : '⎘'}
    </button>
  );
}

// ─── PUSH NOTIFICATION BELL ────────────────────────────────────────────────
function PushBell() {
  const { supported, subscribed, loading, subscribe, unsubscribe } = usePushNotifications();
  if (!supported) return null;
  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      title={subscribed ? 'Desativar notificações push' : 'Ativar notificações push'}
      className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-medium transition-all disabled:opacity-50 ${
        subscribed
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
          : 'bg-white/8 border-white/10 text-white/60 hover:bg-white/12'
      }`}
    >
      {loading ? (
        <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : (
        <span className="text-sm">{subscribed ? '🔔' : '🔕'}</span>
      )}
      <span className="hidden sm:inline">{subscribed ? 'Push Ativo' : 'Notif.'}</span>
      {subscribed && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
    </button>
  );
}

interface Gasto {
  id: string;
  data: string;
  ads: number;
  plataforma: number;
}

// ─── GASTOS TAB ─────────────────────────────────────────────────────────────
function GastosTab({ gastos, reloadGastos }: { gastos: Gasto[]; reloadGastos: () => void }) {
  const [ads, setAds] = useState('');
  const [plat, setPlat] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  async function addGasto(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads, plataforma: plat, data: date })
      });
      const data = await res.json();
      if (data.error) {
        alert('Erro ao salvar: ' + data.error);
      } else {
        setAds('');
        setPlat('');
        reloadGastos();
      }
    } catch (err: any) {
      alert('Erro na requisição: ' + err.message);
    }
    setSaving(false);
  }

  async function deleteGasto(id: string) {
    if (!confirm('Excluir este registo?')) return;
    await fetch(`/api/gastos?id=${id}`, { method: 'DELETE' });
    reloadGastos();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addGasto} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:flex gap-4 items-end">
        <div className="flex-1 space-y-3 md:space-y-0 md:flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-white/60 mb-1 block">Data</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-white/30" style={{ colorScheme: 'dark' }} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-white/60 mb-1 block">Ads (R$)</label>
            <input type="number" required step="0.01" value={ads} onChange={e => setAds(e.target.value)} placeholder="0.00" className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-white/30" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-white/60 mb-1 block">Plataforma (R$)</label>
            <input type="number" required step="0.01" value={plat} onChange={e => setPlat(e.target.value)} placeholder="0.00" className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-white/30" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-4 md:mt-0 px-5 py-2.5 bg-[#f9317a] hover:bg-[#e0195f] text-white font-bold text-sm rounded-xl transition shadow-lg w-full md:w-auto flex-shrink-0 disabled:opacity-50">
          {saving ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-xs text-white/40 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Ads</th>
              <th className="px-4 py-3 font-medium">Plataforma</th>
              <th className="px-4 py-3 font-medium">Total Dia</th>
              <th className="px-4 py-3 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {gastos.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-white/30">Nenhum gasto registrado</td></tr>
            ) : gastos.map(g => {
              const total = Number(g.ads) + Number(g.plataforma);
              return (
                <tr key={g.id} className="hover:bg-white/3 transition">
                  <td className="px-4 py-3 text-white/80">{g.data.split('-').reverse().join('/')}</td>
                  <td className="px-4 py-3 text-red-400">R$ {Number(g.ads).toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3 text-red-400">R$ {Number(g.plataforma).toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3 font-bold text-white">R$ {total.toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteGasto(g.id)} className="text-white/30 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition" title="Excluir">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6L18.2 20.4A2 2 0 0 1 16.2 22H7.8a2 2 0 0 1-2-1.6L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [platFilter, setPlatFilter] = useState('todos');
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'gastos' | 'editor'>('orders');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [platformsData, setPlatformsData] = useState<any[]>([]);

  // Fetch Platforms for Filter
  useEffect(() => {
    async function loadPlats() {
      try {
        const res = await fetch('/api/platforms');
        const data = await res.json();
        if (data && !data.error) {
          const formatted = [
            { key: 'todos', label: 'Todos', emoji: '📊', color: '#6366f1' },
            ...Object.entries(data).map(([key, p]: any) => ({
              key,
              label: p.name,
              emoji: p.emoji,
              color: '#f9317a' // default color or could be extracted from gradient
            }))
          ];
          setPlatformsData(formatted);
        }
      } catch (err) {
        console.error('Erro ao carregar plataformas admin:', err);
      }
    }
    loadPlats();
  }, []);

  const adminPlatforms = useMemo(() => {
    if (platformsData.length > 0) return platformsData;
    return [
      { key: 'todos', label: 'Todos', emoji: '📊', color: '#6366f1' },
      { key: 'instagram', label: 'Instagram', emoji: '📸', color: '#e1306c' },
      { key: 'tiktok', label: 'TikTok', emoji: '🎵', color: '#69c9d0' },
      { key: 'facebook', label: 'Facebook', emoji: '👥', color: '#1877f2' },
      { key: 'kwai', label: 'Kwai', emoji: '🎬', color: '#ff6b00' },
    ];
  }, [platformsData]);

  // Auth check
  useEffect(() => {
    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    const sessionAuth = sessionStorage.getItem('admin_auth') === '1';
    const persistentAuth = localStorage.getItem('admin_auth_token') === H_TOKEN;
    
    if (sessionAuth || persistentAuth) {
      setAuthed(true);
    }
    setCheckingAuth(false);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pedidos');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch { setOrders([]); }
    setLoading(false);
  }, []);

  const loadGastos = useCallback(async () => {
    try {
      const res = await fetch('/api/gastos');
      const data = await res.json();
      if (Array.isArray(data)) setGastos(data);
    } catch {}
  }, []);

  useEffect(() => {
    if (authed) {
      loadOrders();
      loadGastos();
    }
  }, [authed, loadOrders, loadGastos]);

  async function advanceStatus(id: string, current: string) {
    const next = STATUSES[(STATUSES.indexOf(current) + 1) % STATUSES.length];
    await fetch(`/api/pedidos/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: next } : o));
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/pedidos/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  async function clearOrders() {
    if (!confirm('Apagar TODOS os pedidos? Esta ação não pode ser desfeita.')) return;
    await fetch('/api/pedidos', { method: 'DELETE' });
    setOrders([]);
  }

  async function testPush() {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '🔔 Teste de Notificação',
        body: 'Se você está vendo isso, as notificações estão funcionando!',
      }),
    });
    alert('Teste enviado! Verifique seu dispositivo.');
  }

  function logout() {
    sessionStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_auth_token');
    setAuthed(false);
  }

  // Platform counts for sidebar badges
  const platCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: orders.length };
    adminPlatforms.slice(1).forEach((p: any) => {
      counts[p.key] = orders.filter(o => (o.platform || 'instagram') === p.key).length;
    });
    return counts;
  }, [orders, adminPlatforms]);

  // Filtered
  const filtered = useMemo(() => {
    return orders.filter(o => {
      const q = search.toLowerCase();
      const matchSearch = !q || o.email?.toLowerCase().includes(q) || o.service?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q);
      const matchStatus = !statusFilter || o.status === statusFilter;
      const matchPlat = platFilter === 'todos' || (o.platform || 'instagram') === platFilter;
      return matchSearch && matchStatus && matchPlat;
    });
  }, [orders, search, statusFilter, platFilter]);

  const stats = useMemo(() => {
    const src = platFilter === 'todos' ? orders : orders.filter(o => getOrderPlatform(o) === platFilter);
    const approved = src.filter(o => o.status === 'Aprovado' || o.status === 'Entregue');
    const revenue = approved.reduce((s, o) => s + Number(o.val), 0);
    const pending = src.filter(o => o.status === 'Aguardando Pagamento').length;
    const conv = src.length > 0 ? Math.round((approved.length / src.length) * 100) : 0;
    const totalAds = gastos.reduce((acc, g) => acc + Number(g.ads), 0);
    const totalPlat = gastos.reduce((acc, g) => acc + Number(g.plataforma), 0);
    const roi = revenue - totalAds - totalPlat;
    return { total: src.length, approved: approved.length, revenue, pending, conv, roi };
  }, [orders, platFilter, gastos]);

  if (checkingAuth) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /></div>;
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  const currentPlat = adminPlatforms.find(p => p.key === platFilter) || adminPlatforms[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex text-sm">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-[#111] border-r border-white/8 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#f9317a] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
              </div>
              <span className="font-bold text-base tracking-tight">Metrica<span className="text-[#f9317a]">Up</span></span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white/70">✕</button>
          </div>
          <div className="text-[10px] text-white/25 mt-1 tracking-widest uppercase">Admin Panel</div>
        </div>

        {/* Tabs */}
        <div className="p-3 border-b border-white/8">
          {([['orders', '📦', 'Pedidos'], ['analytics', '📊', 'Analytics'], ['gastos', '💸', 'Gastos'], ['editor', '✏️', 'Editor']] as const).map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id as any); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all mb-0.5 ${activeTab === id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
            >
              <span>{icon}</span>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Platform filters */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="text-[10px] text-white/25 uppercase tracking-widest px-3 mb-2 font-semibold">Plataformas</div>
          {adminPlatforms.map(p => (
            <button
              key={p.key}
              onClick={() => { setPlatFilter(p.key); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all mb-0.5 group ${platFilter === p.key ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              style={platFilter === p.key ? { backgroundColor: p.color + '20', color: 'white' } : {}}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base">{p.emoji}</span>
                <span className="font-medium">{p.label}</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${platFilter === p.key ? 'bg-white/20 text-white' : 'bg-white/8 text-white/30'}`}>
                {platCounts[p.key] ?? 0}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/8 space-y-0.5">
          {showInstallBtn && (
            <button
              onClick={handleInstall}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#f9317a]/10 text-[#f9317a] hover:bg-[#f9317a]/20 transition-all font-bold mb-1"
            >
              <span>📲</span>
              <span className="text-[11px] uppercase tracking-wider">Instalar Painel</span>
            </button>
          )}
          <a href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
            <span>🌐</span> <span className="font-medium">Ver Site</span>
          </a>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-white/8">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
          >
            <span>🚪</span>
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 md:ml-60 min-h-screen max-w-full overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/8 px-4 md:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger */}
            <button onClick={() => setSidebarOpen(true)} className="md:hidden flex-shrink-0 w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base">{currentPlat.emoji}</span>
                <h1 className="font-bold text-[13px] md:text-base text-white truncate max-w-[120px] sm:max-w-none">
                  {platFilter === 'todos' ? 'Todos os Pedidos' : currentPlat.label}
                </h1>
              </div>
              {lastUpdated && <p className="text-[10px] text-white/25 hidden sm:block">Atualizado {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-1.5 flex-shrink-0">
            <PushBell />
            <button onClick={loadOrders} title="Atualizar pedidos" className="flex items-center justify-center w-8 h-8 bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg transition-all">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
            </button>
            <button onClick={testPush} title="Testar Notificações" className="hidden sm:flex items-center justify-center w-8 h-8 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg transition-all">
              <span>🚀</span>
            </button>
            <button onClick={clearOrders} title="Limpar Pedidos" className="hidden sm:flex items-center justify-center w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </header>

        <div className="p-2 md:p-7">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-1.5 md:gap-4 mb-5">
            <StatCard icon="📦" label="Pedidos" value={stats.total} />
            <StatCard icon="✅" label="Aprovados" value={stats.approved} sub={`${stats.conv}%`} />
            <StatCard icon="⌛" label="Pendente" value={stats.pending} />
            <StatCard icon="💰" label="Receita" value={`R$ ${Math.floor(stats.revenue)}`} />
            <StatCard icon="🚀" label="ROI" value={`R$ ${Math.floor(stats.roi)}`} />
          </div>

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2">📊 Distribuição por Status</h2>
                <div className="space-y-3">
                  {STATUSES.map(s => {
                    const cnt = filtered.filter(o => o.status === s).length;
                    const pct = filtered.length > 0 ? (cnt / filtered.length) * 100 : 0;
                    const st = STATUS_STYLES[s];
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <StatusBadge status={s} />
                        <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${st.dot}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-white/40 text-xs w-6 text-right">{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="font-semibold mb-4">🕐 Atividade Recente</h2>
                <div className="space-y-2">
                  {(platFilter === 'todos' ? orders : orders.filter(o => (o.platform || 'instagram') === platFilter)).slice(0, 10).map(o => (
                    <div key={o.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 text-[11px] md:text-sm">
                      <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center text-sm flex-shrink-0">
                        {(() => {
                          const p = adminPlatforms.find(p => p.key === (o.platform || 'instagram'));
                          return p?.emoji || '📸';
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white/80 text-xs font-medium truncate">{o.service}</div>
                        <div className="text-white/30 text-[10px]">{o.email}</div>
                      </div>
                      <StatusBadge status={o.status} />
                      <span className="text-emerald-400 text-xs font-semibold flex-shrink-0">R${Number(o.val).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GASTOS TAB */}
          {activeTab === 'gastos' && (
            <GastosTab gastos={gastos} reloadGastos={loadGastos} />
          )}

          {/* EDITOR TAB */}
          {activeTab === 'editor' && (
            <EditorTab />
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-white/25 transition text-white placeholder:text-white/20"
                    placeholder="Buscar pedido..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white/60 flex-shrink-0 h-[42px] sm:h-auto"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">Status: Todos</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="text-[10px] text-white/25 mb-3">{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</div>

              {/* Table — desktop */}
              <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-16 text-white/30">
                    <div className="text-3xl mb-2">📭</div>
                    <div className="font-medium text-sm">Nenhum pedido</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/8">
                          {['ID', 'Plat.', 'Serviço / Link', 'Qtd', 'Valor', 'Cliente', 'Status', ''].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-semibold text-white/25 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(o => {
                          const plat = adminPlatforms.find(p => p.key === (o.platform || 'instagram'));
                          return (
                            <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                              <td className="px-4 py-3 font-mono text-white/30 text-[10px]">{o.id}</td>
                              <td className="px-4 py-3 text-base">{plat?.emoji}</td>
                              <td className="px-4 py-3 max-w-[200px]">
                                <div className="text-white/70 truncate font-medium text-xs">{o.service}</div>
                                {o.link && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <a href={o.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-[10px] truncate transition flex-1 min-w-0" title={o.link}>
                                      🔗 {o.link.replace(/^https?:\/\//, '').slice(0, 28)}{o.link.length > 34 ? '…' : ''}
                                    </a>
                                    <CopyBtn text={o.link} />
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-white/50">{o.qty >= 1000 ? (o.qty / 1000) + 'k' : o.qty}</td>
                              <td className="px-4 py-3 font-semibold text-emerald-400">R${Number(o.val).toFixed(2).replace('.', ',')}</td>
                              <td className="px-4 py-3">
                                <div className="text-white/70 text-xs">{o.email}</div>
                                {o.whatsapp && (
                                  <a
                                    href={`https://wa.me/55${o.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-green-400 hover:text-green-300 transition mt-0.5"
                                  >
                                    <span>💬</span> {o.whatsapp}
                                  </a>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <select value={o.status} onChange={e => setStatus(o.id, e.target.value)} className="bg-transparent border-0 outline-none text-xs cursor-pointer text-white/50 mb-1 w-full" style={{ backgroundColor: 'transparent' }}>
                                  {STATUSES.map(s => <option key={s} value={s} style={{ backgroundColor: '#111' }}>{s}</option>)}
                                </select>
                                <StatusBadge status={o.status} />
                              </td>
                              <td className="px-4 py-3">
                                <button onClick={() => advanceStatus(o.id, o.status)} className="bg-white/8 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-lg transition whitespace-nowrap">→</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Cards — mobile */}
              <div className="md:hidden space-y-3">
                {loading ? (
                  <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-12 text-white/30">
                    <div className="text-3xl mb-2">📭</div>
                    <div className="text-sm">Nenhum pedido</div>
                  </div>
                ) : filtered.map(o => {
                  const plat = adminPlatforms.find(p => p.key === (o.platform || 'instagram'));
                  return (
                    <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xl flex-shrink-0">{plat?.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white/90 text-sm leading-tight truncate">{o.service}</div>
                            <div className="text-white/20 text-[10px] font-mono mt-0.5">{o.id}</div>
                          </div>
                        </div>
                        <div className="text-emerald-400 font-bold text-sm flex-shrink-0">R${Number(o.val).toFixed(2).replace('.', ',')}</div>
                      </div>
                      {/* Link do perfil */}
                      {o.link && (
                        <div className="flex items-center gap-2 bg-black/20 rounded-lg p-2">
                          <a href={o.link} target="_blank" rel="noreferrer" className="flex-1 flex items-center gap-1.5 text-blue-400 text-[11px] truncate hover:text-blue-300 transition">
                            <span className="flex-shrink-0">🔗</span>
                            <span className="truncate">{o.link.replace(/^https?:\/\//, '')}</span>
                          </a>
                          <CopyBtn text={o.link} />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <StatusBadge status={o.status} />
                        <div className="text-white/40 text-[10px] font-medium">{o.qty >= 1000 ? (o.qty/1000)+'k' : o.qty} unidades</div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-white/40 text-xs truncate flex-1">{o.email}</div>
                        {o.whatsapp && (
                          <a
                            href={`https://wa.me/55${o.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full hover:bg-green-500/20 transition flex-shrink-0"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <select value={o.status} onChange={e => setStatus(o.id, e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white/50 outline-none" style={{ backgroundColor: '#1a1a1a' }}>
                          {STATUSES.map(s => <option key={s} value={s} style={{ backgroundColor: '#111' }}>{s}</option>)}
                        </select>
                        <button onClick={() => advanceStatus(o.id, o.status)} className="bg-white/8 border border-white/10 px-3 py-1.5 rounded-lg text-xs hover:bg-white/15 transition flex-shrink-0">→ Avançar</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
