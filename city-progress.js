/* city-progress.js (v1): ikon baju progres pesanan di atas bangunan + kartu detail + layanan Cek Resi / Cek Pesanan.
   Data: orders = [{id,code,name,color,size,image,buyer,step,note,resi,timeline:[{step,at}]}]. step = id dari FTR_CITY_STEPS.
   Sumber data nyata (cityFeed) disambungkan di tahap 3 lewat window.FTRProgress.setOrders(list). Sebelum itu: data DEMO. */
export function createProgress(C){
  const T=C.THREE,STEPS=window.FTR_CITY_STEPS||[],L=window.FTR_CITY_LINKS||{};
  const AT={shop:'fttr',vendor:'vendor',office:'hq',jnt:'jnt',home:'residential'};
  const AT_NAME={shop:'Toko FTR',vendor:'Vendor',office:'Office FTR',jnt:'Kantor J&T',home:'Rumah'};
  const MAXI=5;let orders=[],demo=false,marks=[],tex={};
  const step=id=>STEPS.find(s=>s.id===id)||STEPS[0]||{id:'x',at:'shop',text:''};
  const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;};
  const place=o=>C.places.find(p=>p.id===AT[step(o.step).at]);
  const dateTxt=v=>{const d=new Date(v);return isNaN(d)?'':d.toLocaleDateString('id-ID',{day:'numeric',month:'short'})+' · '+d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});};

  /* ---------- ikon baju (kanvas kecil, tanpa gambar eksternal) ---------- */
  function shirtCanvas(color,size=96){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d'),s=size/96;
    x.scale(s,s);x.fillStyle='#171914';x.beginPath();x.arc(48,48,46,0,6.283);x.fill();x.lineWidth=3;x.strokeStyle='#d7ff3f';x.stroke();
    x.fillStyle=color||'#1b1c1a';x.strokeStyle='#efece0';x.lineWidth=2.5;x.beginPath();
    x.moveTo(30,26);x.lineTo(40,22);x.quadraticCurveTo(48,30,56,22);x.lineTo(66,26);x.lineTo(78,38);x.lineTo(69,47);x.lineTo(63,42);x.lineTo(63,72);x.lineTo(33,72);x.lineTo(33,42);x.lineTo(27,47);x.lineTo(18,38);x.closePath();x.fill();x.stroke();return c;}
  function badgeCanvas(n){const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.fillStyle='#d7ff3f';x.beginPath();x.arc(48,48,44,0,6.283);x.fill();x.fillStyle='#171914';x.font='900 40px Inter,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('+'+n,48,50);return c;}
  const texOf=(k,mk)=>tex[k]||(tex[k]=new T.CanvasTexture(mk()));
  const shirtLoader=new T.TextureLoader();shirtLoader.setCrossOrigin('anonymous');const imageTextures=new Map();
  function articleTexture(url,sp){if(!url)return; if(imageTextures.has(url)){sp.material.map=imageTextures.get(url);sp.material.needsUpdate=true;return;}shirtLoader.load(url,t=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;imageTextures.set(url,t);sp.material.map=t;sp.material.needsUpdate=true;const im=t.image;if(im&&im.width&&im.height){const r=im.width/im.height;sp.scale.set(1.35*Math.min(1.25,r),1.35*Math.min(1.25,1/r),1);}},undefined,()=>{});}

  /* ---------- penanda di dunia ---------- */
  function clearMarks(){marks.forEach(m=>{m.parent&&m.parent.remove(m);});marks=[];}
  function render(){
    clearMarks();const parent=C.group();if(!parent||!C.places.length)return;
    const by={};orders.forEach(o=>{const p=place(o);if(p)(by[p.id]=by[p.id]||{p,list:[]}).list.push(o);});
    Object.values(by).forEach(({p,list})=>{
      const bb=new T.Box3().setFromObject(p.group),y=(isFinite(bb.max.y)?bb.max.y:5)+2.3,cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2;
      const shown=list.length>MAXI?MAXI-1:list.length,total=shown+(list.length>shown?1:0);
      for(let i=0;i<total;i++){
        const extra=i>=shown,o=list[i],off=(i-(total-1)/2)*1.35;
        const map=extra?texOf('+'+(list.length-shown),()=>badgeCanvas(list.length-shown)):texOf(o.color||'#1b1c1a',()=>shirtCanvas(o.color));
        const sp=new T.Sprite(new T.SpriteMaterial({map,transparent:true,depthTest:false}));
        sp.renderOrder=20;sp.scale.set(1.15,1.15,1);if(!extra&&o.article&&o.image)articleTexture(o.image,sp);sp.position.set(cx+off*.7071,y,cz-off*.7071);
        sp.userData=extra?{shirtMore:p.id}:{shirtId:o.id};parent.add(sp);marks.push(sp);
      }
    });
  }

  /* ---------- kartu / modal ---------- */
  let root=null;
  function ui(){if(root)return root;root=el('div','pg-root');root.hidden=true;root.innerHTML='<div class="pg-back"></div><section class="pg-sheet" role="dialog" aria-modal="true"><button class="pg-x" aria-label="Tutup">×</button><div class="pg-body"></div></section>';document.body.appendChild(root);
    root.querySelector('.pg-back').onclick=root.querySelector('.pg-x').onclick=close;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden)close();});return root;}
  const body=()=>ui().querySelector('.pg-body');
  function open(kind,title,tag){const b=body();b.innerHTML='';const h=el('div','pg-head');h.append(el('small','pg-tag',tag||''),el('h2','pg-title',title));if(demo)h.append(el('span','pg-demo','DATA CONTOH'));b.append(h);ui().hidden=false;return b;}
  function close(){if(root)root.hidden=true;}
  const btn=(t,fn,acid)=>{const b=el('button','pg-btn'+(acid?' acid':''),t);b.onclick=fn;return b;};
  const copy=async v=>{try{await navigator.clipboard.writeText(v);C.toast('Disalin: '+v);}catch{C.toast(v);}};
  const jnt=resi=>{copy(resi);window.open(L.jntTrack||'https://jet.co.id/track','_blank','noopener');};

  function timeline(o){
    const ul=el('ul','pg-tl'),idx=STEPS.findIndex(s=>s.id===o.step),saved=(o.timeline||[]);
    STEPS.forEach((s,i)=>{if(i>idx)return;const t=saved.find(x=>x.step===s.id),li=el('li',i===idx?'now':'');li.append(el('b','',AT_NAME[s.at]),el('span','',s.text));if(t&&t.at)li.append(el('em','',dateTxt(t.at)));ul.append(li);});return ul;}
  function orderCard(o){
    const s=step(o.step),b=open('order',o.name||'Pesanan',o.article?'UPDATE PER ARTIKEL':(AT_NAME[s.at]||''));
    const pic=el('div','pg-pic');if(o.image){const im=new Image();im.src=o.image;im.alt=o.name||'';im.loading='lazy';pic.append(im);}else{const c=shirtCanvas(o.color,160);pic.append(c);}
    const meta=el('div','pg-meta');if(!o.article&&[o.size,o.buyer].some(Boolean))meta.append(el('p','pg-line',[o.size&&('Size '+o.size),o.buyer&&('Pemesan '+o.buyer)].filter(Boolean).join(' · ')));meta.append(el('p','pg-status',o.article?(o.note||s.text):s.text));if(o.note&&!o.article)meta.append(el('p','pg-note','Catatan: '+o.note));if(o.article)meta.append(el('p','pg-line','Status ini berlaku untuk seluruh pesanan artikel. Resi pribadi tersedia di menu Cek Resi website utama.')); 
    const row=el('div','pg-row');row.append(pic,meta);b.append(row,timeline(o));
    const acts=el('div','pg-acts');if(o.resi&&!o.article){acts.append(el('p','pg-line','Resi '+o.resi),btn('Cek Resi',()=>jnt(o.resi),true));}
    const p=place(o);if(p)acts.append(btn('Ke bangunan',()=>{close();C.goto(p);}));b.append(acts);}
  function listOf(b,list,empty){if(!list.length){b.append(el('p','pg-empty',empty));return;}list.forEach(o=>{const r=el('button','pg-item');const ic=shirtCanvas(o.color,48);ic.className='pg-ic';r.append(ic);const t=el('span','pg-it');t.append(el('b','',o.name||'Pesanan'),el('small','',o.resi?('Resi '+o.resi):step(o.step).text));r.append(t);r.onclick=()=>orderCard(o);b.append(r);});}
  function office(){ // Cek Pesanan
    const b=open('office','Cek Pesanan','OFFICE FUCKTHERULES');b.append(el('p','pg-line','Masukkan kode pesananmu (ID pemesanan) untuk melihat progresnya.'));
    const f=el('div','pg-form'),inp=el('input','pg-input');inp.placeholder='Kode pesanan';inp.autocapitalize='characters';inp.autocomplete='off';const out=el('div','pg-out');
    const go=()=>{out.innerHTML='';const k=inp.value.trim().toUpperCase();if(!k)return;const o=orders.find(x=>String(x.code).toUpperCase()===k);if(o)orderCard(o);else out.append(el('p','pg-empty','Kode tidak ditemukan. Cek lagi, atau buka halaman Cek Pesanan di web utama.'));};
    inp.onkeydown=e=>{if(e.key==='Enter')go();};f.append(inp,btn('Cek',go,true));b.append(f,out,btn('Buka web utama',()=>window.open((L.store||'https://fucktherules.my.id')+'/#pantau','_blank','noopener')));}
  function jntOffice(){ // Cek Resi
    const b=open('jnt','Cek Resi','KANTOR J&T');const list=orders.filter(o=>step(o.step).at==='jnt');
    b.append(el('p','pg-line','Paket yang sedang dalam perjalanan. Ketuk Cek Resi untuk menyalin nomor dan membuka pelacakan J&T.'));
    const f=el('div','pg-form'),inp=el('input','pg-input');inp.placeholder='Nomor resi';inp.autocomplete='off';f.append(inp,btn('Cek',()=>{const v=inp.value.trim();if(v)jnt(v);},true));b.append(f);listOf(b,list,'Belum ada paket di kantor J&T.');}
  function vendorOffice(){
    const b=open('vendor','Produksi','VENDOR');const list=orders.filter(o=>step(o.step).at==='vendor');b.append(el('p','pg-line','Pesanan yang sedang di tangan vendor. Ketuk untuk melihat detail.'));listOf(b,list,'Belum ada pesanan di vendor.');}
  const openFor=id=>{if(id==='hq')office();else if(id==='jnt')jntOffice();else if(id==='vendor')vendorOffice();};
  function openShirt(id){const o=orders.find(x=>x.id===id);if(o)orderCard(o);}
  function openMore(pid){const p=C.places.find(q=>q.id===pid),b=open('more',p?p.name:'Pesanan','DI BANGUNAN INI');listOf(b,orders.filter(o=>{const q=place(o);return q&&q.id===pid;}),'Kosong.');}

  /* ---------- data ---------- */
  function setOrders(list,isDemo){orders=Array.isArray(list)?list:[];demo=!!isDemo;render();}
  function demoData(){const n=Date.now(),h=3600e3;return [
    {id:'d1',code:'FTR-1001',name:'Soerabaja Tee — Hitam',color:'#1b1c1a',size:'L',buyer:'A•••',step:'received',timeline:[{step:'received',at:n-5*h}]},
    {id:'d2',code:'FTR-1002',name:'North Stand Tee — Putih',color:'#efece0',size:'M',buyer:'R•••',step:'vendor',timeline:[{step:'received',at:n-60*h},{step:'vendor',at:n-30*h}]},
    {id:'d3',code:'FTR-1003',name:'Soerabaja Tee — Maroon',color:'#6a1f2a',size:'XL',buyer:'D•••',step:'producing',note:'batch 2',timeline:[{step:'received',at:n-90*h},{step:'vendor',at:n-70*h},{step:'producing',at:n-20*h}]},
    {id:'d4',code:'FTR-1004',name:'Away End Tee — Navy',color:'#1f2f55',size:'L',buyer:'F•••',step:'done',timeline:[]},
    {id:'d5',code:'FTR-1005',name:'North Stand Tee — Hitam',color:'#1b1c1a',size:'M',buyer:'S•••',step:'jnt',resi:'JP1234567890',timeline:[{step:'jnt',at:n-8*h}]},
    {id:'d6',code:'FTR-1006',name:'Soerabaja Tee — Hitam',color:'#1b1c1a',size:'S',buyer:'M•••',step:'jnt',resi:'JP0987654321',timeline:[]},
    {id:'d7',code:'FTR-1007',name:'Away End Tee — Putih',color:'#efece0',size:'XL',buyer:'K•••',step:'vendor',timeline:[]}];}
  function init(){setOrders(demoData(),true);}
  function hit(rc){if(!marks.length)return false;const h=rc.intersectObjects(marks,false);if(!h.length)return false;const u=h[0].object.userData;if(u.shirtId)openShirt(u.shirtId);else if(u.shirtMore)openMore(u.shirtMore);return true;}
  return {hit,init,setOrders,render,open:openFor,openShirt,openMore,close,orders:()=>orders};
}
