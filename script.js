const ICONS = {
  world: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  br: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12L12 22L2 12L12 2L22 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  heart: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  play: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8" fill="white"></polygon></svg>`,
  eye: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
  share: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`
};

const PLATFORMS = {
  instagram: {
    name:'Instagram', emoji:'📸',
    desc:'Seguidores, curtidas e views para crescer no Instagram.',
    gradient:'linear-gradient(135deg,#833ab4 0%,#fd1d1d 50%,#fcb045 100%)',
    services:[
      {id:'ig1',cat:'seguidores',name:'Seguidores Mundiais',desc:'Alta velocidade de entrega, perfis internacionais verificados.',icon: ICONS.world,iconBg:'#eff6ff',iconColor:'#3b82f6',badges:['fast'],
       qtys:[{q:100,p:2.99},{q:500,p:14.99},{q:1000,p:24.99},{q:5000,p:124.99},{q:10000,p:249.99}]},
      {id:'ig2',cat:'seguidores',name:'Seguidores Brasileiros',desc:'Perfis reais do Brasil com fotos, bio e histórico de postagens.',icon: ICONS.br,iconBg:'#dcfce7',iconColor:'#16a34a',badges:['br','hot'],
       qtys:[{q:100,p:9.99},{q:500,p:49.99},{q:1000,p:69.99},{q:5000,p:299.99},{q:10000,p:499.99}]},
      {id:'ig3',cat:'curtidas',name:'Curtidas Mundiais',desc:'Curtidas internacionais entregues imediatamente após pagamento.',icon: ICONS.heart,iconBg:'#f5f3ff',iconColor:'#8b5cf6',badges:['fast'],
       qtys:[{q:100,p:2.99},{q:500,p:7.99},{q:1000,p:12.99},{q:5000,p:29.99},{q:10000,p:49.99}]},
      {id:'ig4',cat:'curtidas',name:'Curtidas Brasileiras',desc:'Curtidas de contas BR ativas com engajamento orgânico real.',icon: ICONS.heart,iconBg:'#fff1f2',iconColor:'#ef4444',badges:['br','hot'],
       qtys:[{q:100,p:4.99},{q:500,p:12.99},{q:1000,p:19.99},{q:5000,p:79.99},{q:10000,p:149.99}]},
      {id:'ig5',cat:'views',name:'Visualizações em Reels',desc:'Visualizações de Reels com alta retenção e alcance orgânico.',icon: ICONS.play,iconBg:'#fff7ed',iconColor:'#f97316',badges:['hot'],
       qtys:[{q:1000,p:3.99},{q:5000,p:14.99},{q:10000,p:24.99},{q:50000,p:79.99},{q:100000,p:149.99}]},
      {id:'ig6',cat:'views',name:'Visualizações em Stories',desc:'Visualizações de Stories com perfis ativos e variados.',icon: ICONS.eye,iconBg:'#f0fdf4',iconColor:'#059669',badges:['fast'],
       qtys:[{q:100,p:2.99},{q:500,p:6.99},{q:1000,p:17.99},{q:5000,p:49.99},{q:10000,p:89.99},{q:25000,p:179.99}]},
      {id:'ig7',cat:'comentarios',name:'Comentários BR',desc:'Comentários de brasileiros. Você ganha engajamento premium.',icon: ICONS.chat,iconBg:'#fdf4ff',iconColor:'#d946ef',badges:[],
       qtys:[{q:10,p:4.99},{q:50,p:19.99},{q:100,p:34.99},{q:500,p:149.99}]},
    ]
  },
  tiktok:{
    name:'TikTok',emoji:'🎵',
    desc:'Seguidores, curtidas e views para viralizar no TikTok.',
    gradient:'linear-gradient(135deg,#010101 0%,#161616 40%,#2a0010 100%)',
    services:[
      {id:'tt1',cat:'views',name:'Visualizações Mundiais',desc:'Views internacionais de alto volume com entrega ultrarrápida.',icon: ICONS.eye,iconBg:'#f0fdf4',iconColor:'#059669',badges:['fast'],
       qtys:[{q:1000,p:2.99},{q:5000,p:10.99},{q:10000,p:19.99},{q:50000,p:43.99},{q:100000,p:69.99}]},
      {id:'tt2',cat:'seguidores',name:'Seguidores Mundiais',desc:'Seguidores internacionais de alta qualidade, entrega gradual.',icon: ICONS.world,iconBg:'#eff6ff',iconColor:'#3b82f6',badges:['fast'],
       qtys:[{q:100,p:3.90},{q:500,p:16.90},{q:1000,p:27.90},{q:5000,p:119.90},{q:10000,p:219.90}]},
      {id:'tt3',cat:'seguidores',name:'Seguidores Brasileiros',desc:'Seguidores brasileiros reais para crescer seu perfil.',icon: ICONS.br,iconBg:'#dcfce7',iconColor:'#16a34a',badges:['br','hot'],
       qtys:[{q:100,p:7.99},{q:500,p:28.99},{q:1000,p:59.99},{q:5000,p:249.99},{q:10000,p:499.99}]},
      {id:'tt4',cat:'curtidas',name:'Curtidas',desc:'Curtidas de alto volume entregues rapidamente.',icon: ICONS.heart,iconBg:'#fff1f2',iconColor:'#ef4444',badges:['fast'],
       qtys:[{q:100,p:2.99},{q:500,p:7.99},{q:1000,p:11.99},{q:5000,p:29.99},{q:10000,p:49.99}]},
      {id:'tt5',cat:'compartilhamentos',name:'Compartilhamentos',desc:'Aumente o fator viral do seu vídeo drasticamente.',icon: ICONS.share,iconBg:'#f5f3ff',iconColor:'#8b5cf6',badges:[],
       qtys:[{q:100,p:1.99},{q:500,p:4.99},{q:1000,p:8.99},{q:5000,p:24.99},{q:10000,p:39.99}]},
    ]
  },
  facebook:{
    name:'Facebook',emoji:'👥',
    desc:'Seguidores, curtidas e views para sua página no Facebook.',
    gradient:'linear-gradient(135deg,#1877f2 0%,#0d47a1 100%)',
    services:[
      {id:'fb1',cat:'seguidores',name:'Seguidores Mundiais',desc:'Seguidores internacionais entregues com velocidade.',icon: ICONS.world,iconBg:'#eff6ff',iconColor:'#3b82f6',badges:['fast'],
       qtys:[{q:100,p:4.90},{q:500,p:19.90},{q:1000,p:34.90},{q:5000,p:149.90},{q:10000,p:279.90}]},
      {id:'fb2',cat:'curtidas',name:'Curtidas e Reações',desc:'Curtidas para publicações e página no Facebook.',icon: ICONS.heart,iconBg:'#fff1f2',iconColor:'#ef4444',badges:['hot'],
       qtys:[{q:100,p:9.90},{q:500,p:39.90},{q:1000,p:69.90},{q:5000,p:249.90}]},
      {id:'fb3',cat:'views',name:'Visualizações de Vídeo',desc:'Visualizações de vídeos publicados no Facebook.',icon: ICONS.play,iconBg:'#f0fdf4',iconColor:'#059669',badges:[],
       qtys:[{q:1000,p:19.90},{q:5000,p:79.90},{q:10000,p:149.90},{q:50000,p:599.90},{q:100000,p:999.90}]},
    ]
  },
  kwai:{
    name:'Kwai',emoji:'🎬',
    desc:'Seguidores, curtidas e visualizações para crescer no Kwai.',
    gradient:'linear-gradient(135deg,#ff6b00 0%,#ff8c00 50%,#ffa500 100%)',
    services:[
      {id:'kw1',cat:'seguidores',name:'Seguidores Brasileiros',desc:'Seguidores brasileiros reais para crescer no Kwai.',icon: ICONS.br,iconBg:'#dcfce7',iconColor:'#16a34a',badges:['br','hot'],
       qtys:[{q:100,p:4.99},{q:500,p:19.99},{q:1000,p:29.99},{q:5000,p:119.99},{q:10000,p:219.99}]},
      {id:'kw2',cat:'curtidas',name:'Curtidas Brasileiras',desc:'Curtidas de contas brasileiras ativas no Kwai.',icon: ICONS.heart,iconBg:'#fff1f2',iconColor:'#ef4444',badges:['br'],
       qtys:[{q:100,p:3.99},{q:500,p:9.99},{q:1000,p:14.99},{q:5000,p:59.99}]},
      {id:'kw3',cat:'views',name:'Visualizações',desc:'Visualizações para seus vídeos no Kwai.',icon: ICONS.eye,iconBg:'#fff7ed',iconColor:'#f97316',badges:['fast'],
       qtys:[{q:1000,p:4.90},{q:5000,p:19.90},{q:10000,p:34.90},{q:50000,p:149.90},{q:100000,p:279.90}]},
    ]
  }
};

const CATS = {todos:'Todos',seguidores:'Seguidores',curtidas:'Curtidas',views:'Views',comentarios:'Comentários',compartilhamentos:'Compartilhar'};

let currentPlat = null, currentCat = 'todos', selectedProduct = null, selectedQty = null, qtyMode = 'grid';

function showServices(platKey) {
  currentPlat = platKey;
  currentCat = 'todos';
  const plat = PLATFORMS[platKey];

  document.getElementById('platform-section').style.display = 'none';
  document.getElementById('home-only').style.display = 'none';
  document.getElementById('services-section').classList.add('active');

  const band = document.getElementById('services-hero-band');
  band.style.background = plat.gradient;
  document.getElementById('plat-page-name').textContent = plat.name;
  document.getElementById('plat-page-desc').textContent = plat.desc;
  document.getElementById('services-hero-emoji').textContent = plat.emoji;

  const cats = ['todos', ...new Set(plat.services.map(s => s.cat))];
  document.getElementById('cat-filters').innerHTML = cats.map(c =>
    `<button class="cat-pill ${c==='todos'?'active':''}" onclick="filterCat('${c}',this)">${CATS[c]||c}</button>`
  ).join('');

  renderServices();
  window.scrollTo({top:0,behavior:'smooth'});
}

function filterCat(cat, el) {
  currentCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderServices();
}

function renderServices() {
  const plat = PLATFORMS[currentPlat];
  const list = currentCat === 'todos' ? plat.services : plat.services.filter(s => s.cat === currentCat);
  document.getElementById('services-grid').innerHTML = list.map(s => {
    const minP = 'R$ ' + s.qtys[0].p.toFixed(2).replace('.',',');
    const minQ = s.qtys[0].q.toLocaleString('pt-BR');
    const badgeHTML = s.badges.map(b => {
      if(b==='br') return `<span class="badge badge-br">BR</span>`;
      if(b==='hot') return `<span class="badge badge-hot">🔥 Popular</span>`;
      if(b==='fast') return `<span class="badge badge-fast">⚡ Rápido</span>`;
      return '';
    }).join('');
    return `
    <div class="svc-card" onclick="openCheckout('${s.id}')">
      <div class="svc-card-top">
        <div class="svc-icon-wrap" style="background:${s.iconBg}; color:${s.iconColor}">${s.icon}</div>
        <div class="svc-badges">${badgeHTML}</div>
      </div>
      <div class="svc-name">${s.name}</div>
      <div class="svc-desc">${s.desc}</div>
      <div class="svc-footer">
        <div class="svc-price-wrap">
          <div class="svc-price-from">A partir de</div>
          <div class="svc-price">${minP}</div>
          <div class="svc-price-unit">${minQ} unidades</div>
        </div>
        <button class="btn-select">Selecionar →</button>
      </div>
    </div>`;
  }).join('');
}

function goBack() {
  document.getElementById('platform-section').style.display = 'block';
  document.getElementById('home-only').style.display = 'block';
  document.getElementById('services-section').classList.remove('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

function openCheckout(id) {
  let svc = null;
  for(const p of Object.values(PLATFORMS)) { svc = p.services.find(s => s.id===id); if(svc) break; }
  if(!svc) return;

  selectedProduct = svc;
  selectedQty = null;

  // Hide Services view, show checkout view
  document.getElementById('services-section').classList.remove('active');
  document.getElementById('checkout-section').style.display = 'block';

  // Populate info
  document.getElementById('checkout-icon').innerHTML = svc.icon;
  document.getElementById('checkout-icon').style.background = svc.iconBg;
  document.getElementById('checkout-icon').style.color = svc.iconColor;

  document.getElementById('checkout-name').textContent = svc.name;
  document.getElementById('checkout-sub').textContent = svc.desc;
  
  document.getElementById('c-sum-svc').textContent = svc.name;
  document.getElementById('c-sum-qty').textContent = '—';
  document.getElementById('c-sum-val').textContent = 'R$ 0,00';
  document.getElementById('checkout-link').value = '';
  document.getElementById('custom-qty-input').value = '';
  document.getElementById('checkout-email').value = '';

  document.getElementById('checkout-qty-grid').innerHTML = svc.qtys.map((q,i) => {
    const qStr = q.q >= 1000 ? (q.q/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k' : q.q.toLocaleString('pt-BR');
    return `<div class="qty-item" onclick="selQty(${i})" id="qo-${i}">
      <div class="qty-n">${qStr}</div>
      <div class="qty-p">R$ ${q.p.toFixed(2).replace('.',',')}</div>
    </div>`;
  }).join('');

  setQtyMode('grid');
  window.scrollTo({top:0,behavior:'smooth'});
}

function setQtyMode(mode) {
  qtyMode = mode;
  document.getElementById('tab-grid').classList.toggle('active', mode === 'grid');
  document.getElementById('tab-custom').classList.toggle('active', mode === 'custom');
  
  if(mode === 'grid') {
    document.getElementById('checkout-qty-grid').style.display = 'grid';
    document.getElementById('checkout-qty-custom').style.display = 'none';
    
    // Restore selection from grid if possible, or select first item
    const currentSel = document.querySelector('.qty-item.sel');
    if (currentSel) {
        const i = parseInt(currentSel.id.replace('qo-', ''));
        selQty(i);
    } else {
        selQty(0);
    }
  } else {
    document.getElementById('checkout-qty-grid').style.display = 'none';
    document.getElementById('checkout-qty-custom').style.display = 'block';
    
    // Set base price hint for custom mode calculation
    const baseP = selectedProduct.qtys[0].p;
    document.getElementById('cq-base-price').textContent = baseP.toFixed(2).replace('.',',');
    calcCustomQty();
  }
}

function selQty(i) {
  if (qtyMode !== 'grid') return;
  document.querySelectorAll('.qty-item').forEach(el => el.classList.remove('sel'));
  document.getElementById('qo-'+i).classList.add('sel');
  selectedQty = selectedProduct.qtys[i];
  
  const qStr = selectedQty.q >= 1000 ? (selectedQty.q/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k' : selectedQty.q.toLocaleString('pt-BR');
  document.getElementById('c-sum-qty').textContent = qStr + ' unidades';
  document.getElementById('c-sum-val').textContent = 'R$ ' + selectedQty.p.toFixed(2).replace('.',',');
}

function calcCustomQty() {
  if (qtyMode !== 'custom') return;
  
  let val = parseInt(document.getElementById('custom-qty-input').value);
  if (isNaN(val) || val < 100) {
      document.getElementById('c-sum-qty').textContent = '—';
      document.getElementById('c-sum-val').textContent = 'R$ 0,00';
      selectedQty = null;
      return;
  }
  
  // Custom price based on lowest tier (assumed to be per 100 units normally, but we scale proportionally to baseQty)
  const baseQty = selectedProduct.qtys[0].q;
  const basePrice = selectedProduct.qtys[0].p;
  const pricePerUnit = basePrice / baseQty;
  
  const finalPrice = val * pricePerUnit;
  
  selectedQty = { q: val, p: finalPrice };
  
  const qStr = val >= 1000 ? (val/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k' : val.toLocaleString('pt-BR');
  document.getElementById('c-sum-qty').textContent = qStr + ' unidades';
  document.getElementById('c-sum-val').textContent = 'R$ ' + finalPrice.toFixed(2).replace('.',',');
}

function goBackToServices() {
    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('services-section').classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
}

let paymentPolling = null;
let paymentTimer = null;

async function doPay() {
  const link = document.getElementById('checkout-link').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const whatsappEl = document.getElementById('checkout-whatsapp');
  const whatsapp = whatsappEl ? whatsappEl.value.trim() : '';
  
  if(!link) { alert('Por favor, cole o link do perfil ou publicação.'); return; }
  if(!selectedQty) { alert('Por favor, preencha uma quantidade válida para continuar.'); return; }
  if(!email || !email.includes('@')) { alert('Por favor, digite um e-mail válido para o recibo.'); return; }
  
  const id = '#' + Math.floor(Math.random() * 90000 + 10000);
  
  const btn = document.querySelector('.btn-pay');
  const originalBtnHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Gerando Pix...';

  const newOrder = {
     id: id,
     email: email,
     whatsapp: whatsapp,
     link: link,
     service: selectedProduct.name,
     qty: selectedQty.q,
     val: selectedQty.p
  };

  try {
      const response = await fetch('/api/criar-pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error);
      
      showPixScreen(data);
  } catch(error) {
      console.error(error);
      alert('Erro ao gerar Pix: ' + error.message);
      btn.disabled = false;
      btn.innerHTML = originalBtnHtml;
  }
}

function showPixScreen(data) {
    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('pix-section').style.display = 'block';
    
    document.getElementById('pix-val').textContent = 'R$ ' + selectedQty.p.toFixed(2).replace('.',',');
    
    const qrImg = document.getElementById('pix-qr-img');
    if(qrImg) qrImg.src = `data:image/png;base64,${data.qr_code_base64}`;
    
    const qrText = document.getElementById('pix-copy-input');
    if(qrText) qrText.value = data.qr_code_texto;

    window.scrollTo({top:0,behavior:'smooth'});
    startPixTimer(30 * 60);
    startPaymentPolling(data.payment_id);
}

function startPixTimer(duration) {
    if(paymentTimer) clearInterval(paymentTimer);
    let timer = duration;
    const display = document.getElementById('pix-timer');
    
    paymentTimer = setInterval(() => {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if(display) display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(paymentTimer);
            alert("O tempo do Pix expirou. Por favor, gere um novo.");
            goHome();
        }
    }, 1000);
}

function startPaymentPolling(paymentId) {
    if(paymentPolling) clearInterval(paymentPolling);
    paymentPolling = setInterval(async () => {
        try {
            const res = await fetch(`/api/checar-pagamento/${paymentId}`);
            const data = await res.json();
            if(data.status === 'approved') {
                clearInterval(paymentPolling);
                clearInterval(paymentTimer);
                showSuccessScreen();
            }
        } catch(e) { console.error('Erro polling:', e); }
    }, 3000);
}

function showSuccessScreen() {
    document.getElementById('pix-section').innerHTML = `
        <div style="text-align:center; padding:40px 20px;">
            <div style="background:#dcfce7; color:#16a34a; width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style="font-size:24px; color:#111827; margin-bottom:8px;">Pagamento Confirmado!</h2>
            <p style="color:#6b7280; margin-bottom:32px;">Seu pedido foi recebido com sucesso. Em breve iniciaremos o processamento.</p>
            <button onclick="location.reload()" class="btn-select" style="width:auto; padding:12px 32px;">Voltar ao Início</button>
        </div>
    `;
    window.scrollTo({top:0,behavior:'smooth'});
}

function copyPixCode() {
    const copyText = document.getElementById("pix-copy-input");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    
    const btn = document.querySelector('.btn-pix-copy');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Copiado!';
    setTimeout(() => btn.innerHTML = originalText, 2000);
}

function goHome() {
    document.getElementById('pix-section').style.display = 'none';
    document.getElementById('home-only').style.display = 'block';
    document.getElementById('platform-section').style.display = 'block';
    window.scrollTo({top:0,behavior:'smooth'});
}

// FAQ Logic
function toggleFaq(el) {
  el.classList.toggle('open');
  const ans = el.querySelector('.faq-a');
  if(el.classList.contains('open')) {
    ans.style.maxHeight = ans.scrollHeight + 'px';
  } else {
    ans.style.maxHeight = '0px';
  }
}

// Fake Notifications Logic
const notifs = [
  {n:'Felipe', p:'2.000 Seguidores BR', t:'Há 1 minuto', c:'f9317a'},
  {n:'Mariana', p:'500 Curtidas Mundiais', t:'Há 3 minutos', c:'3b82f6'},
  {n:'Lucas', p:'10k Visualizações Reels', t:'Há 5 minutos', c:'eab308'},
  {n:'Juliana', p:'1.000 Seguidores BR', t:'Agora mesmo', c:'22c55e'},
  {n:'Rafael', p:'5.000 Visualizações Kwai', t:'Há 2 minutos', c:'1d4ed8'}
];

function showNotification() {
  const n = document.getElementById('sales-notification');
  if(n.classList.contains('show')) return; // skip if already showing
  
  const data = notifs[Math.floor(Math.random() * notifs.length)];
  
  document.getElementById('sn-name').textContent = data.n;
  document.getElementById('sn-pkg').textContent = data.p;
  document.getElementById('sn-time').textContent = data.t;
  document.getElementById('sn-avatar').src = `https://ui-avatars.com/api/?name=${data.n[0]}&background=${data.c}&color=fff&size=40`;
  
  n.classList.add('show');
  
  setTimeout(() => {
    n.classList.remove('show');
  }, 4000); // show for 4s
}

