import * as THREE from 'three'

/**
 * One WebGL layer for the whole site: every `img[data-fabric]` is redrawn as a panel of cloth
 * hanging from its top edge. Panels unroll when they first enter the viewport, their hems trail
 * behind fast scrolling, and the fabric yields around the pointer. The DOM image stays in place
 * (transparent) for layout, accessibility, clicks and SEO.
 */

const vertexShader = /* glsl */ `
uniform vec2 uSize;
uniform float uVelocity;
uniform float uReveal;
uniform float uTime;
uniform vec2 uPointer;
uniform float uHover;
varying vec2 vUv;
varying float vShade;

void main() {
  vUv = uv;
  vec3 p = position;
  float hang = 1.0 - uv.y;              // 0 at the rod, 1 at the hem
  float hem = hang * hang;

  // Unroll from the top: lower rows are gathered up until the reveal passes them.
  // The hem is a single soft arc, lowest in the middle like real cloth, never a jagged tear.
  float edge = uReveal * 1.2 + 0.12 * sin(uv.x * 3.14159) - 0.12;
  float rolled = smoothstep(edge - 0.25, edge, hang);
  p.y += rolled * hang;

  // Hem trails behind the scroll (pixels converted to plane units), most where cloth is least supported.
  float slack = 0.55 + 0.45 * sin(uv.x * 3.14159);
  p.y -= uVelocity * hem * slack * 0.9 / uSize.y;
  p.x += sin(uv.y * 5.0 + uTime * 1.1) * uVelocity * hem * 0.12 / uSize.x;

  // Fingertip: a soft dent with a ring of folds around the pointer.
  vec2 d = (uv - uPointer) * vec2(uSize.x / uSize.y, 1.0);
  float r = length(d);
  float ripple = uHover * exp(-r * 6.0) * sin(r * 34.0 - uTime * 5.0);

  vShade = ripple + uVelocity * hem * 0.004 * sin(uv.x * 12.0 + uTime);
  p.xy += normalize(d + 1e-5) * ripple * 4.0 / uSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uContain;
uniform vec3 uBackdrop;
uniform float uReveal;
varying vec2 vUv;
varying float vShade;

float weave(vec2 px) {
  // Warp and weft threads: two fine sine combs with a little irregularity.
  float warp = sin(px.x * 2.1 + sin(px.y * 0.11) * 1.5);
  float weft = sin(px.y * 2.1 + sin(px.x * 0.09) * 1.5);
  return 0.5 + 0.25 * (warp + weft);
}

void main() {
  float planeAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / uImage.y;
  vec2 uv = vUv;
  vec2 scale = vec2(1.0);
  if (uContain > 0.5) {
    scale = planeAspect > imageAspect ? vec2(planeAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / planeAspect);
  } else {
    scale = planeAspect > imageAspect ? vec2(1.0, imageAspect / planeAspect) : vec2(planeAspect / imageAspect, 1.0);
  }
  uv = (uv - 0.5) * scale + 0.5;

  vec3 color = uBackdrop;
  if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) color = texture2D(uMap, uv).rgb;

  // Printed on linen: the weave catches a little light, folds shade the print.
  color *= 0.965 + 0.05 * weave(vUv * uSize);
  color *= 1.0 + vShade * 0.18;
  gl_FragColor = vec4(color, smoothstep(0.0, 0.08, uReveal));
  #include <colorspace_fragment>
}
`

type Panel = {
  img: HTMLImageElement
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  texture?: THREE.Texture
  revealStart: number
  lastRect: string
  pointer: THREE.Vector2
  hover: number
  loaded: boolean
}

const BACKDROP = new THREE.Color('#e4dacd')

