import { MediaImage } from '~/components/MediaImage'
import { absolute, breadcrumbs, seo, tiktokDate } from '~/seo'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Arrow } from '~/components/Editorial'
import { QuennieVideo } from '~/components/QuennieVideo'
import media from '~/quennie-media.json'
import { social } from '~/content'
import { SpatialHero, SpatialReveal, SpatialClosing } from '~/components/Spatial'
export const Route=createFileRoute('/projetos')({head:()=>seo({
  title:'Inspirações de interiores e bastidores · Quennie',
  description:'Salas, quartos, halls de entrada e cortinados: inspirações, vídeos e bastidores dos projetos de interiores da Quennie, na Guiné-Bissau e em Portugal.',
  path:'/projetos',
  image:media.find(p=>p.cover)?.cover?.replace('.webp','.jpg'),
  jsonLd:[
    ...media.filter(p=>p.video).map(p=>({
      '@type':'VideoObject',
      name:p.title,
      description:p.caption,
      thumbnailUrl:absolute(p.cover!.replace('.webp','.jpg')),
      contentUrl:absolute(p.video!),
      uploadDate:tiktokDate(p.id),
      duration:`PT${p.duration}S`,
      embedUrl:p.href,
    })),
    breadcrumbs([{name:'Inspirações',path:'/projetos'}]),
  ],
}),component:JournalPage})
const categories=['Todos','Cortinados & estores','Interiores','Mobiliário']
function MediaCard({post}:{post:(typeof media)[number]}){
 const [index,setIndex]=useState(0)
 const [playing,setPlaying]=useState(false)
 return <article className="journal-entry"><div className="journal-image">{playing && post.video ? <QuennieVideo src={post.video} poster={post.cover!} title={post.title} source={post.href} /> : <><MediaImage key={post.images[index]} src={post.images[index]} alt={`${post.title} · imagem ${index+1} da publicação da Quennie`} />{post.video && <button type="button" className="journal-play" onClick={()=>setPlaying(true)}>Ver vídeo · {post.duration}s <Arrow /></button>}</>}{!post.video && post.images.length>1 && <div className="photo-carousel"><button type="button" aria-label="Imagem anterior" onClick={()=>setIndex((index-1+post.images.length)%post.images.length)}>←</button><span aria-live="polite">{index+1} / {post.images.length}</span><button type="button" aria-label="Imagem seguinte" onClick={()=>setIndex((index+1)%post.images.length)}>→</button></div>}</div><div className="journal-caption"><h2 className="display italic">{post.title}</h2><a href={post.href} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${post.title} no TikTok`}><Arrow /></a></div><p>{post.caption}</p><span className="media-kind">{post.video ? 'Vídeo' : `${post.images.length} imagens`} · {post.category}</span></article>
}
function JournalPage(){
 const [category,setCategory]=useState('Todos')
 const visible=media.filter(post=>category==='Todos'||post.category===category)
 return <main className="interior-page inspiration-page"><SpatialHero title="Entre." emphasis="Sinta-se em casa." description="Um passeio pelas ideias, pelos espaços e pelos bastidores da Quennie. Publicações originais para descobrir ao seu ritmo." image="/media/7673556834803846407-01.webp" imageAlt="Inspiração de interiores publicada pela Quennie" caption="O universo Quennie · Imagens e ideias"><a href="#publicacoes" className="spatial-text-link">Descobrir as publicações <Arrow /></a></SpatialHero>
 <section className="editorial-wrap journal-content" id="publicacoes"><div className="journal-filter-bar"><div className="journal-filters" aria-label="Filtrar publicações">{categories.map(label=><button key={label} type="button" aria-pressed={category===label} onClick={()=>setCategory(label)}>{label}</button>)}</div><span role="status">{visible.length} publicações</span></div><p className="journal-image-note">Imagens, vídeos e detalhes originais da Quennie.</p><div className="journal-grid">{visible.map(post=><SpatialReveal key={post.id}><MediaCard post={post}/></SpatialReveal>)}</div><a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="spatial-text-link">Continue a descobrir no TikTok <Arrow /></a></section><SpatialClosing title="Uma ideia que ficou?" emphasis="Vamos conversar." /></main>
}
