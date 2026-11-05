import { createServerFn } from '@tanstack/react-start'

// Quote requests also land in the studio's backoffice (the "Pedidos" inbox), not only in
// WhatsApp. The site can only call the `submit_lead` database function, which checks the
// input and stores one row; it cannot read anything back.

export interface LeadInput {
  name: string
  phone: string
  email?: string
  space?: string
  services: string[]
  country?: string
  timing?: string
  message?: string
  preferences?: string
  /** Honeypot: hidden from people, filled by bots. */
  website?: string
}

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : undefined)

export const submitLead = createServerFn({ method: 'POST' })
  .validator((input: unknown): LeadInput => {
    const raw = (input ?? {}) as Record<string, unknown>
    const name = text(raw.name, 120)
    const phone = text(raw.phone, 40)
    if (!name || !phone) throw new Error('Nome e telefone são obrigatórios')
    return {
      name,
      phone,
      email: text(raw.email, 160) || undefined,
      space: text(raw.space, 80),
      services: Array.isArray(raw.services) ? raw.services.filter((s): s is string => typeof s === 'string').slice(0, 12).map((s) => s.slice(0, 80)) : [],
      country: text(raw.country, 80),
      timing: text(raw.timing, 80),
      message: text(raw.message, 3000),
      preferences: text(raw.preferences, 1000),
      website: text(raw.website, 200),
    }
  })
  .handler(async ({ data }) => {
    // Read at run time on the server (import.meta.env would be frozen at build time).
    const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {}
    const url = env.VITE_SUPABASE_URL ?? env.SUPABASE_URL
    const key = env.VITE_SUPABASE_KEY ?? env.SUPABASE_KEY
    if (!url || !key) {
      console.warn('VITE_SUPABASE_URL / VITE_SUPABASE_KEY em falta: pedido não guardado no backoffice')
      return { saved: false }
    }
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/submit_lead`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: data }),
    })
    if (!res.ok) {
      console.error('submit_lead falhou', res.status, await res.text())
      return { saved: false }
    }
    return { saved: true }
  })
