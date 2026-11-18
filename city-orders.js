/* city-orders.js (v1): Cek Resi (Kantor J&T) dan Cek Pesanan (Office) — pencarian SAMA dengan web utama / game:
   ID order, email, atau no. HP. Memakai modul https://fucktherules.my.id/firebase.js (cariResi / cariLacak / getTimeline).
   Data yang tampil sudah tersamar oleh web utama (nama/email/HP dimask). Resi hanya muncul setelah pemilik pesanan mencarinya. */
const L=window.FTR_CITY_LINKS||{};let FB=null;
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;};
const ms=v=>v&&v.toMillis?v.toMillis():v&&v.seconds?v.seconds*1000:v?new Date(v).getTime()||0:0;
const classify=v=>{v=String(v||'').trim();if(v.includes('@'))return {email:v};if(/[A-Za-z]/.test(v)&&v.includes('-'))return {kode:v};if(/^[\d+\s().-]{6,}$/.test(v))return {hp:v};return {kode:v};};
const PAY={pending:'Pending',dp:'DP',lunas:'Lunas',ditolak:'Ditolak'};
const dt=v=>{const t=ms(v);if(!t)return '';const d=new Date(t);return d.toLocaleDateString('id-ID',{day:'numeric',month:'short'})+' · '+d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});};
async function fb(){if(FB)return FB;FB=await import(L.storeFirebase||'https://fucktherules.my.id/firebase.js?v=20261045');return FB;}
let root=null,body=null;
function sheet(){if(root)return root;root=el('div','pg-root');root.hidden=true;root.innerHTML='<div class="pg-back"></div><section class="pg-sheet" role="dialog" aria-modal="true"><button class="pg-x" aria-label="Tutup">×</button><div class="pg-body"></div></section>';document.body.append(root);
  const close=()=>{root.hidden=true;};root.querySelector('.pg-back').onclick=root.querySelector('.pg-x').onclick=close;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden)close();});body=root.querySelector('.pg-body');return root;}
export function openOrderLookup(mode,{toast=()=>{}}={}){
  const resiMode=mode==='resi';sheet();body.innerHTML='';
  const h=el('div','pg-head');h.append(el('small','pg-tag',resiMode?'KANTOR J&T':'OFFICE FUCKTHERULES'),el('h2','pg-title',resiMode?'Cek Resi':'Cek Pesanan'));body.append(h);
  body.append(el('p','pg-line',resiMode?'Cari pesananmu dulu dengan ID order, email, atau no. HP yang dipakai saat checkout. Resi muncul di sini.':'Cari pesananmu dengan ID order, email, atau no. HP yang dipakai saat checkout.'));
  const f=el('div','od-form'),inp=el('input','od-in');inp.placeholder='ID order / email / no. HP';inp.autocomplete='off';inp.autocapitalize='off';inp.inputMode='text';const go=el('button','pg-btn ink','Cari');f.append(inp,go);
  const err=el('p','od-err'),out=el('div','od-out');body.append(f,err,out);root.hidden=false;setTimeout(()=>inp.focus(),50);
  const copy=async v=>{try{await navigator.clipboard.writeText(v);toast('Resi disalin');}catch{toast(v);}};
  const resiBox=d=>{if(!d.resi)return resiMode?el('p','od-note','Pesanan anda belum dikirim.'):null;const b=el('div','od-resi');b.append(el('span','od-cap','Resi anda'),el('b','',d.resi),el('p','','Paket sudah diserahkan ke pihak pengirim. Cek progres pengiriman melalui resi ini.'));
    const r=el('div','pg-acts');const c=el('button','pg-btn','Salin resi');c.onclick=()=>copy(d.resi);const j=el('button','pg-btn ink','Lacak di J&T ›');j.onclick=()=>{copy(d.resi);window.open(L.jntTrack||'https://jet.co.id/track','_blank','noopener');};r.append(c,j);b.append(r);return b;};
  const kv=(k,v)=>{const r=el('div','od-kv');r.append(el('span','',k),el('b','',v));return r;};
  async function detail(d){out.innerHTML='';
    const w=el('div','od-detail');w.append(el('span','od-cap','ID pemesanan'),el('p','od-kode',d.kode));const rb=resiBox(d);if(rb)w.append(rb);
    w.append(el('p','od-art',(d.poNames&&d.poNames.length?d.poNames.join(', '):d.produk)||''));
    if(d.nama)w.append(kv('Nama',d.nama));if(d.email)w.append(kv('Email',d.email));if(d.hp)w.append(kv('Nomor HP',d.hp));
    (Array.isArray(d.items)?d.items:[]).forEach(i=>{w.append(kv('Produk',i.nama||''));if((i.warna||i.size)&&i.jenis!=='aksesoris'&&!(i.warna==='-'&&i.size==='-'))w.append(kv('Warna / Size',(i.warna||'')+' / '+(i.size||'')));});
    w.append(kv('Pembayaran',PAY[d.pay]||d.pay||'-'));out.append(w);
    if(!resiMode){const tlBox=el('div','od-tl');tlBox.append(el('b','','Timeline'),el('p','od-note','Memuat timeline…'));out.append(tlBox);
      try{const F=await fb();let tl=(await F.getTimeline(d.kode)).filter(e=>e.kind!=='legacy');const mulai=ms(d.createdAt);const art=F.getPoUpdates?(await F.getPoUpdates(d.isPO===false?[]:d.poIds)).filter(e=>ms(e.createdAt)>=mulai):[];
        tl=tl.concat(art).sort((a,b)=>(ms(a.createdAt)-ms(b.createdAt))||(a.kind==='created'?-1:0));const ev=tl.length?tl:[{text:'Pesanan dibuat',createdAt:d.createdAt}];
        tlBox.innerHTML='';tlBox.append(el('b','','Timeline'));const ul=el('ul','pg-tl');ev.forEach((e,k)=>{const li=el('li',k===ev.length-1?'now':'');const b=el('b','',e.text||'');b.append(el('em','',dt(e.createdAt)));li.append(b);ul.append(li);});tlBox.append(ul);
      }catch(e){console.warn('timeline',e);tlBox.innerHTML='';}}}
  async function find(){err.textContent='';out.innerHTML='';const q=inp.value.trim();if(!q){err.textContent='Isi ID order, email, atau no. HP dulu.';return;}
    go.disabled=true;out.append(el('p','od-note','Mencari…'));
    try{const F=await fb(),fn=resiMode?F.cariResi:F.cariLacak;if(!fn)throw new Error('Fitur ini belum tersedia di web utama.');const list=await fn(classify(q));out.innerHTML='';
      if(!list||!list.length){err.textContent='Pesanan tidak ditemukan. Periksa kembali ID Order, email, atau no. HP yang kamu pakai saat checkout.';}
      else if(list.length===1)await detail(list[0]);
      else{const g=el('div','od-list');list.forEach(x=>{const b=el('button','od-pick');b.append(el('b','',x.kode),el('span','',(x.poNames&&x.poNames.length)?x.poNames.join(', '):(x.produk||'')));b.onclick=()=>detail(x);g.append(b);});out.append(g);}
    }catch(e){console.warn(e);out.innerHTML='';err.textContent='Belum bisa terhubung ke web utama. Coba lagi sebentar lagi.';const w=el('button','pg-btn','Buka web utama ↗');w.onclick=()=>window.open(L.store||'https://fucktherules.my.id','_blank','noopener');out.append(w);}
    go.disabled=false;}
  go.onclick=find;inp.onkeydown=e=>{if(e.key==='Enter')find();};
}
