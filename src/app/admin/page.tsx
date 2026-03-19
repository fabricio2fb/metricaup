'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

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

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'Aguardando Pagamento': { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  'Aprovado': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Em Processamento': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  'Entregue': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  'Cancelado': { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
};

const STATUSES = ['Aguardando Pagamento', 'Aprovado', 'Em Processamento', 'Entregue', 'Cancelado'];

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg ${color}`}>{icon}</div>
      <div className="text-2xl font-bold text-white mb-1 tracking-tight">{value}</div>
      <div className="text-sm text-white/50 font-medium">{label}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || { bg: 'bg-white/10', text: 'text-white/50', dot: 'bg-white/30' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics'>('orders');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  async function advanceStatus(id: string, current: string) {
    const idx = STATUSES.indexOf(current);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: next } : o));
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  async function clearOrders() {
    if (!confirm('Apagar TODOS os pedidos? Esta ação não pode ser desfeita.')) return;
    await fetch('/api/pedidos', { method: 'DELETE' });
    setOrders([]);
  }

  const filtered = useMemo(() => orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.email?.toLowerCase().includes(q) || o.service?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q) || o.link?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  }), [orders, search, statusFilter]);

  // Analytics
  const stats = useMemo(() => {
    const total = orders.length;
    const approved = orders.filter(o => o.status === 'Aprovado' || o.status === 'Entregue');
    const pending = orders.filter(o => o.status === 'Aguardando Pagamento');
    const revenue = approved.reduce((s, o) => s + Number(o.val), 0);
    const totalRevenue = orders.reduce((s, o) => s + Number(o.val), 0);

    const byService: Record<string, { count: number; revenue: number }> = {};
    approved.forEach(o => {
      const key = o.service?.split(' ').slice(0, 2).join(' ') || 'Outro';
      if (!byService[key]) byService[key] = { count: 0, revenue: 0 };
      byService[key].count++;
      byService[key].revenue += Number(o.val);
    });

    const topServices = Object.entries(byService)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);

    const conversionRate = total > 0 ? Math.round((approved.length / total) * 100) : 0;

    return { total, approved: approved.length, pending: pending.length, revenue, totalRevenue, topServices, conversionRate };
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-white/8 flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#f9317a] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
            </div>
            <span className="font-bold text-base tracking-tight">Metrica<span className="text-[#f9317a]">Up</span></span>
          </div>
          <div className="text-[11px] text-white/30 mt-1 font-medium tracking-wide uppercase">Admin</div>
        </div>

        <nav className="p-3 flex-1 space-y-0.5">
          {[
            { id: 'orders', label: 'Pedidos', icon: '📦', badge: orders.filter(o => o.status === 'Aguardando Pagamento').length },
            { id: 'analytics', label: 'Analytics', icon: '📊', badge: 0 },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base">{item.icon}</span>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className="bg-[#f9317a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/8 space-y-0.5">
          <a href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
            <span>🌐</span> Ver Site
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/8 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl tracking-tight">{activeTab === 'orders' ? 'Pedidos' : 'Analytics'}</h1>
            {lastUpdated && (
              <p className="text-[11px] text-white/30 mt-0.5">Atualizado às {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadOrders} className="flex items-center gap-2 px-4 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl text-sm font-medium transition-all">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
              Atualizar
            </button>
            <button onClick={clearOrders} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-all">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              Limpar Tudo
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📦" label="Total de Pedidos" value={stats.total} color="bg-white/10" />
            <StatCard icon="✅" label="Aprovados/Entregues" value={stats.approved} sub={`Taxa: ${stats.conversionRate}%`} color="bg-emerald-500/10" />
            <StatCard icon="⏳" label="Aguardando" value={stats.pending} color="bg-amber-500/10" />
            <StatCard icon="💰" label="Receita Aprovada" value={`R$ ${stats.revenue.toFixed(2).replace('.', ',')}`} sub={`Total geral: R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}`} color="bg-purple-500/10" />
          </div>

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Top Services */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="font-bold text-base mb-5 flex items-center gap-2">📈 Serviços Mais Vendidos</h2>
                {stats.topServices.length === 0 ? (
                  <p className="text-white/30 text-sm">Nenhum pedido aprovado ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {stats.topServices.map(([svc, data], i) => {
                      const max = stats.topServices[0][1].count;
                      const pct = Math.round((data.count / max) * 100);
                      return (
                        <div key={svc}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-white/80 font-medium">{svc}</span>
                            <span className="text-white/40">{data.count} pedidos · R$ {data.revenue.toFixed(2).replace('.', ',')}</span>
                          </div>
                          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%`, background: i === 0 ? '#f9317a' : i === 1 ? '#8b5cf6' : i === 2 ? '#3b82f6' : '#10b981' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status Distribution */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="font-bold text-base mb-5">📊 Distribuição por Status</h2>
                <div className="space-y-3">
                  {STATUSES.map(s => {
                    const count = orders.filter(o => o.status === s).length;
                    const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                    const style = STATUS_STYLES[s];
                    return (
                      <div key={s} className="flex items-center gap-4">
                        <StatusBadge status={s} />
                        <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${style.dot}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm text-white/40 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="font-bold text-base mb-5">🕐 Atividade Recente</h2>
                <div className="space-y-3">
                  {orders.slice(0, 8).map(o => (
                    <div key={o.id} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-sm flex-shrink-0">
                        {o.service?.includes('Seguidor') ? '👤' : o.service?.includes('Curtida') ? '❤️' : o.service?.includes('View') || o.service?.includes('Visual') ? '👁️' : '📱'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white/80 truncate">{o.service}</div>
                        <div className="text-xs text-white/30">{o.email}</div>
                      </div>
                      <StatusBadge status={o.status} />
                      <div className="text-sm font-semibold text-white/60 flex-shrink-0">R$ {Number(o.val).toFixed(2).replace('.', ',')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <>
              {/* Filters */}
              <div className="flex gap-3 mb-5">
                <div className="relative flex-1">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-white/25 transition text-white placeholder:text-white/25"
                    placeholder="Buscar por e-mail, serviço ou ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-white/25 transition text-white/70"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{ backgroundColor: '#111' }}
                >
                  <option value="">Todos Status</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Results count */}
              <div className="text-xs text-white/30 mb-3 font-medium">
                {filtered.length} pedido{filtered.length !== 1 ? 's' : ''} {statusFilter ? `com status "${statusFilter}"` : ''}
              </div>

              {/* Orders table */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                      <span className="text-sm text-white/40">Carregando pedidos...</span>
                    </div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-white/30">
                    <div className="text-4xl mb-3">📭</div>
                    <div className="font-medium">Nenhum pedido encontrado</div>
                    <div className="text-sm mt-1">{search ? 'Tente outra busca' : 'Os pedidos aparecerão aqui'}</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/8">
                          {['ID', 'Serviço', 'Qtd', 'Valor', 'Cliente', 'Status', 'Link', 'Ações'].map(h => (
                            <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((o, idx) => (
                          <tr key={o.id} className={`border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                            <td className="px-5 py-4 font-mono text-xs text-white/40">{o.id}</td>
                            <td className="px-5 py-4">
                              <span className="font-medium text-white/80 max-w-[180px] block truncate">{o.service}</span>
                            </td>
                            <td className="px-5 py-4 text-white/50">
                              {o.qty >= 1000 ? (o.qty / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k' : o.qty}
                            </td>
                            <td className="px-5 py-4 font-semibold text-emerald-400">
                              R$ {Number(o.val).toFixed(2).replace('.', ',')}
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-white/70 text-xs font-medium">{o.email}</div>
                              {o.whatsapp && <div className="text-white/30 text-xs">{o.whatsapp}</div>}
                            </td>
                            <td className="px-5 py-4">
                              <select
                                value={o.status}
                                onChange={e => setStatus(o.id, e.target.value)}
                                className="bg-transparent border-0 outline-none text-xs cursor-pointer"
                                style={{ backgroundColor: 'transparent', color: 'inherit' }}
                              >
                                {STATUSES.map(s => <option key={s} value={s} style={{ backgroundColor: '#111' }}>{s}</option>)}
                              </select>
                              <div className="mt-1">
                                <StatusBadge status={o.status} />
                              </div>
                            </td>
                            <td className="px-5 py-4 max-w-[140px]">
                              <a href={o.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs truncate block hover:underline">
                                {o.link?.replace(/https?:\/\//, '').slice(0, 30)}…
                              </a>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => advanceStatus(o.id, o.status)}
                                className="text-xs bg-white/8 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap"
                                title="Avançar status"
                              >
                                Avançar →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