export class FabricImages {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100)
  private geometry = new THREE.PlaneGeometry(1, 1, 64, 48)
  private panels = new Map<HTMLImageElement, Panel>()
  private loader = new THREE.TextureLoader().setCrossOrigin('anonymous')
  private mutation: MutationObserver
  private raf = 0
  private lastScroll = window.scrollY
  private velocity = 0
  private clock = performance.now()
  private mouse = { x: -1, y: -1 }
  private disposed = false

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.renderer.setClearColor(0, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.resize()
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.handlePointer, { passive: true })

    // Hide tagged images through a class on <html>: touching React-owned <img> attributes
    // before hydration finishes would cause a mismatch.
    document.documentElement.classList.add('fabric-on')
    this.scan()
    this.mutation = new MutationObserver(() => this.scan())
    this.mutation.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] })
    this.raf = requestAnimationFrame(this.loop)
  }

  private resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h, false)
    // Pixel-space camera with y pointing down, so DOM rects map 1:1.
    this.camera.left = 0
    this.camera.right = w
    this.camera.top = 0
    this.camera.bottom = -h
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
  }

  private handlePointer = (e: PointerEvent) => {
    this.mouse.x = e.clientX
    this.mouse.y = e.clientY
  }

  private scan() {
    const found = new Set(document.querySelectorAll<HTMLImageElement>('img[data-fabric]'))
    for (const [img, panel] of this.panels) {
      if (!found.has(img) || !img.isConnected) this.remove(panel)
      else if (panel.loaded && panel.texture && (panel.texture.image as HTMLImageElement).src !== img.currentSrc) {
        this.remove(panel)
      }
    }
    for (const img of found) if (!this.panels.has(img)) this.add(img)
  }

  private add(img: HTMLImageElement) {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uMap: { value: null },
        uSize: { value: new THREE.Vector2(1, 1) },
        uImage: { value: new THREE.Vector2(1, 1) },
        uContain: { value: 0 },
        uBackdrop: { value: BACKDROP },
        uVelocity: { value: 0 },
        uReveal: { value: 0 },
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
      },
    })
    const mesh = new THREE.Mesh(this.geometry, material)
    mesh.visible = false
    mesh.frustumCulled = false
    this.scene.add(mesh)
    const panel: Panel = { img, mesh, revealStart: -1, lastRect: '', pointer: new THREE.Vector2(0.5, 0.5), hover: 0, loaded: false }
    this.panels.set(img, panel)

    const src = img.currentSrc || img.src
    this.loader.load(src, (texture) => {
      if (this.disposed || !this.panels.has(img)) {
        texture.dispose()
        return
      }
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 4
      texture.generateMipmaps = true
      panel.texture = texture
      const source = texture.image as HTMLImageElement
      material.uniforms.uMap.value = texture
      material.uniforms.uImage.value.set(source.naturalWidth || source.width, source.naturalHeight || source.height)
      material.uniforms.uContain.value = getComputedStyle(img).objectFit === 'cover' ? 0 : 1
      panel.loaded = true
    }, undefined, () => {
      // Without a texture the cloth has nothing to draw: give this one image back to the DOM.
      img.style.opacity = '1'
      this.remove(panel)
    })
  }

  private remove(panel: Panel) {
    this.scene.remove(panel.mesh)
    panel.mesh.material.dispose()
    panel.texture?.dispose()
    this.panels.delete(panel.img)
  }

  private loop = (now: number) => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min((now - this.clock) / 1000, 0.05)
    this.clock = now
    const time = now / 1000

    const scroll = window.scrollY
    const delta = scroll - this.lastScroll
    this.lastScroll = scroll
    // Pixels of hem lag: follows scroll speed, settles with a soft damping.
    const target = THREE.MathUtils.clamp(delta * 1.6, -55, 55)
    this.velocity += (target - this.velocity) * (1 - Math.exp(-dt / 0.12))

    const vw = window.innerWidth
    const vh = window.innerHeight
    let active = Math.abs(this.velocity) > 0.05

    for (const panel of this.panels.values()) {
      const { img, mesh } = panel
      const rect = img.getBoundingClientRect()
      const onScreen = panel.loaded && rect.width > 0 && rect.bottom > -100 && rect.top < vh + 100 && rect.right > 0 && rect.left < vw
      mesh.visible = onScreen
      if (!onScreen) continue

      const u = mesh.material.uniforms
      if (panel.revealStart < 0 && rect.top < vh * 0.85) panel.revealStart = time
      const reveal = panel.revealStart < 0 ? 0 : Math.min(1, (time - panel.revealStart) / 1.9)
      u.uReveal.value = reveal < 1 ? 1 - Math.pow(1 - reveal, 3) : 1
      if (reveal < 1) active = true

      const inside = this.mouse.x >= rect.left && this.mouse.x <= rect.right && this.mouse.y >= rect.top && this.mouse.y <= rect.bottom
      panel.hover += ((inside ? 1 : 0) - panel.hover) * (1 - Math.exp(-dt / 0.25))
      if (inside) panel.pointer.set((this.mouse.x - rect.left) / rect.width, 1 - (this.mouse.y - rect.top) / rect.height)
      if (panel.hover > 0.01) active = true

      // Layout can shift without any scroll (images loading, accordions): redraw when it does.
      const key = `${rect.left}|${rect.top}|${rect.width}|${rect.height}`
      if (key !== panel.lastRect) {
        panel.lastRect = key
        active = true
      }

      mesh.scale.set(rect.width, rect.height, 1)
      mesh.position.set(rect.left + rect.width / 2, -(rect.top + rect.height / 2), 0)
      u.uSize.value.set(rect.width, rect.height)
      u.uVelocity.value = this.velocity
      u.uTime.value = time
      u.uHover.value = panel.hover
      u.uPointer.value.copy(panel.pointer)
    }

    // Keep the GPU idle when nothing moves; scrolling and hovering wake it up.
    if (active || delta !== 0) this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.mutation.disconnect()
    document.documentElement.classList.remove('fabric-on')
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.handlePointer)
    for (const panel of [...this.panels.values()]) this.remove(panel)
    this.geometry.dispose()
    this.renderer.dispose()
  }
}
