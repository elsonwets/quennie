import * as THREE from 'three'

/** A photographic cloth surface on a deforming, subdivided mesh. */
export class PhotographicCurtainScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20)
  private geometry = new THREE.PlaneGeometry(1, 1, 160, 60)
  private materials: THREE.ShaderMaterial[] = []
  private texture?: THREE.Texture
  private observer: ResizeObserver
  private frame = 0
  private start = 0
  private progress = 0
  private disposed = false
  private completed = false
  private onScreen = true
  private intersection: IntersectionObserver
  // Air in the room: `gust` follows the pointer's horizontal speed and settles back to calm.
  private gust = 0
  private gustTarget = 0
  private mouseX = 0
  private lastPointerX: number | null = null
  private lastFrame = 0

  constructor(private canvas: HTMLCanvasElement, private onReady: () => void, private onOpened: () => void, private onError: () => void) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    this.renderer.setClearColor(0, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.camera.position.z = 5
    this.observer = new ResizeObserver(this.resize)
    this.observer.observe(canvas)
    document.addEventListener('visibilitychange', this.visibility)
    window.addEventListener('pointermove', this.pointer, { passive: true })
    // Once open, the drapes keep breathing only while the hero is on screen.
    this.intersection = new IntersectionObserver(([entry]) => {
      this.onScreen = entry.isIntersecting
      if (this.onScreen && this.completed && !this.disposed && !document.hidden) {
        cancelAnimationFrame(this.frame)
        this.frame = requestAnimationFrame(this.animate)
      }
    })
    this.intersection.observe(canvas)
    new THREE.TextureLoader().load('/images/hero-linen.webp', (texture) => {
      if (this.disposed) { texture.dispose(); return }
      this.texture = texture
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
      for (const side of [-1, 1]) {
        const material = new THREE.ShaderMaterial({
          uniforms: { cloth: { value: texture }, side: { value: side }, aspect: { value: 1 }, progress: { value: 0 }, time: { value: 0 }, gust: { value: 0 }, mouseX: { value: 0 } },
          side: THREE.DoubleSide,
          vertexShader: `
            uniform float side, aspect, progress, time, gust, mouseX;
            varying vec2 photoUV;
            varying float relief;
            void main() {
              float u = uv.x;
              float v = uv.y;
              float lag = 0.13 * pow(1.0-v, 1.8) * sin(progress * 3.14159265);
              float p = clamp(progress - lag, 0.0, 1.0);
              float span = mix(1.015, 0.155, p);
              float wave = sin(u * 46.0 + 0.4 * sin(u * 17.0) + (1.0-v)*0.7);
              float sway = sin(time * 2.5 + u*4.0) * sin(p*3.14159265) * pow(1.0-v,2.0);
              float x = side * (aspect - u * aspect * span);
              x += side * 0.025 * sway * u;
              float y = (v * 2.04 - 1.02) - 0.008 * sin(u * 19.0) * p;
              float z = 0.04 * wave * p + 0.025 * sway;

              // After the reveal the cloth keeps breathing: a slow draught, plus gusts from the
              // pointer that push hardest on the drape nearest to it. The hem moves, the heading stays.
              float hem = pow(1.0 - v, 2.2);
              float breeze = 0.6 * sin(time * 0.85 + u * 4.0 + side * 1.7) + 0.4 * sin(time * 1.6 + v * 3.2 + u * 9.0);
              float near = exp(-abs(mouseX - side * 0.9) * 1.8);
              float push = gust * (0.35 + 1.4 * near);
              x += (0.014 * breeze + 0.06 * push) * hem * p;
              z += (0.02 * breeze + 0.03 * abs(push)) * hem * p;
              float flutter = sin(u * 46.0 + time * 1.3 + push * 6.0) * hem * (0.15 + abs(push));

              photoUV = vec2(side < 0.0 ? u*0.5 : 1.0-u*0.5, v);
              relief = wave * p + flutter * p * 0.6;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D cloth;
            varying vec2 photoUV;
            varying float relief;
            void main() {
              vec4 color = texture2D(cloth, photoUV);
              color.rgb *= 1.0 + relief * 0.065;
              gl_FragColor = color;
              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }
          `,
        })
        this.materials.push(material)
        const mesh = new THREE.Mesh(this.geometry, material)
        mesh.frustumCulled = false
        this.scene.add(mesh)
      }
      this.resize()
      this.onReady()
      this.start = performance.now() + 650
      this.frame = requestAnimationFrame(this.animate)
    }, undefined, () => { if (!this.disposed) this.onError() })
  }

  private resize = () => {
    const { clientWidth: w, clientHeight: h } = this.canvas
    if (!w || !h || this.disposed) return
    this.renderer.setSize(w, h, false)
    this.camera.left = -w / h
    this.camera.right = w / h
    this.camera.updateProjectionMatrix()
    for (const material of this.materials) material.uniforms.aspect.value = w / h
    this.renderer.render(this.scene, this.camera)
  }

  private visibility = () => {
    cancelAnimationFrame(this.frame)
    if (!document.hidden && !this.disposed && (!this.completed || this.onScreen)) this.frame = requestAnimationFrame(this.animate)
  }

  private pointer = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect()
    if (!rect.width) return
    this.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
    if (this.lastPointerX !== null) {
      // Normalised horizontal speed, capped so a flick reads as a gust, not a storm.
      const dx = (e.clientX - this.lastPointerX) / rect.width
      this.gustTarget = THREE.MathUtils.clamp(this.gustTarget + dx * 9, -1, 1)
    }
    this.lastPointerX = e.clientX
  }

  private animate = (now: number) => {
    if (this.disposed) return
    const dt = Math.min((now - (this.lastFrame || now)) / 1000, 0.05)
    this.lastFrame = now
    const t = THREE.MathUtils.clamp((now - this.start) / 3200, 0, 1)
    // Quintic smoothstep gives the heading a measured start and a soft final gather.
    this.progress = t * t * t * (t * (t * 6 - 15) + 10)

    // The gust rises quickly, then the air calms down over about a second.
    this.gustTarget *= Math.exp(-dt / 0.45)
    this.gust += (this.gustTarget - this.gust) * (1 - Math.exp(-dt / 0.18))

    for (const material of this.materials) {
      material.uniforms.progress.value = this.progress
      material.uniforms.time.value = now / 1000
      material.uniforms.gust.value = this.gust
      material.uniforms.mouseX.value = this.mouseX
    }
    this.renderer.render(this.scene, this.camera)
    if (t >= 1 && !this.completed) {
      this.completed = true
      this.onOpened()
    }
    if (!this.completed || (this.onScreen && !document.hidden)) this.frame = requestAnimationFrame(this.animate)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frame)
    document.removeEventListener('visibilitychange', this.visibility)
    window.removeEventListener('pointermove', this.pointer)
    this.intersection.disconnect()
    this.observer.disconnect()
    this.geometry.dispose()
    this.materials.forEach((material) => material.dispose())
    this.texture?.dispose()
    this.renderer.dispose()
  }
}
