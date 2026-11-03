import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { opacities, pleatStyles } from '~/content'
import { defaultCurtainChoice, describeCurtainChoice, type CurtainChoice } from '~/curtain-options'
import { ColourPicker } from './ColourPicker'
import { Curtain3D } from './curtain/Curtain3D'

export function CurtainStudio() {
 const [choice,setChoice] = useState<CurtainChoice>(defaultCurtainChoice)
 const [open,setOpen] = useState(false)
 const pleat=pleatStyles.find(p=>p.name===choice.pleat) || pleatStyles[0]
 const opacity=opacities.find(o=>o.name===choice.opacity) || opacities[1]
 return <div className="fabric-studio"><div className="studio-preview"><div className="studio-product-switch" aria-label="Tipo de produto">{(['Cortinado','Estore'] as const).map(product=><button key={product} type="button" aria-pressed={choice.product===product} onClick={()=>{setChoice({...choice,product});setOpen(false)}}>{product === 'Cortinado' ? 'Os meus cortinados' : 'O meu estore'}</button>)}</div>
  <div className="studio-scene">{choice.product==='Cortinado' ? <Curtain3D className="relative aspect-[4/5] w-full sm:aspect-[5/4]" background="/images/hero-interior.jpg" fabric={choice.colour.color} opacity={opacity.value} shape={pleat.shape} open={open} openAmount={.9} rodInset={.07} duration={2.2} /> : <div className="blind-simulation"><img src="/images/hero-interior.jpg" alt="Ambiente ilustrativo para experimentar o estore" /><div className="blind-fabric" style={{backgroundColor:choice.colour.color,opacity:opacity.value,transform:`scaleY(${open ? .13 : 1})`}} /><span className="blind-chain" aria-hidden="true" /></div>}
  <p className="studio-colour-tag"><span style={{background:choice.colour.color}} />{choice.colour.name}</p><button type="button" onClick={()=>setOpen(!open)} className="studio-open">{open ? 'Vamos fechar?' : 'Deixe entrar a luz'} <span aria-hidden="true">{open ? '↓' : '↑'}</span></button></div>
  <p className="studio-preview-caption">O seu espaço de experiências · simulação ilustrativa</p><p className="studio-selection" aria-live="polite">{choice.product} em <strong>{choice.colour.name.toLowerCase()}</strong>{choice.product==='Cortinado' && ` · ${choice.pleat}`} · {choice.opacity}</p>
  <Link to="/orcamento" search={{servico:'Cortinados & estores',config:JSON.stringify(choice)}} className="studio-quote">Gostei! Levar esta escolha para o orçamento <span aria-hidden="true">↗</span></Link>
 </div><div className="studio-controls"><ColourPicker value={choice.colour} onChange={colour=>setChoice({...choice,colour})} favourites={choice.favourites} onFavouritesChange={favourites=>setChoice({...choice,favourites})} />
 {choice.product==='Cortinado' && <fieldset className="studio-options"><legend>Como gosta das pregas?</legend><div>{pleatStyles.map(p=><button key={p.name} type="button" aria-pressed={choice.pleat===p.name} onClick={()=>setChoice({...choice,pleat:p.name})}>{p.name}</button>)}</div></fieldset>}
 <fieldset className="studio-options"><legend>Quanta luz deixamos entrar?</legend><div>{opacities.map(o=><button key={o.name} type="button" aria-pressed={choice.opacity===o.name} onClick={()=>setChoice({...choice,opacity:o.name})}>{o.name}</button>)}</div></fieldset><p className="sr-only">{describeCurtainChoice(choice)}</p></div></div>
}
