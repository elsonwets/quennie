import { useEffect, useRef, useState } from 'react'

/** Preserve original framing; the native dialog offers a full viewport inspection. */
export function MediaImage({ src, alt, framed = false, className = '' }: { src: string; alt: string; framed?: boolean; className?: string }) {
 const dialog = useRef<HTMLDialogElement>(null)
 const [open, setOpen] = useState(false)
 const [zoomed, setZoomed] = useState(false)
 useEffect(() => {
  if (!open) return
  const previous = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  return () => { document.body.style.overflow = previous }
 }, [open])
 return <div className={`media-image ${framed ? 'is-framed' : ''} ${className}`}>
  <button type="button" className="media-image-button" aria-label={`Ampliar: ${alt}`} onClick={() => { dialog.current?.showModal(); setOpen(true) }}><img src={src} alt={alt} loading="lazy" decoding="async" data-fabric="" /><span className="media-image-label">Ver imagem completa ↗</span></button>
  <dialog ref={dialog} className="media-lightbox" aria-label={alt} onClose={() => { setOpen(false); setZoomed(false) }} onClick={e => { if(e.target === e.currentTarget) dialog.current?.close() }}><button type="button" className="media-lightbox-close" onClick={() => dialog.current?.close()}>Fechar ×</button><button type="button" className="media-lightbox-zoom" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{zoomed ? 'Ajustar à janela −' : 'Ampliar +'}</button><div className={`media-lightbox-viewport ${zoomed ? 'is-zoomed' : ''}`} tabIndex={zoomed ? 0 : undefined} aria-label={zoomed ? 'Imagem ampliada: desloque para ver os detalhes' : undefined}><img src={src} alt={alt} /></div><p>{alt}{zoomed && ' · Desloque a imagem para explorar os detalhes.'}</p></dialog>
 </div>
}