// Randomly trigger notifications
setTimeout(() => {
  showNotification();
  setInterval(() => {
    if(Math.random() > 0.4) showNotification(); // 60% chance every 15s
  }, 15000);
}, 3000); // first notif after 3s

// Tracking Logic
function openTrackingModal() {
  document.getElementById('tracking-modal').style.display = 'flex';
  document.getElementById('tm-email').value = '';
  document.getElementById('tm-result').style.display = 'none';
}

function closeTrackingModal() {
  document.getElementById('tracking-modal').style.display = 'none';
}

async function trackOrder() {
  const email = document.getElementById('tm-email').value.trim();
  const res = document.getElementById('tm-result');
  if(!email || !email.includes('@')) {
    alert('Por favor, digite um e-mail válido.');
    return;
  }
  
  res.style.display = 'block';
  res.style.background = '#fcf8e3';
  res.style.color = '#8a6d3b';
  res.style.borderColor = '#faebcc';
  res.innerHTML = 'Buscando pedido na base de dados...';
  
  let orders = null;
  let error = null;
  try {
      const response = await fetch('/api/pedidos?email=' + encodeURIComponent(email));
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro na busca');
      orders = data;
  } catch(err) {
      error = err;
  }
    
  if (error || !orders || orders.length === 0) {
    res.style.background = '#fef2f2';
    res.style.color = '#ef4444';
    res.style.borderColor = '#fecaca';
    res.innerHTML = `<strong>Nenhum pedido encontrado!</strong><br>Verifique se o e-mail está correto e tente novamente.`;
  } else {
    const order = orders[0];
    const statusColor = order.status === 'Pendente' ? '#b45309' : '#16a34a';
    
    res.style.background = '#f0fdf4';
    res.style.color = '#15803d';
    res.style.borderColor = '#bbf7d0';
    
    let html = `<strong style="font-size:16px;">Pedido Encontrado!</strong><br><div style="margin-top:12px; font-size:13px; color:#374151; line-height:1.6; border-top:1px solid #bbf7d0; padding-top:12px; text-align:left;">`;
    html += `<div><strong>Nº Pedido:</strong> ${order.id}</div>`;
    html += `<div><strong>Serviço:</strong> ${order.service}</div>`;
    html += `<div><strong>Quantidade:</strong> ${order.qty >= 1000 ? (order.qty/1000)+'k' : order.qty} unid.</div>`;
    html += `<div><strong>Valor:</strong> R$ ${Number(order.val).toFixed(2).replace('.',',')}</div>`;
    html += `<div><strong>Link Alvo:</strong> <span style="word-break:break-all;">${order.link}</span></div>`;
    if(order.whatsapp) html += `<div><strong>WhatsApp:</strong> ${order.whatsapp}</div>`;
    html += `<div style="margin-top:8px;"><strong>Status Atual:</strong> <span style="background:white; padding:2px 8px; border-radius:100px; color:${statusColor}; font-weight:700; border:1px solid ${statusColor}40;">${order.status}</span></div>`;
    html += `</div>`;
    
    res.innerHTML = html;
  }
}
