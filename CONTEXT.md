# Contexto do Projeto: MetricaUp (segui)

Este arquivo serve como uma memória persistente para as conversas deste projeto específico.

## 🚀 Estado Atual
O projeto **MetricaUp** é uma plataforma e-commerce de serviços digitais (seguidores, curtidas, visualizações) para redes sociais.

### Arquitetura e Tech Stack:
- **Frontend**: Next.js 16 (App Router) com React 19.
- **Estilização**: Tailwind CSS 4.
- **Backend/API**: Next.js API Routes.
- **Banco de Dados**: Supabase (PostgreSQL).
- **Pagamentos**: Integração com Mercado Pago (PIX).
- **Notificações**: Web Push configurado.

## 📝 Atividades e Estrutura Identificadas
- **Página Principal (`src/app/page.tsx`)**: Gerencia todo o fluxo de navegação (Home -> Serviços -> Checkout -> PIX).
- **Scripts de Banco de Dados**: Recentemente foram criados/executados arquivos SQL para:
    - Adicionar colunas UTM (`add_utm_columns.sql`).
    - Corrigir a estrutura da tabela de pedidos (`fix_pedidos_table.sql`).
    - Corrigir ícones dos serviços (`fix_icons.sql`).
- **Setup Supabase Consolidado (`supabase_setup.sql`)**: Criado um script único e idempotente para criar as tabelas usadas pelo app (`platforms`, `services`, `service_variants`, `pedidos`, `gastos`, `push_subscriptions`), índices, triggers de `updated_at`, RLS e seed base das plataformas.
- **Afiliados v1**: Adicionado rastreio por `?ref=CODIGO`/`?af=`/`?affiliate=`/`?afiliado=`, persistência em `localStorage`, gravação em `pedidos` com comissão de 10%, SQL incremental (`add_affiliate_system.sql`) e exibição do afiliado no painel admin.
- **Área Pública de Afiliados**: Botão lateral "Afiliados", modal com minicadastro/login, código gerado automaticamente após cadastro, botão de copiar link, WhatsApp de suporte e mini dashboard com pedidos, pagamentos pendentes/efetuados, faturamento aprovado, comissão aprovada e comissão a liberar.
- **Admin Afiliados**: Aba "Afiliados" no `/admin` listando todos os afiliados com contato, chave PIX, pedidos, vendas, comissão a pagar, comissão já paga e comissão pendente. Admin pode marcar comissões aprovadas como pagas após pagar via PIX. Regra visível: comissões pagas de 3 em 3 dias.
- **Footer Social**: Adicionados botões de Instagram e TikTok no footer da home.
- **Suporte**: Botão flutuante de WhatsApp integrado diretamente com opções de mensagens predefinidas.
- **Sitemap & SEO**: Sitemap dinâmico (`src/app/sitemap.ts`) com todas as páginas, plataformas e serviços; `robots.ts` para orientar crawlers.
- **Tracking Pixels**: Aba "Configurações" no `/admin` para gerenciar Facebook Pixel, Google Analytics, Google Ads e Google Tag Manager. Os códigos são injetados dinamicamente no `<head>` via `layout.tsx` (server component assíncrono) com dados da tabela `site_settings` no Supabase.
- **Tabela `site_settings`**: Script SQL em `add_settings_table.sql` — criar manualmente no Supabase Studio para ativar o gerenciamento de pixels.

## ⚠️ Convenções Importantes
- **Sempre ler o `AGENTS.md`** antes de começar.
- **Design Premium**: O projeto utiliza tons de cinza escuro, rosa vibrante (`#f9317a`) e efeitos de vidro (glassmorphism).
- **Validação de Links**: Existe uma lógica específica para normalizar links de perfis do Instagram/TikTok.

---
*Última atualização: 2026-05-25*
