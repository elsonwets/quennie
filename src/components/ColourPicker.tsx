import { useState } from 'react'
import { curtainColours, colourFamilies, type Colour } from '~/curtain-options'

export function ColourPicker({ value, onChange, favourites, onFavouritesChange }: { value: Colour; onChange: (colour: Colour) => void; favourites: Colour[]; onFavouritesChange: (colours: Colour[]) => void }) {
 const [family, setFamily] = useState(() => colourFamilies.includes(value.family) ? value.family : 'Todas')
 const [query, setQuery] = useState('')
 const visible = curtainColours.filter(c => (family === 'Todas' || c.family === family) && c.name.toLocaleLowerCase('pt').includes(query.toLocaleLowerCase('pt')))
 const saved = favourites.some(c => c.color === value.color)
 function save() { onFavouritesChange(saved ? favourites.filter(c => c.color !== value.color) : favourites.length < 5 ? [...favourites, value] : favourites) }
 return <fieldset className="colour-picker"><legend>Encontre a sua cor feliz.</legend><p className="colour-intro">64 tons para explorar. Guarde até 5 favoritos e experimente sem pressa.</p>
  <div className="colour-toolbar"><label className="colour-search"><span className="sr-only">Procurar uma cor</span><input type="search" placeholder="Procura sálvia, areia, azul…" value={query} onChange={e => setQuery(e.target.value)} /></label><button type="button" className="surprise-button" onClick={() => { const options = visible.length ? visible : curtainColours; onChange(options[Math.floor(Math.random()*options.length)]) }}>Surpreenda-me <span aria-hidden="true">↗</span></button></div>
  <div className="colour-families" aria-label="Famílias de cores">{['Todas',...colourFamilies].map(label => <button type="button" key={label} aria-pressed={family === label} onClick={() => setFamily(label)}>{label}</button>)}</div>
  <div className="colour-grid">{visible.map(c => <button type="button" key={c.color} className="colour-swatch" title={`${c.name} · ${c.color}`} aria-label={`${c.name}, ${c.color}`} aria-pressed={value.color === c.color} onClick={() => onChange(c)}><span style={{backgroundColor:c.color}}>{value.color === c.color && <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4 10-10" fill="none" stroke="currentColor" strokeWidth="2" /></svg>}</span><span>{c.name}</span></button>)}</div>
  {!visible.length && <p className="colour-empty">Não encontrámos esse tom. Experimente outra palavra ou crie a sua cor abaixo.</p>}
  <div className="colour-selected" aria-live="polite"><span className="colour-chip" style={{background:value.color}} /><div><strong>{value.name}</strong><span>{value.color.toUpperCase()}</span></div><button type="button" onClick={save} disabled={!saved && favourites.length >= 5} aria-pressed={saved}>{saved ? 'Guardada ✓' : 'Guardar cor ♡'}</button></div>
  <div className="custom-colour"><label><input type="color" value={value.color} onChange={e => onChange({name:'A minha cor',color:e.target.value,family:'Personalizada'})} />Tem outra cor em mente? Escolha a sua.</label></div>
  {favourites.length > 0 && <div className="colour-favourites"><p>A sua pequena coleção · {favourites.length}/5</p><div>{favourites.map(c => <div key={c.color}><button type="button" className="favourite-select" onClick={() => onChange(c)} aria-label={`Escolher ${c.name}`}><span style={{background:c.color}} />{c.name}</button><button type="button" className="favourite-remove" onClick={() => onFavouritesChange(favourites.filter(item => item.color !== c.color))} aria-label={`Remover ${c.name} dos favoritos`}>×</button></div>)}</div></div>}
  <p className="colour-note">Paleta de inspiração. Cores e tecidos sujeitos a confirmação com a equipa; a cor no ecrã pode variar da amostra real.</p>
 </fieldset>
}
