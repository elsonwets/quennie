import { useEffect, useRef, useState } from 'react'
export function QuennieVideo({ src, poster, title, source }: { src: string; poster: string; title: string; source: string }) {
 const ref=useRef<HTMLVideoElement>(null)
 const [error,setError]=useState(false)
 useEffect(()=>{
  const video=ref.current
  const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)video?.pause()})
  if(video)observer.observe(video)
  const pause=()=>{if(document.hidden)video?.pause()}
  document.addEventListener('visibilitychange',pause)
  return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',pause);video?.pause()}
 },[src])
 return <div className="quennie-video">{error ? <div className="media-error"><img src={poster} alt={title} /><a href={source} target="_blank" rel="noopener noreferrer">Ver o vídeo no TikTok</a></div> : <video ref={ref} src={src} poster={poster} controls playsInline preload="none" aria-label={title} onError={()=>setError(true)} onPlay={()=>{document.querySelectorAll('video').forEach(video=>{if(video!==ref.current)video.pause()})}} />}<a href={source} target="_blank" rel="noopener noreferrer" className="video-credit">Quennie · publicação original ↗</a></div>
}
