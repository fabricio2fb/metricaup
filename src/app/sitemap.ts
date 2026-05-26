import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE = 'https://metricaup.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: services } = await supabase
    .from('services')
    .select('id, name, updated_at, platform_id')
    .eq('active', true)

  const { data: platforms } = await supabase
    .from('platforms')
    .select('id, name, updated_at')
    .eq('active', true)

  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/#servicos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE}/#como-funciona`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/#faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE}/#contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  if (platforms) {
    for (const p of platforms) {
      entries.push({
        url: `${BASE}/#${p.id}`,
        lastModified: new Date(p.updated_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  if (services) {
    for (const s of services) {
      entries.push({
        url: `${BASE}/?service=${s.id}`,
        lastModified: new Date(s.updated_at || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return entries
}
