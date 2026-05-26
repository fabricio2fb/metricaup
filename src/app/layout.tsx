import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "MetricaUp — Crescimento nas Redes Sociais",
  description: "Seguidores, curtidas e views para Instagram, TikTok, Facebook e Kwai. Entrega rápida e suporte 24h.",
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let fbPixel = ''
  let gaId = ''
  let gAdsId = ''
  let gtmId = ''

  try {
    const { data: rows } = await supabase
      .from('site_settings')
      .select('key, value')
    if (rows) {
      for (const r of rows) {
        if (r.key === 'facebook_pixel_id') fbPixel = r.value
        else if (r.key === 'google_analytics_id') gaId = r.value
        else if (r.key === 'google_ads_id') gAdsId = r.value
        else if (r.key === 'google_tag_manager_id') gtmId = r.value
      }
    }
  } catch {}

  const gtagId = gaId || gAdsId || ''

  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f9317a" />
        <link
          href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google Tag Manager */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}

        {/* Global site tag (gtag.js) — Google Analytics + Google Ads */}
        {gtagId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: [
                  'window.dataLayer = window.dataLayer || [];',
                  'function gtag(){dataLayer.push(arguments);}',
                  "gtag('js', new Date());",
                  gaId ? `gtag('config', '${gaId}');` : '',
                  gAdsId ? `gtag('config', '${gAdsId}');` : '',
                ].filter(Boolean).join('\n'),
              }}
            />
          </>
        )}

        {/* Meta Pixel Code */}
        {fbPixel && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${fbPixel}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${fbPixel}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className={`${jakarta.variable} font-jakarta antialiased`}>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
