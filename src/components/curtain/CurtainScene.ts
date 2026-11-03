import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export type PleatShape = {
  /** Folds per panel. Fractional values are fine and let styles tween smoothly. */
  folds: number
  /** 0 = soft wave (onda), 1 = pinched pleat (prega americana). */
  pinch: number
  /** 0 = perfectly regular folds, 1 = loose, uneven gathering (franzido). */
  irregular: number
  /** Fold depth as a fraction of the panel width. */
  depth: number
}

export type CurtainOptions = {
  background: string
  fabric: string
  opacity: number
  shape: PleatShape
  /** Fraction of the view height the rod sits below the top edge. */
  rodInset: number
  /** Where the panels rest when open (0 = closed, 1 = fully gathered). */
  openAmount: number
  startOpen: boolean
  interactive: boolean
}

const SEGMENTS_X = 220
const SEGMENTS_Y = 90
const GATHERED = 0.13

// Shared by the shader and the CPU (rings must sit exactly where the fabric meets the rod).
const DRAPE_GLSL = /* glsl */ `
uniform float uOpenTop;
uniform float uOpenBot;
uniform float uWidth;
uniform float uHeight;
uniform float uX0;
uniform float uSide;
uniform float uFolds;
uniform float uPinch;
uniform float uIrregular;
uniform float uDepth;
uniform float uTime;
uniform float uSway;
uniform vec3 uMouse;
varying float vFold;

float foldWave(float u, float v, float folds) {
  float phase = u * folds * 6.2831853;
  phase += uIrregular * (0.9 * sin(u * 23.0 + 1.7) + 0.5 * sin(u * 51.0 + v * 2.3));
  float s = sin(phase);
  // Pinch pleats are tight at the heading and relax toward the hem.
  float k = mix(1.0, mix(0.38, 0.8, 1.0 - v), uPinch);
  return sign(s) * pow(abs(s), k);
}

vec3 drape(float u, float v, out float fold) {
  // The hem lags behind the heading while the curtain is being drawn.
  float o = mix(uOpenBot, uOpenTop, pow(v, 1.6));
  float span = uWidth * mix(1.0, ${GATHERED.toFixed(3)}, o);
  float x = u * span;

  // Fabric length is conserved: gathered, each fold rounds out to roughly length / (pi * folds).
  float depth = uDepth * uWidth / uFolds * (0.22 + 0.78 * o) * (0.92 + 0.22 * (1.0 - v));
  float w = foldWave(u, v, uFolds);
  float z = depth * w;
  fold = 0.5 + 0.5 * w;

  // Hem sway: free fabric near the bottom and the leading edge moves the most.
  float freeHang = pow(1.0 - v, 1.7);
  float lead = 0.35 + 0.65 * u;
  x += uSway * freeHang * lead * (0.6 * sin(uTime * 0.9 + u * 3.1) + 0.4 * sin(uTime * 1.7 + v * 4.0));
  z += uSway * 0.5 * freeHang * sin(uTime * 1.3 + u * 9.0 + v * 6.0);
  z += 0.004 * uWidth * freeHang * sin(uTime * 0.6 + v * 11.0 + u * 17.0);

  vec3 p = vec3(uSide * (uX0 + x), (v - 1.0) * uHeight, z);

  // Fingertip: the fabric yields away from the pointer.
  vec2 d = p.xy - uMouse.xy;
  p.z -= uMouse.z * exp(-dot(d, d) / (0.05 * uHeight * uHeight)) * (0.3 + 0.7 * (1.0 - v));
  return p;
}
`

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function weaveTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)
  // Warp and weft threads with slight irregularity, like a linen weave.
  for (let i = 0; i < size; i += 2) {
    const a = 0.1 + Math.random() * 0.12
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.fillRect(i, 0, 1, size)
    ctx.fillStyle = `rgba(0,0,0,${a * 0.9})`
    ctx.fillRect(0, i, size, 1)
  }
  for (let n = 0; n < 900; n++) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},0,0.05)`
    ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 6, 1)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  return tex
}

type Tween = { from: number; to: number; start: number; duration: number }

export class CurtainScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
  private timer = new THREE.Timer()
  private panels: THREE.Mesh[] = []
  private material: THREE.MeshPhysicalMaterial
  private uniforms: Record<string, THREE.IUniform>
  private rings: THREE.InstancedMesh
  private rod: THREE.Group
  private backdrop: THREE.Mesh
  private backdropAspect = 1.5
  private view = { w: 1, h: 1 }
  private raf = 0
  private visible = true
  private observer: IntersectionObserver
  private resizeObserver: ResizeObserver

  private openTop = 0
  private openBot = 0
  private openTween: Tween | null = null
  private sway = 0
  private shape: PleatShape
  private shapeFrom: PleatShape
  private shapeTo: PleatShape
  private shapeStart = -1
  private colorTo = new THREE.Color()
  private opacityTo: number
  private mouseTarget = new THREE.Vector3(0, 0, 0)
  private pointer = new THREE.Vector2(0, 0)
  private onOpened?: () => void

  constructor(
    private canvas: HTMLCanvasElement,
    private options: CurtainOptions,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.95
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.42
    pmrem.dispose()
    this.scene.background = new THREE.Color('#2a1e17')

    // Low window light from the side rakes across the folds, so each one reads in relief.
    const key = new THREE.DirectionalLight('#fff1dc', 3.2)
    key.position.set(-6, 2.5, 1.6)
    this.scene.add(key)
    const fill = new THREE.DirectionalLight('#e6ecf3', 0.3)
    fill.position.set(5, 0, 2)
    this.scene.add(fill)

    this.shape = { ...options.shape }
    this.shapeFrom = { ...options.shape }
    this.shapeTo = { ...options.shape }
    this.opacityTo = options.opacity
    this.colorTo.set(options.fabric)

    this.backdrop = this.createBackdrop(options.background)
    this.scene.add(this.backdrop)

    const weave = weaveTexture()
    weave.repeat.set(26, 34)
    this.material = new THREE.MeshPhysicalMaterial({
      color: options.fabric,
      roughness: 0.82,
      sheen: 0.7,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color(options.fabric).lerp(new THREE.Color('#ffffff'), 0.3),
      bumpMap: weave,
      bumpScale: 0.9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: options.opacity,
    })

    this.uniforms = {
      uOpenTop: { value: 0 },
      uOpenBot: { value: 0 },
      uWidth: { value: 1 },
      uHeight: { value: 1 },
      uX0: { value: 0 },
      uSide: { value: 1 },
      uFolds: { value: this.shape.folds },
      uPinch: { value: this.shape.pinch },
      uIrregular: { value: this.shape.irregular },
      uDepth: { value: this.shape.depth },
      uTime: { value: 0 },
      uSway: { value: 0 },
      uMouse: { value: new THREE.Vector3() },
    }

    for (const side of [1, -1]) {
      const geometry = new THREE.PlaneGeometry(1, 1, SEGMENTS_X, SEGMENTS_Y)
      const mesh = new THREE.Mesh(geometry, this.panelMaterial(side))
      mesh.frustumCulled = false
      this.panels.push(mesh)
      this.scene.add(mesh)
    }

    const bronze = new THREE.MeshStandardMaterial({ color: '#5a4030', metalness: 0.85, roughness: 0.32 })
    this.rod = new THREE.Group()
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 24), bronze)
    bar.rotation.z = Math.PI / 2
    bar.name = 'bar'
    this.rod.add(bar)
    for (const s of [-1, 1]) {
      const finial = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), bronze)
      finial.name = `finial${s}`
      this.rod.add(finial)
    }
    this.scene.add(this.rod)

    this.rings = new THREE.InstancedMesh(new THREE.TorusGeometry(1, 0.16, 10, 28), bronze, 2 * 40)
    this.rings.frustumCulled = false
    this.scene.add(this.rings)

    if (options.startOpen) {
      this.openTop = this.openBot = options.openAmount
    }

    this.resize()
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(canvas)
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      if (this.visible && !this.raf) this.loop()
    })
    this.observer.observe(canvas)

    if (options.interactive) {
      canvas.addEventListener('pointermove', this.handlePointer)
      canvas.addEventListener('pointerleave', this.handleLeave)
    }
    this.loop()
  }

  private panelMaterial(side: number) {
    // Each panel shares the physical material settings but owns its side uniform.
    const material = this.material.clone()
    const own = { ...this.uniforms, uSide: { value: side } }
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, own)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${DRAPE_GLSL}`)
        .replace(
          '#include <beginnormal_vertex>',
          /* glsl */ `
          vec2 cuv = position.xy + 0.5;
          float fold;
          float f2;
          vec3 dp = drape(cuv.x, cuv.y, fold);
          vec3 du = drape(cuv.x + 0.0012, cuv.y, f2) - dp;
          vec3 dv = drape(cuv.x, cuv.y + 0.0012, f2) - dp;
          // DoubleSide flips the mirrored panel's normal back toward the camera.
          vec3 objectNormal = normalize(cross(du, dv));
          vFold = fold;
          `,
        )
        .replace('#include <begin_vertex>', 'vec3 transformed = dp;')
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vFold;')
        .replace(
          '#include <color_fragment>',
          // Valleys of each fold receive less light: cheap, convincing occlusion.
          '#include <color_fragment>\n diffuseColor.rgb *= mix(0.34, 1.08, smoothstep(0.0, 1.0, vFold));',
        )
    }
    return material
  }

  private createBackdrop(url: string) {
    const material = new THREE.MeshBasicMaterial({ color: '#2a1e17', toneMapped: false })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
    mesh.position.z = -1.6
    new THREE.TextureLoader().setCrossOrigin('anonymous').load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      material.map = tex
      material.color.set('#ffffff')
      material.needsUpdate = true
      this.backdropAspect = tex.image.width / tex.image.height
      this.layout()
    })
    return mesh
  }

  private handlePointer = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect()
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -(((e.clientY - rect.top) / rect.height) * 2 - 1))
    this.mouseTarget.set((this.pointer.x * this.view.w) / 2, (this.pointer.y * this.view.h) / 2, 0.05 * this.view.w)
  }

  private handleLeave = () => {
    this.mouseTarget.z = 0
    this.pointer.set(0, 0)
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.canvas
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.position.set(0, 0, 5)
    this.camera.updateProjectionMatrix()
    this.view.h = 2 * 5 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))
    this.view.w = this.view.h * this.camera.aspect
    this.layout()
  }

  private layout() {
    const { w, h } = this.view
    const rodY = h / 2 - this.options.rodInset * h
    const panelWidth = (w / 2) * 1.04
    this.uniforms.uWidth.value = panelWidth
    this.uniforms.uHeight.value = h * 1.12
    this.uniforms.uX0.value = -w / 2 - w * 0.015

    for (const panel of this.panels) panel.position.y = rodY

    const radius = h * 0.0075
    const bar = this.rod.getObjectByName('bar')!
    bar.scale.set(radius, w * 1.02, radius)
    for (const s of [-1, 1]) {
      const finial = this.rod.getObjectByName(`finial${s}`)!
      finial.scale.setScalar(radius * 2.1)
      finial.position.x = (s * w * 1.02) / 2
    }
    this.rod.position.set(0, rodY + radius * 1.4, 0.02)

    // Cover-fit the backdrop at its depth, with headroom for parallax.
    const depthScale = (5 + 1.6) / 5
    const bw = w * depthScale * 1.08
    const bh = h * depthScale * 1.08
    const cover = Math.max(bw / this.backdropAspect, bh)
    this.backdrop.scale.set(cover * this.backdropAspect, cover, 1)
  }

  /** CPU mirror of the shader's heading position (v = 1), used to place the rings. */
  private headingPoint(u: number, side: number) {
    const s = this.shape
    const o = this.openTop
    const span = this.uniforms.uWidth.value * (1 + (GATHERED - 1) * o)
    let phase = u * s.folds * Math.PI * 2
    phase += s.irregular * (0.9 * Math.sin(u * 23 + 1.7) + 0.5 * Math.sin(u * 51 + 2.3))
    const sn = Math.sin(phase)
    const k = 1 + (0.38 - 1) * s.pinch
    const depth = ((s.depth * this.uniforms.uWidth.value) / s.folds) * (0.22 + 0.78 * o) * 0.92
    return {
      x: side * (this.uniforms.uX0.value + u * span),
      z: depth * Math.sign(sn) * Math.pow(Math.abs(sn), k),
    }
  }

  private updateRings() {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const scale = new THREE.Vector3().setScalar(this.view.h * 0.0085)
    const y = this.rod.position.y
    let i = 0
    const count = Math.min(40, Math.round(this.shape.folds * 2))
    for (const side of [1, -1]) {
      for (let r = 0; r <= count; r++) {
        if (i >= 80) break
        const p = this.headingPoint(r / count, side)
        m.compose(new THREE.Vector3(p.x, y, p.z * 0.4 + 0.02), q, scale)
        this.rings.setMatrixAt(i++, m)
      }
    }
    this.rings.count = i
    this.rings.instanceMatrix.needsUpdate = true
  }

  private loop = () => {
    if (!this.visible) {
      this.raf = 0
      return
    }
    this.raf = requestAnimationFrame(this.loop)
    this.timer.update()
    const dt = Math.min(this.timer.getDelta(), 1 / 20)
    const t = this.timer.getElapsed()

    const prev = this.openTop
    if (this.openTween) {
      const p = Math.min(1, (t - this.openTween.start) / this.openTween.duration)
      this.openTop = this.openTween.from + (this.openTween.to - this.openTween.from) * ease(p)
      if (p >= 1) {
        this.openTween = null
        this.onOpened?.()
        this.onOpened = undefined
      }
    }
    // Hem follows the heading with a soft lag; the velocity feeds the sway.
    this.openBot += (this.openTop - this.openBot) * (1 - Math.exp(-dt / 0.32))
    const velocity = Math.abs(this.openTop - prev) / Math.max(dt, 1e-3)
    this.sway += (Math.min(velocity * 0.05, 0.06) * this.view.w - this.sway) * (1 - Math.exp(-dt / 0.6))
    const idleSway = 0.006 * this.view.w

    if (this.shapeStart >= 0) {
      const p = ease(Math.min(1, (t - this.shapeStart) / 1.1))
      for (const key of ['folds', 'pinch', 'irregular', 'depth'] as const) {
        this.shape[key] = this.shapeFrom[key] + (this.shapeTo[key] - this.shapeFrom[key]) * p
      }
      if (p >= 1) this.shapeStart = -1
    }

    const mouse = this.uniforms.uMouse.value as THREE.Vector3
    mouse.lerp(this.mouseTarget, 1 - Math.exp(-dt / 0.18))

    const u = this.uniforms
    u.uOpenTop.value = this.openTop
    u.uOpenBot.value = this.openBot
    u.uTime.value = t
    u.uSway.value = idleSway + this.sway
    u.uFolds.value = this.shape.folds
    u.uPinch.value = this.shape.pinch
    u.uIrregular.value = this.shape.irregular
    u.uDepth.value = this.shape.depth

    const k = 1 - Math.exp(-dt / 0.25)
    for (const panel of this.panels) {
      const mat = panel.material as THREE.MeshPhysicalMaterial
      mat.color.lerp(this.colorTo, k)
      mat.sheenColor.copy(mat.color).lerp(new THREE.Color('#ffffff'), 0.3)
      mat.opacity += (this.opacityTo - mat.opacity) * k
      mat.depthWrite = mat.opacity > 0.98
    }

    // Gentle parallax: the room behind shifts against the curtain.
    this.camera.position.x += (this.pointer.x * 0.08 - this.camera.position.x) * k
    this.camera.position.y += (this.pointer.y * 0.05 - this.camera.position.y) * k
    this.camera.lookAt(0, 0, 0)

    this.updateRings()
    this.renderer.render(this.scene, this.camera)
  }

  open(to: number, duration = 2.4, onDone?: () => void) {
    this.openTween = { from: this.openTop, to, start: this.timer.getElapsed(), duration }
    this.onOpened = onDone
  }

  setFabric(color: string) {
    this.colorTo.set(color)
  }

  setOpacity(opacity: number) {
    this.opacityTo = opacity
  }

  setShape(shape: PleatShape) {
    this.shapeFrom = { ...this.shape }
    this.shapeTo = { ...shape }
    this.shapeStart = this.timer.getElapsed()
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.visible = false
    this.observer.disconnect()
    this.resizeObserver.disconnect()
    this.canvas.removeEventListener('pointermove', this.handlePointer)
    this.canvas.removeEventListener('pointerleave', this.handleLeave)
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => m.dispose())
      }
    })
    this.renderer.dispose()
  }
}
