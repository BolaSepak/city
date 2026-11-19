/* city-gallery.js (v2): Upload Fotomu, pin foto di ATAS BANGUNAN yang dipilih, kartu detail. Data: cityGallery (Firebase city).
   Publik hanya bisa membuat foto berstatus pending; yang tampil di kota hanya yang approved oleh admin. */
import {buildUploadForm,loadCityMap} from './city-upload.js?v=5';
const MAXPIN=80,PERB=3,DAY=864e5,LIMIT=5;
export function createGallery({THREE:T,places,group,toast,focus}){
  const mkTex=c=>{const t=new T.CanvasTexture(c);if(T.SRGBColorSpace)t.colorSpace=T.SRGBColorSpace;return t;};

  const cfgFb=window.FTR_CITY_FIREBASE,cloud=window.FTR_CITY_CLOUDINARY;let fs=null,db=null,pins=[],items=[],root=null,upRoot=null,RM=null;
  const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;};
  const dev=(()=>{try{let d=localStorage.getItem('ftr.city.dev');if(!d){d=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('ftr.city.dev',d);}return d;}catch{return 'x';}})();
  const sent=()=>{try{return JSON.parse(localStorage.getItem('ftr.city.up')||'[]').filter(t=>Date.now()-t<DAY);}catch{return [];}};
  const mark=()=>{try{localStorage.setItem('ftr.city.up',JSON.stringify([...sent(),Date.now()]));}catch{}};
  const ms=v=>v&&v.toMillis?v.toMillis():0,dtxt=v=>{const t=ms(v);return t?new Date(t).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):'';};

  function sheet(){const r=el('div','pg-root');r.hidden=true;r.innerHTML='<div class="pg-back"></div><section class="pg-sheet" role="dialog" aria-modal="true"><button class="pg-x" aria-label="Tutup">×</button><div class="pg-body"></div></section>';document.body.append(r);
    const close=()=>{r.hidden=true;};r.querySelector('.pg-back').onclick=r.querySelector('.pg-x').onclick=close;document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});r.close=close;r.body=r.querySelector('.pg-body');return r;}
  const head=(tag,title)=>{const h=el('div','pg-head');h.append(el('small','pg-tag',tag),el('h2','pg-title',title));return h;};

  /* ---------- upload ---------- */
  function openUpload(){
    if(!db){toast('Galeri belum aktif');return;}
    if(!upRoot)upRoot=sheet();const b=upRoot.body;b.innerHTML='';b.append(head('GALERI KOTA','Upload Fotomu'));
    if(sent().length>=LIMIT){b.append(el('p','pg-empty','Batas '+LIMIT+' foto per hari tercapai. Coba lagi besok.'));upRoot.hidden=false;return;}
    b.append(el('p','pg-line','Foto muncul di titik pilihanmu (di atas bangunan, atau bebas di jalan/taman) setelah disetujui admin.'));
    b.append(buildUploadForm({cloud,precision:3,submitLabel:'Kirim foto',
      getMap:()=>loadCityMap({base:'',live:window.FTRCityMap&&window.FTRCityMap.snapshot}),
      onSubmit:async d=>{await fs.addDoc(fs.collection(db,'cityGallery'),{url:d.url,thumb:d.thumb,ig:d.ig,caption:d.caption,place:d.place,cityX:d.cityX,cityZ:d.cityZ,cityY:d.cityY,cityArea:d.cityArea,lat:d.lat,lng:d.lng,placeName:d.placeName,status:'pending',device:dev,createdAt:fs.serverTimestamp()});mark();toast('Foto terkirim, menunggu persetujuan');}}));
    upRoot.hidden=false;}

  /* ---------- kartu detail + daftar foto per bangunan ---------- */
  function openItem(it){
    if(!root)root=sheet();const b=root.body;b.innerHTML='';
    const im=new Image();im.src=it.url;im.alt=it.caption||'Foto kota';im.className='pg-photo';b.append(im);
    b.append(head(it.cityArea||'KOTA',it.placeName||it.cityArea||'Foto'));
    if(it.ig){const a=el('a','pg-btn ink','@'+it.ig);a.href='https://instagram.com/'+encodeURIComponent(it.ig);a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:inline-block;text-decoration:none;margin-bottom:8px';b.append(a);}
    if(it.caption)b.append(el('p','pg-status',it.caption));
    if(it.lat!=null)b.append(el('p','pg-line','📍 '+(it.placeName||'')+' ('+it.lat+', '+it.lng+')'));const d=dtxt(it.createdAt);if(d)b.append(el('p','pg-line',d));
    root.hidden=false;}
  function openBuilding(key){
    if(!root)root=sheet();const list=items.filter(i=>keyOf(i)===key),b=root.body;b.innerHTML='';b.append(head('GALERI',(list[0]&&list[0].cityArea)||'Foto'));
    const g=el('div','pg-grid');list.forEach(i=>{const c=el('button','pg-cell');const w=el('div','pg-thumb'),im=new Image();im.src=i.thumb||i.url;im.loading='lazy';im.alt='';w.append(im);c.append(w,el('span','',i.ig?'@'+i.ig:''));c.onclick=()=>openItem(i);g.append(c);});b.append(g);root.hidden=false;}

  /* ---------- pin foto di atas bangunan ---------- */
  const keyOf=i=>i.place||('xz:'+Math.round(i.cityX)+':'+Math.round(i.cityZ));
  function pinCanvas(img,badge){const c=document.createElement('canvas');c.width=128;c.height=150;const x=c.getContext('2d'),rr=(a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h);};
    x.fillStyle='#111';rr(3,3,122,122,26);x.fill();x.fillStyle='#ffd51e';rr(8,8,112,112,22);x.fill();x.fillStyle='#111';x.beginPath();x.moveTo(50,123);x.lineTo(64,146);x.lineTo(78,123);x.fill();x.fillStyle='#ffd51e';x.beginPath();x.moveTo(54,121);x.lineTo(64,138);x.lineTo(74,121);x.fill();
    x.save();rr(14,14,100,100,16);x.clip();if(badge!==undefined){x.fillStyle='#fff';x.fillRect(14,14,100,100);x.fillStyle='#111';x.font='900 44px Inter,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('+'+badge,64,66);}
    else if(img){const k=Math.max(100/img.width,100/img.height);x.drawImage(img,64-img.width*k/2,64-img.height*k/2,img.width*k,img.height*k);}else{x.fillStyle='#ddd';x.fillRect(14,14,100,100);}x.restore();return c;}
  function spriteFor(it,badge){const m=new T.SpriteMaterial({map:mkTex(pinCanvas(null,badge)),transparent:true,depthTest:false,toneMapped:false,fog:false});
    if(badge===undefined){const im=new Image();im.crossOrigin='anonymous';im.onload=()=>{try{m.map=mkTex(pinCanvas(im));m.needsUpdate=true;}catch{}};im.src=it.thumb||it.url;}return m;}
  function bbox(){const m={};try{(window.FTRCityMap?window.FTRCityMap.getBoxes():[]).forEach(b=>{m[b.id]=b;});}catch{}return m;}
  function render(){const g=group();if(!g)return;pins.forEach(p=>{p.parent&&p.parent.remove(p);p.material.map&&p.material.map.dispose();p.material.dispose();});pins=[];
    const bx=bbox(),by={};items.slice(0,MAXPIN).forEach(i=>{if(typeof i.cityX!=='number'||typeof i.cityZ!=='number')return;(by[keyOf(i)]=by[keyOf(i)]||[]).push(i);});
    Object.entries(by).forEach(([k,list])=>{const b=list[0].place&&bx[list[0].place],cx=b?b.cx:list[0].cityX,cz=b?b.cz:list[0].cityZ,y=b?b.top+5.6:(list[0].place?(list[0].cityY||6)+5.6:3.4);
      const shown=list.length>PERB?PERB-1:list.length,total=shown+(list.length>shown?1:0);
      for(let i=0;i<total;i++){const extra=i>=shown,off=(i-(total-1)/2)*1.7,sp=new T.Sprite(spriteFor(list[i],extra?list.length-shown:undefined));
        sp.renderOrder=15;sp.scale.set(1.5,1.76,1);sp.center.set(.5,0);sp.position.set(cx+off*.7071,y,cz-off*.7071);sp.userData=extra?{galKey:k}:{galId:list[i].id,galKey:k};g.add(sp);pins.push(sp);}});}
  function hit(rc){if(!pins.length)return false;const h=rc.intersectObjects(pins,false);if(!h.length)return false;const u=h[0].object.userData,it=u.galId&&items.find(x=>x.id===u.galId);if(it)openItem(it);else openBuilding(u.galKey);return true;}

  async function openMap(){if(!RM){const m=await import('./city-realmap.js?v=3');RM=m.createRealMap({getItems:()=>items,toast,onCity:it=>{const b=it.place&&bbox()[it.place];focus&&focus(b?b.cx:it.cityX,b?b.cz:it.cityZ);openItem(it);}});}RM.open();}
  function bind(){const u=document.querySelector('[data-act=upload]'),m=document.querySelector('[data-act=realmap]');if(u){u.hidden=false;u.onclick=openUpload;}if(m){m.hidden=false;m.onclick=openMap;}}
  async function start(){
    if(!cfgFb||!cfgFb.projectId||!cloud)return false;
    const B='https://www.gstatic.com/firebasejs/12.13.0/';const [{initializeApp,getApps},f]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js')]);
    fs=f;db=f.getFirestore(getApps().find(a=>a.name==='cityPublic')||initializeApp(cfgFb,'cityPublic'));bind();
    f.onSnapshot(f.query(f.collection(db,'cityGallery'),f.where('status','==','approved'),f.limit(200)),
      s=>{items=s.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>ms(y.createdAt)-ms(x.createdAt));render();RM&&RM.refresh();},e=>console.warn('gallery',e.code||e.message));
    return true;}
  return {start,hit,openUpload,render};
}
