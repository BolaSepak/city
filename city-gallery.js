/* city-gallery.js (v1): tombol "Upload Fotomu", pin foto di kota, kartu detail. Data: cityGallery (Firebase city).
   Publik hanya bisa membuat foto berstatus pending; yang tampil di kota hanya yang approved oleh admin. */
import {buildUploadForm,areaName} from './city-upload.js?v=1';
const MAXPIN=60,DAY=864e5,LIMIT=5;
export function createGallery({THREE:T,places,group,toast,focus}){
  const cfgFb=window.FTR_CITY_FIREBASE,cloud=window.FTR_CITY_CLOUDINARY;let fs=null,db=null,pins=[],items=[],root=null,upRoot=null;
  const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;};
  const dev=(()=>{try{let d=localStorage.getItem('ftr.city.dev');if(!d){d=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('ftr.city.dev',d);}return d;}catch{return 'x';}})();
  const sent=()=>{try{return JSON.parse(localStorage.getItem('ftr.city.up')||'[]').filter(t=>Date.now()-t<DAY);}catch{return [];}};
  const mark=()=>{try{localStorage.setItem('ftr.city.up',JSON.stringify([...sent(),Date.now()]));}catch{}};

  /* ---------- sheet bersama (gaya sama dengan city-progress) ---------- */
  function sheet(){const r=el('div','pg-root');r.hidden=true;r.innerHTML='<div class="pg-back"></div><section class="pg-sheet" role="dialog" aria-modal="true"><button class="pg-x" aria-label="Tutup">×</button><div class="pg-body"></div></section>';document.body.append(r);
    const close=()=>{r.hidden=true;};r.querySelector('.pg-back').onclick=r.querySelector('.pg-x').onclick=close;document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});r.close=close;r.body=r.querySelector('.pg-body');return r;}
  function openUpload(){
    if(!db){toast('Galeri belum aktif');return;}
    if(!upRoot)upRoot=sheet();const b=upRoot.body;b.innerHTML='';
    const h=el('div','pg-head');h.append(el('small','pg-tag','GALERI KOTA'),el('h2','pg-title','Upload Fotomu'));b.append(h);
    if(sent().length>=LIMIT){b.append(el('p','pg-empty','Batas '+LIMIT+' foto per hari tercapai. Coba lagi besok.'));upRoot.hidden=false;return;}
    b.append(el('p','pg-line','Foto muncul di kota setelah disetujui admin.'));
    b.append(buildUploadForm({cloud,precision:3,extra:places.filter(p=>p.x!==undefined).map(p=>({n:p.name,x:p.x,z:p.z})).map(p=>({name:p.n,n:p.n,x:p.x,z:p.z})),submitLabel:'Kirim foto',
      onSubmit:async d=>{await fs.addDoc(fs.collection(db,'cityGallery'),{url:d.url,thumb:d.thumb,ig:d.ig,caption:d.caption,cityX:d.cityX,cityZ:d.cityZ,cityArea:d.cityArea,lat:d.lat,lng:d.lng,placeName:d.placeName,status:'pending',device:dev,createdAt:fs.serverTimestamp()});mark();toast('Foto terkirim, menunggu persetujuan');}}));
    upRoot.hidden=false;}

  /* ---------- kartu detail ---------- */
  function openItem(it){
    if(!root)root=sheet();const b=root.body;b.innerHTML='';
    const im=new Image();im.src=it.url;im.alt=it.caption||'Foto kota';im.style.cssText='width:100%;max-height:52vh;object-fit:contain;border-radius:12px;background:#000;margin-bottom:10px';b.append(im);
    const h=el('div','pg-head');h.append(el('small','pg-tag',it.cityArea||'KOTA'),el('h2','pg-title',it.placeName||it.cityArea||'Foto'));b.append(h);
    if(it.ig){const a=el('a','pg-btn acid','@'+it.ig);a.href='https://instagram.com/'+encodeURIComponent(it.ig);a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:inline-block;text-decoration:none;margin-bottom:8px';b.append(a);}
    if(it.caption)b.append(el('p','pg-status',it.caption));
    if(it.lat!=null)b.append(el('p','pg-line','📍 '+(it.placeName||'')+' ('+it.lat+', '+it.lng+')'));
    root.hidden=false;}

  /* ---------- pin foto di dunia (lingkaran foto, terlihat menembus gedung) ---------- */
  const loader=new T.TextureLoader();loader.setCrossOrigin('anonymous');
  function pinTexture(url,cb){const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{const c=document.createElement('canvas');c.width=c.height=112;const x=c.getContext('2d');x.fillStyle='#fff';x.beginPath();x.arc(56,56,54,0,6.283);x.fill();x.save();x.beginPath();x.arc(56,56,47,0,6.283);x.clip();const k=Math.max(94/img.width,94/img.height);x.drawImage(img,56-img.width*k/2,56-img.height*k/2,img.width*k,img.height*k);x.restore();const t=new T.CanvasTexture(c);cb(t);};img.onerror=()=>{};img.src=url;}
  function render(){const g=group();if(!g)return;pins.forEach(p=>{p.parent&&p.parent.remove(p);p.material.map&&p.material.map.dispose();p.material.dispose();});pins=[];
    items.slice(0,MAXPIN).forEach(it=>{if(typeof it.cityX!=='number'||typeof it.cityZ!=='number')return;
      const sp=new T.Sprite(new T.SpriteMaterial({transparent:true,depthTest:false,opacity:0}));sp.renderOrder=15;sp.scale.set(1.7,1.7,1);sp.position.set(it.cityX,3.4,it.cityZ);sp.userData={galId:it.id};g.add(sp);pins.push(sp);
      pinTexture(it.thumb||it.url,t=>{sp.material.map=t;sp.material.opacity=1;sp.material.needsUpdate=true;});});}
  function hit(rc){if(!pins.length)return false;const h=rc.intersectObjects(pins,false);if(!h.length)return false;const it=items.find(x=>x.id===h[0].object.userData.galId);if(it)openItem(it);return true;}

  let RM=null;
  async function openMap(){if(!RM){const m=await import('./city-realmap.js?v=1');RM=m.createRealMap({getItems:()=>items,toast,onCity:it=>{focus&&focus(it.cityX,it.cityZ);openItem(it);}});}RM.open();}
  function ui(){const b=el('button','cg-fab','📷 Upload Fotomu');b.onclick=openUpload;const m=el('button','cg-fab rm','🗺️ Peta Nyata');m.onclick=openMap;document.body.append(b,m);}
  async function start(){
    if(!cfgFb||!cfgFb.projectId||!cloud)return false;
    const B='https://www.gstatic.com/firebasejs/12.13.0/';const [{initializeApp,getApps},f]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js')]);
    fs=f;db=f.getFirestore(getApps().find(a=>a.name==='cityPublic')||initializeApp(cfgFb,'cityPublic'));ui();
    f.onSnapshot(f.query(f.collection(db,'cityGallery'),f.where('status','==','approved'),f.limit(200)),
      s=>{const ms=v=>v&&v.toMillis?v.toMillis():0;items=s.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>ms(y.createdAt)-ms(x.createdAt));render();RM&&RM.refresh();},e=>console.warn('gallery',e.code||e.message));
    return true;}
  return {start,hit,openUpload,render};
}
