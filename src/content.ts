// Local Quennie media where available; Unsplash remains for illustrative simulations.
export const img = (id: string, w = 1600) =>
  id.startsWith('/') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const WHATSAPP_NUMBER = '245956191086'
export const WHATSAPP_DISPLAY = '+245 956 191 086'

export const whatsappLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const social = {
  instagram: 'https://www.instagram.com/quennieinteriordesign/',
  tiktok: 'https://www.tiktok.com/@quennieinteriordesign',
}

export const heroImage = '1618221195710-dd6b41faaea6'

export const services = [
  {
    name: 'Design de interiores',
    text: 'Conceito, plantas e projeto 3D antes de qualquer obra começar.',
    image: '/media/7673552471175875858-01.webp',
  },
  {
    name: 'Mobiliário à medida',
    text: 'Roupeiros, móveis de TV, cabeceiras e peças únicas, produzidos na nossa fábrica.',
    image: '/media/7673540222692379911-02.webp',
  },
  {
    name: 'Cortinados & estores',
    text: 'Confeção à medida, escolha de tecidos e montagem no local.',
    image: '/media/7673555504592948487-frame.webp',
  },
  {
    name: 'Remodelações',
    text: 'Coordenação de obra completa, da demolição à última peça de decoração.',
    image: '/media/7673552471175875858-02.webp',
  },
]

export const process = [
  {
    title: 'Projeto em 3D',
    text: 'Antes da obra começar, o espaço já ganha vida em 3D. Vê cada material e cada peça no lugar certo.',
  },
  {
    title: 'Produção na fábrica',
    text: 'Mobiliário, cortinados e estores são feitos por nós, à medida exata do seu espaço.',
  },
  {
    title: 'Montagem e entrega',
    text: 'A nossa equipa monta tudo no local. Só sai quando o espaço está pronto a ser vivido.',
  },
]

export const fabrics = [
  { name: 'Linho natural', color: '#e9e0d2' },
  { name: 'Areia', color: '#d8c7ad' },
  { name: 'Taupe', color: '#a89683' },
  { name: 'Cognac', color: '#9a5934' },
  { name: 'Oliva', color: '#6b7058' },
  { name: 'Grafite', color: '#4a4643' },
]

// Fold parameters for the 3D curtain; see PleatShape in components/curtain/CurtainScene.ts.
export const pleatStyles = [
  { name: 'Onda', shape: { folds: 9, pinch: 0, irregular: 0.12, depth: 0.34 } },
  { name: 'Prega americana', shape: { folds: 7, pinch: 1, irregular: 0.08, depth: 0.36 } },
  { name: 'Franzido', shape: { folds: 17, pinch: 0.25, irregular: 0.75, depth: 0.3 } },
]

export const opacities = [
  { name: 'Voile', value: 0.55 },
  { name: 'Semi-opaco', value: 0.8 },
  { name: 'Blackout', value: 1 },
]

// Real Quennie TikTok posts; covers are placeholders until originals are delivered.
export const reels = [
  {
    title: 'Cortinados à medida',
    caption: 'Cortinados produzidos pela Quennie para um escritório.',
    href: 'https://www.tiktok.com/@quennieinteriordesign/video/7673555504592948487',
    cover: '1513694203232-719a280e022f',
  },
  {
    title: 'Do 3D à realidade',
    caption: 'Antes da obra começar, o projeto já ganha vida em 3D.',
    href: 'https://www.tiktok.com/@quennieinteriordesign/photo/7673552471175875858',
    cover: '1600121848594-d8644e57abab',
  },
  {
    title: 'Cinco halls de entrada',
    caption: 'Inspirações para transformar a entrada da sua casa.',
    href: 'https://www.tiktok.com/@quennieinteriordesign/photo/7673556834803846407',
    cover: '1615529182904-14819c35db37',
  },
  {
    title: 'Um quarto que acalma',
    caption: 'Desenhado para transmitir calma, equilíbrio e conforto.',
    href: 'https://www.tiktok.com/@quennieinteriordesign/video/7652338046658039061',
    cover: '1505693416388-ac5ce068fe85',
  },
  {
    title: 'Móveis de TV',
    caption: 'O móvel de TV também dita o estilo da sala.',
    href: 'https://www.tiktok.com/@quennieinteriordesign/photo/7673540222692379911',
    cover: '1586023492125-27b2c045efd7',
  },
  {
    title: 'O estore, da montagem ao fim',
    caption: 'Um estore à medida, pensado para controlar a luz.',
    href: 'https://www.tiktok.com/@quennieinteriordesign/video/7663446869720222996',
    cover: '1522708323590-d24dbb6b0267',
  },
  {
    title: 'Mobiliário exterior',
    caption: 'O exterior merece a mesma atenção que o interior.',
    href: 'https://www.tiktok.com/@quennieinteriordesign/photo/7659460783184547092',
    cover: '1600585154526-990dced4db0d',
  },
  {
    title: 'Open House',
    caption: 'A Quennie presente no Open House.',
    href: 'https://www.tiktok.com/@quennieinteriordesign/video/7657515765771373845',
    cover: '1615874959474-d609969a20ed',
  },
]

export const locations = [
  {
    country: 'Guiné-Bissau',
    detail: 'Base principal da Quennie, com equipa de obra e montagem.',
  },
  {
    country: 'Portugal',
    detail: 'Projetos de interiores, mobiliário e cortinados.',
  },
  {
    country: 'Senegal e outros países',
    detail: 'Projetos sob consulta, com deslocação da equipa.',
  },
]
