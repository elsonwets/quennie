export type Colour = { name: string; color: string; family: string }
export const colourFamilies = ['Neutros', 'Terra', 'Verdes', 'Azuis', 'Rosas', 'Sol & especiarias', 'Violetas', 'Escuros']
const groups: [string, string][][] = [
 [['Branco giz','#f8f5ed'],['Marfim','#efe8d7'],['Linho natural','#e9e0d2'],['Aveia','#d8cbb5'],['Areia','#cbb99b'],['Taupe','#a89683'],['Cinza pérola','#c9c9c5'],['Pedra','#96938a']],
 [['Champanhe','#dec6a4'],['Camel','#bd9166'],['Caramelo','#a46e41'],['Cognac','#9a5934'],['Terracota','#bc7058'],['Argila','#c6917d'],['Canela','#88533d'],['Chocolate','#54392e']],
 [['Água de coco','#d8dfc2'],['Sálvia','#a6b69b'],['Eucalipto','#819b8d'],['Oliva','#747b4d'],['Musgo','#556646'],['Floresta','#314f42'],['Verde água','#9fc4b5'],['Esmeralda','#286c59']],
 [['Névoa','#d2dfe4'],['Azul céu','#a5c5d7'],['Sereno','#8aafc5'],['Azul pó','#7c99ac'],['Petróleo','#345c68'],['Oceano','#326b89'],['Índigo','#3f4f7a'],['Marinho','#26384f']],
 [['Pétala','#f0d6d2'],['Rosa chá','#d9b0a8'],['Blush','#d49b9a'],['Rosa antigo','#b68085'],['Malva','#a47b8a'],['Framboesa','#a94d6d'],['Coral','#d98274'],['Bordô','#71374a']],
 [['Baunilha','#efe0ac'],['Manteiga','#e4ce8d'],['Mel','#c8a05a'],['Mostarda','#b5933e'],['Ocre','#b1813a'],['Açafrão','#d09c45'],['Pêssego','#e5b294'],['Cobre','#b77b51']],
 [['Lavanda','#d1c5df'],['Lilás','#b6a3c7'],['Glicínia','#9d88b2'],['Ametista','#8b6a9e'],['Orquídea','#ae7c9d'],['Ameixa','#68475f'],['Beringela','#4d354a'],['Violeta','#6b5788']],
 [['Prata','#a7aaa9'],['Cinza fumo','#7b807f'],['Ardósia','#5b6568'],['Grafite','#4a4643'],['Carvão','#343638'],['Preto suave','#242728'],['Noz','#635044'],['Café','#392e29']],
]
export const curtainColours: Colour[] = groups.flatMap((group,index) => group.map(([name,color]) => ({name,color,family:colourFamilies[index]})))
export type CurtainChoice = { product: 'Cortinado' | 'Estore'; colour: Colour; pleat: string; opacity: string; favourites: Colour[] }
export const defaultCurtainChoice: CurtainChoice = { product: 'Cortinado', colour: curtainColours[2], pleat: 'Onda', opacity: 'Semi-opaco', favourites: [] }
export function parseCurtainChoice(raw?: string): CurtainChoice {
 try {
  const data = JSON.parse(raw || '{}')
  const valid = (c: unknown): c is Colour => !!c && typeof c === 'object' && typeof (c as Colour).name === 'string' && (c as Colour).name.length < 60 && /^#[0-9a-f]{6}$/i.test((c as Colour).color)
  return { product: data.product === 'Estore' ? 'Estore' : 'Cortinado', colour: valid(data.colour) ? data.colour : defaultCurtainChoice.colour, pleat: ['Onda','Prega americana','Franzido'].includes(data.pleat) ? data.pleat : 'Onda', opacity: ['Voile','Semi-opaco','Blackout'].includes(data.opacity) ? data.opacity : 'Semi-opaco', favourites: Array.isArray(data.favourites) ? data.favourites.filter(valid).slice(0,5) : [] }
 } catch { return defaultCurtainChoice }
}
export function describeCurtainChoice(choice: CurtainChoice) {
 return [choice.product, `Cor: ${choice.colour.name} (${choice.colour.color})`, choice.product === 'Cortinado' && `Prega: ${choice.pleat}`, `Luz: ${choice.opacity}`, choice.favourites.length > 0 && `Outras cores que gostei: ${choice.favourites.map(c => `${c.name} (${c.color})`).join(', ')}`].filter(Boolean).join(' · ')
}
