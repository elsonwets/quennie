import { useState } from 'react'
import { img } from '~/content'

type Props = {
  image: string
  alt: string
}

// Until the real 3D renders arrive, the "render" side is the same photo, desaturated and flattened.
export function BeforeAfter({ image, alt }: Props) {
  const [split, setSplit] = useState(50)

  return (
    <figure className="relative aspect-[4/5] w-full overflow-hidden bg-linho-deep sm:aspect-[16/10]">
      <img src={img(image, 1800)} alt={alt} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <img
          src={img(image, 1800)}
          alt=""
          className="absolute inset-0 size-full object-cover"
          style={{ filter: 'grayscale(1) contrast(0.82) brightness(1.12) sepia(0.18)' }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-px bg-linho"
        style={{ left: `${split}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-linho text-nogueira shadow-lg">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <span className="absolute top-5 left-5 rounded-full bg-linho/90 px-3 py-1 text-sm">Projeto 3D</span>
      <span className="absolute top-5 right-5 rounded-full bg-nogueira/80 px-3 py-1 text-sm text-linho">
        Resultado final
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        aria-label="Comparar projeto 3D e resultado final"
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </figure>
  )
}
