import { MediaImage } from '~/components/MediaImage'
import { absolute, breadcrumbs, seo, tiktokDate } from '~/seo'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Arrow, PageClosing } from '~/components/Editorial'
import { QuennieVideo } from '~/components/QuennieVideo'
import media from '~/quennie-media.json'
import { social } from '~/content'
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
 return <main><section className="editorial-wrap journal-intro"><h1 className="editorial-title">Entre.<br /><em>Sinta-se em casa.</em></h1><div><p>Um passeio pelas ideias, pelos espaços e pelos bastidores da Quennie. Aqui estão as nossas publicações, com imagens e vídeos para descobrir ao seu ritmo.</p><a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="editorial-link">Também estamos no TikTok <Arrow /></a></div></section><section className="editorial-wrap journal-content"><div className="journal-filters" aria-label="Filtrar publicações">{categories.map(label=><button key={label} type="button" aria-pressed={category===label} onClick={()=>setCategory(label)}>{label}</button>)}</div><p className="journal-image-note">Publicações originais da Quennie · {media.filter(p=>p.video).length} vídeos e {media.filter(p=>!p.video).reduce((total,p)=>total+p.images.length,0)} imagens para explorar.</p><div className="journal-grid">{visible.map(post=><MediaCard key={post.id} post={post}/>)}</div></section><PageClosing title="Gostou de alguma ideia? Vamos conversar." /></main>
}
