import { useReducedMotion } from '~/hooks/useReducedMotion'
import { breadcrumbs, seo } from '~/seo'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ColourPicker } from '~/components/ColourPicker'
import { parseCurtainChoice, describeCurtainChoice } from '~/curtain-options'
import { WhatsAppIcon } from '~/components/WhatsAppButton'
import { SpatialDepth } from '~/components/Spatial'
import { services, whatsappLink, opacities, pleatStyles } from '~/content'
import { submitLead } from '~/server/lead'
type QuoteSearch = { servico?: string; nota?: string; config?: string }
export const Route = createFileRoute('/orcamento')({
  validateSearch: (search: Record<string, unknown>): QuoteSearch => ({
    servico: typeof search.servico === 'string' ? search.servico : undefined,
    nota: typeof search.nota === 'string' ? search.nota : undefined,
    config: typeof search.config === 'string' && search.config.length <= 3000 ? search.config : undefined,
  }),
  head: () => seo({
    title: 'Pedir orçamento de interiores e cortinados · Quennie',
    description: 'Descreva o seu espaço em quatro passos e envie o pedido de orçamento personalizado diretamente para o WhatsApp da Quennie.',
    path: '/orcamento',
    jsonLd: [breadcrumbs([{ name: 'Pedir orçamento', path: '/orcamento' }])],
  }),
  component: QuotePage,
})
const spaces = ['Casa', 'Escritório', 'Hotel', 'Restaurante', 'Outro espaço']
const countries = ['Guiné-Bissau', 'Portugal', 'Senegal', 'Outro país']
const timings = ['Sem pressa', 'Nos próximos 3 meses', 'Assim que possível']
const steps = ['Espaço', 'Serviços', 'Local', 'Detalhes'] as const
function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`quote-choice rounded-full border px-5 py-3 text-left transition-colors ${
        selected ? 'border-nogueira bg-nogueira text-linho' : 'border-nogueira/20 hover:border-nogueira/60'
      }`}
    >
      {children}
    </button>
  )
}
function QuotePage() {
  const search = Route.useSearch()
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [curtainChoice, setCurtainChoice] = useState(() => parseCurtainChoice(search.config))
  const [hasPreference, setHasPreference] = useState(Boolean(search.config))
  const [width,setWidth] = useState('')
  const [height,setHeight] = useState('')
  const [space, setSpace] = useState('')
  const [chosen, setChosen] = useState<string[]>(search.servico ? [search.servico] : [])
  const [country, setCountry] = useState('')
  const [timing, setTiming] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState(search.nota ? `Preferências: ${search.nota}. ` : '')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [sent, setSent] = useState(false)
  const toggleService = (s: string) =>
    setChosen((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]))
  const phoneOk = phone.replace(/\D/g, '').length >= 6
  const canContinue = [space !== '', chosen.length > 0, country !== '', name.trim() !== '' && phoneOk][step]
  const curtainNotes = chosen.includes('Cortinados & estores')
    ? [hasPreference && describeCurtainChoice(curtainChoice), (width || height) && `Medidas aproximadas: ${width || 'por medir'} × ${height || 'por medir'} cm.`].filter(Boolean).join(' ')
    : ''
  // Also keeps the request in the studio's backoffice. Not awaited: WhatsApp opens at once
  // and stays the way the conversation continues, even if saving fails.
  const saveRequest = () => {
    if (!canContinue || sent) return
    setSent(true)
    submitLead({ data: { name, phone, email, space, services: chosen, country, timing, message, preferences: curtainNotes || undefined, website } }).catch(() => {})
  }
  const summary = [
    `Olá Quennie, o meu nome é ${name.trim()}.`,
    `Gostaria de um orçamento para: ${chosen.join(', ')}.`,
    `Espaço: ${space}. País: ${country}.`,
    timing && `Prazo: ${timing}.`,
    chosen.includes('Cortinados & estores') && hasPreference && `Preferências: ${describeCurtainChoice(curtainChoice)}`,
    chosen.includes('Cortinados & estores') && (width || height) && `Medidas aproximadas: largura ${width || 'por medir'} cm × altura ${height || 'por medir'} cm.`,
    message.trim() && `\n${message.trim()}`,
  ]
    .filter(Boolean)
    .join('\n')
  return (
    <main className="interior-page quote-page spatial-quote">
      <div className="quote-grid">
        <div className="quote-aside">
          <h1>Vamos dar forma<br /><em>ao seu espaço.</em></h1>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-nogueira/75">
            Todos os projetos são orçamentados à medida. Responda a quatro perguntas e envie o
            pedido diretamente para o nosso WhatsApp.
          </p>
          <SpatialDepth className="quote-material-object"><img src="/images/hero-linen.webp" alt="Detalhe da textura do linho" className="quote-material" /><span aria-hidden="true" /></SpatialDepth>
          <p className="mt-10 text-taupe">Prefere falar já?</p>
          <a
            href={whatsappLink('Olá Quennie, gostaria de falar sobre um orçamento.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-2 text-lg hover:text-cognac"
          >
            <WhatsAppIcon /> Falar connosco no WhatsApp
          </a>
        </div>
        <div className="quote-workspace">
          <p className="quote-step-status" role="status">O seu pedido · Passo {step + 1} de 4</p>
          <ol className="mb-10 flex gap-2" aria-label="Progresso">
            {steps.map((label, i) => (
              <li key={label} className="flex-1">
                <span aria-current={i === step ? 'step' : undefined} className={`block h-[2px] ${i <= step ? 'bg-cognac' : 'bg-nogueira/15'}`} />
                <span className={`mt-2 block text-sm ${i === step ? 'text-nogueira' : 'text-taupe'}`}>
                  {i + 1}. {label}
                </span>
              </li>
            ))}
          </ol>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: reduce ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : -24 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-[300px]"
            >
              {step === 0 && (
                <fieldset>
                  <legend className="font-display mb-6 text-3xl font-light">Que espaço quer transformar?</legend>
                  <div className="flex flex-wrap gap-3">
                    {spaces.map((s) => (
                      <Choice key={s} selected={space === s} onClick={() => setSpace(s)}>
                        {s}
                      </Choice>
                    ))}
                  </div>
                </fieldset>
              )}
              {step === 1 && (<>
                <fieldset><legend className="font-display mb-6 text-3xl font-light">O que vamos criar juntos?</legend><div className="flex flex-wrap gap-3">{services.map(s=><Choice key={s.name} selected={chosen.includes(s.name)} onClick={()=>toggleService(s.name)}>{s.name}</Choice>)}</div></fieldset>
                {chosen.includes('Cortinados & estores') && <div className="quote-colour-playground"><h2 className="display italic text-3xl">Já tem uma cor em mente?</h2><p className="mt-3 mb-5 text-sm">Pode escolher agora ou descobrir com a equipa. Sem pressão.</p><div className="studio-product-switch">{(['Cortinado','Estore'] as const).map(product=><button key={product} type="button" aria-pressed={curtainChoice.product===product} onClick={()=>{setHasPreference(true);setCurtainChoice({...curtainChoice,product})}}>{product}</button>)}</div><ColourPicker value={curtainChoice.colour} onChange={colour=>{setHasPreference(true);setCurtainChoice({...curtainChoice,colour})}} favourites={curtainChoice.favourites} onFavouritesChange={favourites=>{setHasPreference(true);setCurtainChoice({...curtainChoice,favourites})}} /><div className="quote-preference-selects">{curtainChoice.product==='Cortinado' && <label>A sua prega<select value={curtainChoice.pleat} onChange={e=>{setHasPreference(true);setCurtainChoice({...curtainChoice,pleat:e.target.value})}}>{pleatStyles.map(p=><option key={p.name}>{p.name}</option>)}</select></label>}<label>A sua luz<select value={curtainChoice.opacity} onChange={e=>{setHasPreference(true);setCurtainChoice({...curtainChoice,opacity:e.target.value})}}>{opacities.map(o=><option key={o.name}>{o.name}</option>)}</select></label></div><div className="quote-measures"><label>Largura aproximada (cm)<input type="number" min="1" max="30000" inputMode="decimal" value={width} onChange={e=>setWidth(e.target.value === '' ? '' : String(Math.min(30000,Math.max(1,Number(e.target.value)))))} placeholder="Ex.: 250" /></label><label>Altura aproximada (cm)<input type="number" min="1" max="30000" inputMode="decimal" value={height} onChange={e=>setHeight(e.target.value === '' ? '' : String(Math.min(30000,Math.max(1,Number(e.target.value)))))} placeholder="Ex.: 280" /></label></div></div>}
              </>)}
              {step === 2 && (
                <div className="space-y-10">
                  <fieldset>
                    <legend className="font-display mb-6 text-3xl font-light">Onde fica o espaço?</legend>
                    <div className="flex flex-wrap gap-3">
                      {countries.map((c) => (
                        <Choice key={c} selected={country === c} onClick={() => setCountry(c)}>
                          {c}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="mb-4 text-taupe">Para quando? (opcional)</legend>
                    <div className="flex flex-wrap gap-3">
                      {timings.map((t) => (
                        <Choice key={t} selected={timing === t} onClick={() => setTiming(timing === t ? '' : t)}>
                          {t}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="quote-summary"><h2>O seu pedido</h2>{chosen.includes('Cortinados & estores') && hasPreference && <p className="quote-colour-summary"><span style={{background:curtainChoice.colour.color}} />{describeCurtainChoice(curtainChoice)}</p>}<dl><div><dt>Espaço</dt><dd>{space}</dd></div><div><dt>Serviços</dt><dd>{chosen.join(', ')}</dd></div><div><dt>Local</dt><dd>{country}</dd></div>{chosen.includes('Cortinados & estores') && (width || height) && <div><dt>Medidas</dt><dd>{width || 'por medir'} × {height || 'por medir'} cm</dd></div>}{timing && <div><dt>Prazo</dt><dd>{timing}</dd></div>}</dl></div>
                  <label className="block">
                    <span className="font-display mb-4 block text-3xl font-light">Como se chama?</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                      maxLength={120}
                      className="w-full border-b border-nogueira/30 bg-transparent py-3 text-lg outline-none focus:border-cognac"
                    />
                  </label>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-taupe">WhatsApp ou telefone</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        inputMode="tel"
                        required
                        maxLength={40}
                        placeholder="+245 …"
                        className="w-full border-b border-nogueira/30 bg-transparent py-3 text-lg outline-none focus:border-cognac"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-taupe">Email (opcional)</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        maxLength={160}
                        className="w-full border-b border-nogueira/30 bg-transparent py-3 text-lg outline-none focus:border-cognac"
                      />
                    </label>
                  </div>
                  {/* Left empty by people; bots fill it and their request is ignored. */}
                  <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
                  <label className="block">
                    <span className="mb-2 block text-taupe">Conte-nos mais sobre o projeto (opcional)</span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full resize-none border border-nogueira/20 bg-transparent p-4 outline-none focus:border-cognac"
                    />
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="px-2 py-3 text-taupe hover:text-nogueira">
                Voltar
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-full bg-nogueira px-8 py-3.5 text-linho transition-colors hover:bg-cognac disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-nogueira"
              >
                Continuar
              </button>
            ) : (
              <a
                href={canContinue ? whatsappLink(summary) : undefined}
                onClick={saveRequest}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!canContinue}
                tabIndex={canContinue ? 0 : -1}
                className={`inline-flex items-center gap-2 rounded-full bg-palma px-8 py-3.5 text-linho transition-colors hover:bg-palma-deep ${
                  canContinue ? '' : 'pointer-events-none opacity-35'
                }`}
              >
                <WhatsAppIcon /> Enviar pedido pelo WhatsApp
              </a>
            )}
          </div>
          {step === steps.length - 1 && !canContinue && (
            <p className="mt-3 text-sm text-taupe">Indique o seu nome e o seu número para enviar o pedido.</p>
          )}
          {sent && (
            <p role="status" className="mt-3 text-sm text-palma">
              Pedido recebido. Respondemos pelo WhatsApp com a maior brevidade.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
