import concurrent.futures, json, subprocess, imageio_ffmpeg
from pathlib import Path
from yt_dlp import YoutubeDL
from PIL import Image
root=Path(__file__).resolve().parents[1]
media=root/'public/media'; media.mkdir(exist_ok=True)
posts=[('7673555504592948487','video','Cortinados à medida','Cortinados & estores'),('7673552471175875858','photo','Do 3D à realidade','Interiores'),('7673556834803846407','photo','Cinco halls de entrada','Interiores'),('7652338046658039061','video','Um quarto que acalma','Interiores'),('7673540222692379911','photo','Móveis de TV','Mobiliário'),('7663446869720222996','video','O estore, da montagem ao fim','Cortinados & estores'),('7659460783184547092','photo','Mobiliário exterior','Mobiliário'),('7657515765771373845','video','Open House','Interiores')]
def fetch(post):
 id,kind,title,category=post
 if kind == 'photo': return None
 url=f'https://www.tiktok.com/@quennieinteriordesign/{kind}/{id}'
 options={'quiet':True,'no_warnings':True,'socket_timeout':15,'retries':1,'format':'best[ext=mp4]/best','outtmpl':str(media/(id+'.%(ext)s')),'writethumbnail':True,'noplaylist':True}
 try:
  with YoutubeDL(options) as ydl:
   info=ydl.extract_info(url,download=True)
  files=list(media.glob(id+'.*'))
  image=next((x for x in files if x.suffix not in ('.mp4','.part','.ytdl')),None)
  cover=None
  if image:
   im=Image.open(image); im.convert('RGB').save(media/(id+'.webp'),'WEBP',quality=88); cover=f'/media/{id}.webp'
  video=media/(id+'.mp4')
  result={'id':id,'title':title,'category':category,'href':url,'caption':info.get('description',''),'cover':cover,'video':f'/media/{id}.mp4' if video.exists() else None,'duration':info.get('duration')}
  print(f'OK {id}: video={video.exists()}, cover={bool(cover)}',flush=True)
  return result
 except Exception as e:
  print(f'FAILED {id}: {str(e)[:160]}',flush=True)
  return None
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 results=[r for r in pool.map(fetch,posts) if r]
# Album posts use gallery-dl; only the optimized, stable paths enter the site manifest.
raw=root/'.media-source';raw.mkdir(exist_ok=True)
for id,kind,title,category in posts:
 if kind!='photo': continue
 sources=sorted(raw.glob(id+'*.jpg'))
 if not sources:
  subprocess.run(['python','-m','gallery_dl','-R','1','-o','timeout=15','-D',str(raw),'-f','{id}_{num:02}.{extension}',f'https://www.tiktok.com/@quennieinteriordesign/photo/{id}'],check=False)
  sources=sorted(raw.glob(id+'*.jpg'))
 images=[]
 for index,source in enumerate(sources):
  target=media/f'{id}-{index+1:02}.webp';im=Image.open(source);im.thumbnail((1600,1600));im.save(target,quality=88);images.append('/media/'+target.name)
 if images:results.append({'id':id,'title':title,'category':category,'href':f'https://www.tiktok.com/@quennieinteriordesign/photo/{id}','caption':title+'.','cover':images[0],'images':images,'video':None,'duration':None})
for result in results:
 if result['video']:
  output=media/(result['id']+'-frame.webp')
  subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-loglevel','error','-y','-ss','3','-i',str(root/'public'/result['video'].lstrip('/')),'-frames:v','1',str(output)],check=True)
  result['cover']='/media/'+output.name
 result.setdefault('images',[result['cover']])
 result['caption']=result['caption'].split('#')[0].strip()
(root/'src/quennie-media.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
print(f'COMPLETE: {len(results)} posts',flush=True)
