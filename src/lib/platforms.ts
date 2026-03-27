export interface QtyOption { q: number; p: number; }
export interface Service {
  id: string; cat: string; name: string; desc: string;
  icon: string; iconBg: string; iconColor: string; badges: string[];
  qtys: QtyOption[];
}
export interface Platform {
  name: string; emoji: string; desc: string; gradient: string;
  services: Service[]; logo_svg?: string;
}

export function findServiceIn(id: string, platforms: Record<string, Platform>): Service | null {
  for (const p of Object.values(platforms)) {
    const s = p.services.find(s => s.id === id);
    if (s) return s;
  }
  return null;
}

export function formatPrice(p: number) {
  return 'R$ ' + p.toFixed(2).replace('.', ',');
}

export function formatQty(q: number) {
  return q >= 1000 ? (q / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k' : q.toLocaleString('pt-BR');
}
