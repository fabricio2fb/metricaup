'use client';

import { useState, useEffect, useCallback } from 'react';

interface Order {
  id: string; email: string; whatsapp?: string; link: string;
  service: string; qty: number; val: number; status: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  'Aguardando Pagamento': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Aprovado': 'bg-green-50 text-green-700 border-green-200',
  'Em Processamento': 'bg-blue-50 text-blue-700 border-blue-200',
  'Entregue': 'bg-purple-50 text-purple-700 border-purple-200',
  'Cancelado': 'bg-red-50 text-red-700 border-red-200',
};

const STATUSES = Object.keys(STATUS_COLORS);

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pedidos');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
    setLoading(false);
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  async function toggleStatus(id: string, current: string) {
    const idx = STATUSES.indexOf(current);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    await fetch(`/api/pedidos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
    loadOrders();
  }

  async function clearOrders() {
    if (!confirm('Apagar TODOS os pedidos?')) return;
    await fetch('/api/pedidos', { method: 'DELETE' });
    loadOrders();
  }

  const filtered = orders.filter(o => {
    const q = filter.toLowerCase();
    const matchSearch = !q || o.email?.toLowerCase().includes(q) || o.service?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = filtered.reduce((sum, o) => sum + Number(o.val), 0);
  const approved = filtered.filter(o => o.status === 'Aprovado' || o.status === 'Entregue').length;

  return (
    <div className="min-h-screen bg-gray-100 font-jakarta">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#0f0e0c] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="font-clash text-xl font-bold">Metrica<span className="text-[#f9317a]">Up</span></div>
          <div className="text-xs text-white/40 mt-1">Painel Administrativo</div>
        </div>
        <nav className="p-4 flex-1">
          <div className="px-3 py-2.5 bg-white/10 rounded-xl text-sm font-semibold flex items-center gap-3">
            <span>📦</span> Pedidos
          </div>
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/" className="text-xs text-white/40 hover:text-white transition flex items-center gap-2">← Ver site</a>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-clash text-3xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-sm text-gray-500 mt-1">{orders.length} pedidos no total</p>
          </div>
          <div className="flex gap-3">
            <button onClick={loadOrders} className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">🔄 Atualizar</button>
            <button onClick={clearOrders} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition">🗑 Limpar Tudo</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total de Pedidos', value: orders.length, icon: '📦' },
            { label: 'Aprovados / Entregues', value: approved, icon: '✅' },
            { label: 'Receita Total (Aprovados)', value: `R$ ${total.toFixed(2).replace('.', ',')}`, icon: '💰' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-clash text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition"
            placeholder="Buscar por e-mail, serviço ou ID..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <select
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-16 text-center text-gray-400">Carregando pedidos...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-gray-400">Nenhum pedido encontrado.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['ID', 'Serviço', 'Qtd', 'Valor', 'Link', 'E-mail', 'Status', 'Ação'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 max-w-[160px] truncate">{o.service}</td>
                    <td className="px-4 py-3 text-gray-600">{o.qty >= 1000 ? (o.qty / 1000) + 'k' : o.qty}</td>
                    <td className="px-4 py-3 font-bold text-gray-800">R$ {Number(o.val).toFixed(2).replace('.', ',')}</td>
                    <td className="px-4 py-3 max-w-[120px]">
                      <a href={o.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate block text-xs">{o.link?.replace(/https?:\/\//, '')}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{o.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_COLORS[o.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(o.id, o.status)} className="text-xs bg-[#0f0e0c] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-700 transition">Avançar →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
