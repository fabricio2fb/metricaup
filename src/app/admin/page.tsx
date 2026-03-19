'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface Order {
  id: string;
  email: string;
  whatsapp?: string;
  link: string;
  service: string;
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

const PLATFORMS = [
  { key: 'todos', label: 'Todos', emoji: '📊', color: '#6366f1' },
  { key: 'instagram', label: 'Instagram', emoji: '📸', color: '#e1306c' },
  { key: 'tiktok', label: 'TikTok', emoji: '🎵', color: '#69c9d0' },
  { key: 'facebook', label: 'Facebook', emoji: '👥', color: '#1877f2' },
  { key: 'kwai', label: 'Kwai', emoji: '🎬', color: '#ff6b00' },
];

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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
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

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="text-xl mb-3">{icon}</div>
      <div className="text-xl font-bold text-white mb-0.5 tracking-tight">{value}</div>
      <div className="text-xs text-white/40 font-medium">{label}</div>
      {sub && <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>}
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

// ─── MAIN ADMIN ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [platFilter, setPlatFilter] = useState('todos');
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics'>('orders');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth check
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('admin_auth') === '1';
    const persistentAuth = localStorage.getItem('admin_auth_token') === H_TOKEN;
    
    if (sessionAuth || persistentAuth) {
      setAuthed(true);
    }
    setCheckingAuth(false);
  }, []);

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

  useEffect(() => {
    if (authed) {
      loadOrders();
    }
  }, [authed, loadOrders]);

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

  function logout() {
    sessionStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_auth_token');
    setAuthed(false);
  }

  // Platform counts for sidebar badges
  const platCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: orders.length };
    PLATFORMS.slice(1).forEach(p => {
      counts[p.key] = orders.filter(o => getOrderPlatform(o) === p.key).length;
    });
    return counts;
  }, [orders]);

  // Filtered
  const filtered = useMemo(() => {
    return orders.filter(o => {
      const q = search.toLowerCase();
      const matchSearch = !q || o.email?.toLowerCase().includes(q) || o.service?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q);
      const matchStatus = !statusFilter || o.status === statusFilter;
      const matchPlat = platFilter === 'todos' || getOrderPlatform(o) === platFilter;
      return matchSearch && matchStatus && matchPlat;
    });
  }, [orders, search, statusFilter, platFilter]);

  const stats = useMemo(() => {
    const src = platFilter === 'todos' ? orders : orders.filter(o => getOrderPlatform(o) === platFilter);
    const approved = src.filter(o => o.status === 'Aprovado' || o.status === 'Entregue');
    const revenue = approved.reduce((s, o) => s + Number(o.val), 0);
    const pending = src.filter(o => o.status === 'Aguardando Pagamento').length;
    const conv = src.length > 0 ? Math.round((approved.length / src.length) * 100) : 0;
    return { total: src.length, approved: approved.length, revenue, pending, conv };
  }, [orders, platFilter]);

  if (checkingAuth) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /></div>;
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  const currentPlat = PLATFORMS.find(p => p.key === platFilter)!;

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
          {([['orders', '📦', 'Pedidos'], ['analytics', '📊', 'Analytics']] as const).map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
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
          {PLATFORMS.map(p => (
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
      <main className="flex-1 md:ml-60 min-h-screen">
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
                <h1 className="font-bold text-base text-white truncate">
                  {platFilter === 'todos' ? 'Todos os Pedidos' : currentPlat.label}
                </h1>
              </div>
              {lastUpdated && <p className="text-[10px] text-white/25 hidden sm:block">Atualizado {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Push notification bell */}
            <PushBell />
            <button onClick={loadOrders} className="flex items-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl text-xs font-medium transition-all">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <button onClick={clearOrders} className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium transition-all">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-7">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard icon="📦" label="Pedidos" value={stats.total} />
            <StatCard icon="✅" label="Aprovados" value={stats.approved} sub={`${stats.conv}% conversão`} />
            <StatCard icon="⏳" label="Aguardando" value={stats.pending} />
            <StatCard icon="💰" label="Receita" value={`R$ ${stats.revenue.toFixed(2).replace('.', ',')}`} />
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
                  {(platFilter === 'todos' ? orders : orders.filter(o => getOrderPlatform(o) === platFilter)).slice(0, 10).map(o => (
                    <div key={o.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center text-sm flex-shrink-0">
                        {getOrderPlatform(o) === 'instagram' ? '📸' : getOrderPlatform(o) === 'tiktok' ? '🎵' : getOrderPlatform(o) === 'facebook' ? '👥' : '🎬'}
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

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <>
              {/* Filters */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-white/25 transition text-white placeholder:text-white/20"
                    placeholder="Buscar..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none text-white/60 flex-shrink-0"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos</option>
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
                          const plat = PLATFORMS.find(p => p.key === getOrderPlatform(o));
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
                  const plat = PLATFORMS.find(p => p.key === getOrderPlatform(o));
                  return (
                    <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl flex-shrink-0">{plat?.emoji}</span>
                          <div className="min-w-0">
                            <div className="font-medium text-white/80 text-sm truncate">{o.service}</div>
                            <div className="text-white/30 text-xs">{o.id}</div>
                          </div>
                        </div>
                        <div className="text-emerald-400 font-bold text-sm flex-shrink-0">R${Number(o.val).toFixed(2).replace('.', ',')}</div>
                      </div>
                      {/* Link do perfil */}
                      {o.link && (
                        <a href={o.link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 text-xs truncate hover:text-blue-300 transition">
                          <span>🔗</span>
                          <span className="truncate">{o.link.replace(/^https?:\/\//, '')}</span>
                        </a>
                      )}
                      <div className="flex items-center justify-between">
                        <StatusBadge status={o.status} />
                        <div className="text-white/40 text-xs">{o.qty >= 1000 ? (o.qty/1000)+'k' : o.qty} unid.</div>
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
