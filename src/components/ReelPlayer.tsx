import { useState } from 'react'
import media from '~/quennie-media.json'
import { QuennieVideo } from './QuennieVideo'
const videos=media.filter(post=>post.video)
export function ReelPlayer() {
 const [index,setIndex]=useState(0)
 const post=videos[index]
 return <div className="real-reel-player"><QuennieVideo key={post.id} src={post.video!} poster={post.cover!} title={post.title} source={post.href} /><div><h3 className="display italic text-4xl">Venha ver de perto.</h3><p className="mt-4 mb-8 max-w-[44ch] leading-relaxed">Do tecido à montagem, do desenho ao espaço. Vídeos reais, partilhados pela Quennie.</p><div className="real-reel-list">{videos.map((video,i)=><button type="button" key={video.id} aria-pressed={i===index} onClick={()=>setIndex(i)}><img src={video.cover!} alt="" loading="lazy" /><span><strong>{video.title}</strong><span>{video.duration}s · {video.category}</span></span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5 10 7-10 7Z" fill="none" stroke="currentColor" /></svg></button>)}</div></div></div>
}
