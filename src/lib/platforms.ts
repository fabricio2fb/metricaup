export interface QtyOption { q: number; p: number; }
export interface Service {
  id: string; cat: string; name: string; desc: string;
  icon: string; iconBg: string; iconColor: string; badges: string[];
  qtys: QtyOption[];
}
export interface Platform {
  name: string; emoji: string; desc: string; gradient: string;
  services: Service[];
}

const ICONS = {
  world: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  br: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12L12 22L2 12L12 2L22 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  heart: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  play: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8" fill="white"></polygon></svg>`,
  eye: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
  share: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
};

export const PLATFORMS: Record<string, Platform> = {
  instagram: {
    name: 'Instagram', emoji: '📸',
    desc: 'Seguidores, curtidas e views para crescer no Instagram.',
    gradient: 'linear-gradient(135deg,#833ab4 0%,#fd1d1d 50%,#fcb045 100%)',
    services: [
      { id: 'ig1', cat: 'seguidores', name: 'Seguidores Mundiais', desc: 'Alta velocidade de entrega, perfis internacionais verificados.', icon: ICONS.world, iconBg: '#eff6ff', iconColor: '#3b82f6', badges: ['fast'], qtys: [{ q: 100, p: 2.99 }, { q: 500, p: 14.99 }, { q: 1000, p: 24.99 }, { q: 5000, p: 124.99 }, { q: 10000, p: 249.99 }] },
      { id: 'ig2', cat: 'seguidores', name: 'Seguidores Brasileiros', desc: 'Perfis reais do Brasil com fotos, bio e histórico de postagens.', icon: ICONS.br, iconBg: '#dcfce7', iconColor: '#16a34a', badges: ['br', 'hot'], qtys: [{ q: 100, p: 9.99 }, { q: 500, p: 49.99 }, { q: 1000, p: 69.99 }, { q: 5000, p: 299.99 }, { q: 10000, p: 499.99 }] },
      { id: 'ig3', cat: 'curtidas', name: 'Curtidas Mundiais', desc: 'Curtidas internacionais entregues imediatamente após pagamento.', icon: ICONS.heart, iconBg: '#f5f3ff', iconColor: '#8b5cf6', badges: ['fast'], qtys: [{ q: 100, p: 2.99 }, { q: 500, p: 7.99 }, { q: 1000, p: 12.99 }, { q: 5000, p: 29.99 }, { q: 10000, p: 49.99 }] },
      { id: 'ig4', cat: 'curtidas', name: 'Curtidas Brasileiras', desc: 'Curtidas de contas BR ativas com engajamento orgânico real.', icon: ICONS.heart, iconBg: '#fff1f2', iconColor: '#ef4444', badges: ['br', 'hot'], qtys: [{ q: 100, p: 4.99 }, { q: 500, p: 12.99 }, { q: 1000, p: 19.99 }, { q: 5000, p: 79.99 }, { q: 10000, p: 149.99 }] },
      { id: 'ig5', cat: 'views', name: 'Visualizações em Reels', desc: 'Visualizações de Reels com alta retenção e alcance orgânico.', icon: ICONS.play, iconBg: '#fff7ed', iconColor: '#f97316', badges: ['hot'], qtys: [{ q: 1000, p: 3.99 }, { q: 5000, p: 14.99 }, { q: 10000, p: 24.99 }, { q: 50000, p: 79.99 }, { q: 100000, p: 149.99 }] },
      { id: 'ig6', cat: 'views', name: 'Visualizações em Stories', desc: 'Visualizações de Stories com perfis ativos e variados.', icon: ICONS.eye, iconBg: '#f0fdf4', iconColor: '#059669', badges: ['fast'], qtys: [{ q: 100, p: 2.99 }, { q: 500, p: 6.99 }, { q: 1000, p: 17.99 }, { q: 5000, p: 49.99 }, { q: 10000, p: 89.99 }, { q: 25000, p: 179.99 }] },
    ]
  },
  tiktok: {
    name: 'TikTok', emoji: '🎵',
    desc: 'Seguidores, curtidas e views para viralizar no TikTok.',
    gradient: 'linear-gradient(135deg,#010101 0%,#161616 40%,#2a0010 100%)',
    services: [
      { id: 'tt1', cat: 'views', name: 'Visualizações Mundiais', desc: 'Views internacionais de alto volume com entrega ultrarrápida.', icon: ICONS.eye, iconBg: '#f0fdf4', iconColor: '#059669', badges: ['fast'], qtys: [{ q: 1000, p: 2.99 }, { q: 5000, p: 10.99 }, { q: 10000, p: 19.99 }, { q: 50000, p: 43.99 }, { q: 100000, p: 69.99 }] },
      { id: 'tt2', cat: 'seguidores', name: 'Seguidores Mundiais', desc: 'Seguidores internacionais de alta qualidade, entrega gradual.', icon: ICONS.world, iconBg: '#eff6ff', iconColor: '#3b82f6', badges: ['fast'], qtys: [{ q: 100, p: 3.90 }, { q: 500, p: 16.90 }, { q: 1000, p: 27.90 }, { q: 5000, p: 119.90 }, { q: 10000, p: 219.90 }] },
      { id: 'tt3', cat: 'seguidores', name: 'Seguidores Brasileiros', desc: 'Seguidores brasileiros reais para crescer seu perfil.', icon: ICONS.br, iconBg: '#dcfce7', iconColor: '#16a34a', badges: ['br', 'hot'], qtys: [{ q: 100, p: 7.99 }, { q: 500, p: 28.99 }, { q: 1000, p: 59.99 }, { q: 5000, p: 249.99 }, { q: 10000, p: 499.99 }] },
      { id: 'tt4', cat: 'curtidas', name: 'Curtidas', desc: 'Curtidas de alto volume entregues rapidamente.', icon: ICONS.heart, iconBg: '#fff1f2', iconColor: '#ef4444', badges: ['fast'], qtys: [{ q: 100, p: 2.99 }, { q: 500, p: 7.99 }, { q: 1000, p: 11.99 }, { q: 5000, p: 29.99 }, { q: 10000, p: 49.99 }] },
    ]
  },
  facebook: {
    name: 'Facebook', emoji: '👥',
    desc: 'Seguidores, curtidas e views para sua página no Facebook.',
    gradient: 'linear-gradient(135deg,#1877f2 0%,#0d47a1 100%)',
    services: [
      { id: 'fb1', cat: 'seguidores', name: 'Seguidores Mundiais', desc: 'Seguidores internacionais entregues com velocidade.', icon: ICONS.world, iconBg: '#eff6ff', iconColor: '#3b82f6', badges: ['fast'], qtys: [{ q: 100, p: 4.90 }, { q: 500, p: 19.90 }, { q: 1000, p: 34.90 }, { q: 5000, p: 149.90 }, { q: 10000, p: 279.90 }] },
      { id: 'fb2', cat: 'curtidas', name: 'Curtidas e Reações', desc: 'Curtidas para publicações e página no Facebook.', icon: ICONS.heart, iconBg: '#fff1f2', iconColor: '#ef4444', badges: ['hot'], qtys: [{ q: 100, p: 9.90 }, { q: 500, p: 39.90 }, { q: 1000, p: 69.90 }, { q: 5000, p: 249.90 }] },
      { id: 'fb3', cat: 'views', name: 'Visualizações de Vídeo', desc: 'Visualizações de vídeos publicados no Facebook.', icon: ICONS.play, iconBg: '#f0fdf4', iconColor: '#059669', badges: [], qtys: [{ q: 1000, p: 19.90 }, { q: 5000, p: 79.90 }, { q: 10000, p: 149.90 }, { q: 50000, p: 599.90 }, { q: 100000, p: 999.90 }] },
    ]
  },
  kwai: {
    name: 'Kwai', emoji: '🎬',
    desc: 'Seguidores, curtidas e visualizações para crescer no Kwai.',
    gradient: 'linear-gradient(135deg,#ff6b00 0%,#ff8c00 50%,#ffa500 100%)',
    services: [
      { id: 'kw1', cat: 'seguidores', name: 'Seguidores Brasileiros', desc: 'Seguidores brasileiros reais para crescer no Kwai.', icon: ICONS.br, iconBg: '#dcfce7', iconColor: '#16a34a', badges: ['br', 'hot'], qtys: [{ q: 100, p: 4.99 }, { q: 500, p: 19.99 }, { q: 1000, p: 29.99 }, { q: 5000, p: 119.99 }, { q: 10000, p: 219.99 }] },
      { id: 'kw2', cat: 'curtidas', name: 'Curtidas Brasileiras', desc: 'Curtidas de contas brasileiras ativas no Kwai.', icon: ICONS.heart, iconBg: '#fff1f2', iconColor: '#ef4444', badges: ['br'], qtys: [{ q: 100, p: 3.99 }, { q: 500, p: 9.99 }, { q: 1000, p: 14.99 }, { q: 5000, p: 59.99 }] },
      { id: 'kw3', cat: 'views', name: 'Visualizações', desc: 'Visualizações para seus vídeos no Kwai.', icon: ICONS.eye, iconBg: '#fff7ed', iconColor: '#f97316', badges: ['fast'], qtys: [{ q: 1000, p: 4.90 }, { q: 5000, p: 19.90 }, { q: 10000, p: 34.90 }, { q: 50000, p: 149.90 }, { q: 100000, p: 279.90 }] },
    ]
  }
};

export function findService(id: string): Service | null {
  for (const p of Object.values(PLATFORMS)) {
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
