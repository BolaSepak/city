/* city-progress.js (v2): progres PER ARTIKEL. Gambar asli artikel melayang di atas bangunan tempat artikel itu berada
   (Toko / Vendor / Office / Kantor J&T / Rumah). Tidak ada data order atau resi di kota: orang mencari resinya sendiri di situs J&T.
   Data: articles = [{id,name,image,color,step,note,timeline:[{step,at}]}]; step = id dari FTR_CITY_STEPS. */
export function createProgress(C){
  const T=C.THREE;const mkTex=c=>{const t=new T.CanvasTexture(c);if(T.SRGBColorSpace)t.colorSpace=T.SRGBColorSpace;return t;};
  const STEPS=window.FTR_CITY_STEPS||[],L=window.FTR_CITY_LINKS||{};
  const AT={shop:'fttr',vendor:'vendor',office:'hq',jnt:'jnt',home:'residential'};
  const AT_NAME={shop:'Toko FTR',vendor:'Vendor',office:'Office FTR',jnt:'Kantor J&T',home:'Sampai tujuan'};
  const MAXI=4;let arts=[],demo=false,marks=[],spot=null;const texCache={};
  const step=id=>STEPS.find(s=>s.id===id)||STEPS[0]||{id:'x',at:'shop',text:''};
  const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;};
  const place=a=>C.places.find(p=>p.id===AT[step(a.step).at]);
  const dateTxt=v=>{const d=new Date(v);return isNaN(d)?'':d.toLocaleDateString('id-ID',{day:'numeric',month:'short'});};

  /* ---------- kartu melayang: label di atas, foto, nama artikel di bawah (artikel = ukuran sedang, Sorotan = paling besar) ---------- */
  function shirtArt(x,color){x.fillStyle=color||'#1b1c1a';x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.moveTo(34,30);x.lineTo(46,25);x.quadraticCurveTo(64,36,82,25);x.lineTo(94,30);x.lineTo(108,46);x.lineTo(97,57);x.lineTo(90,51);x.lineTo(90,92);x.lineTo(38,92);x.lineTo(38,51);x.lineTo(31,57);x.lineTo(20,46);x.closePath();x.fill();x.stroke();}
  const labelColor=t=>/ready/i.test(t)?'#5be39a':/sold|habis/i.test(t)?'#e7e5ea':/pre/i.test(t)?'#ffd51e':'#e6b3ef';
  const SHORT={received:'DITERIMA',vendor:'DI VENDOR',producing:'PRODUKSI',done:'KAOS JADI',packed:'DIKEMAS',jnt:'DI J&T',arrived:'SAMPAI'};
  const stepShort=a=>SHORT[a.step]||String((STEPS.find(s=>s.id===a.step)||{}).label||'').toUpperCase();
  function fitText(x,txt,maxW,size,min){let s=size;x.font='800 '+s+'px Inter,Arial,sans-serif';while(x.measureText(txt).width>maxW&&s>min){s-=1;x.font='800 '+s+'px Inter,Arial,sans-serif';}
    if(x.measureText(txt).width>maxW){while(txt.length>2&&x.measureText(txt+'…').width>maxW)txt=txt.slice(0,-1);txt+='…';}return txt;}
  function cardCanvas({img,color,label,name,chip,hot,badge}){const c=document.createElement('canvas');c.width=240;c.height=320;const x=c.getContext('2d'),rr=(a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h);};
    x.fillStyle='#111';rr(4,36,232,236,26);x.fill();x.fillStyle='#fff';rr(10,42,220,224,21);x.fill();
    if(hot){x.strokeStyle='#ffd51e';x.lineWidth=5;rr(13,45,214,218,19);x.stroke();}
    x.fillStyle='#111';x.beginPath();x.moveTo(98,268);x.lineTo(120,314);x.lineTo(142,268);x.fill();x.fillStyle='#fff';x.beginPath();x.moveTo(104,264);x.lineTo(120,298);x.lineTo(136,264);x.fill();
    x.save();rr(18,50,204,168,16);x.clip();
    if(badge!==undefined){x.fillStyle='#ffd51e';x.fillRect(18,50,204,168);x.fillStyle='#111';x.font='900 80px Inter,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('+'+badge,120,136);}
    else if(img){const k=Math.max(204/img.width,168/img.height);x.drawImage(img,120-img.width*k/2,134-img.height*k/2,img.width*k,img.height*k);}
    else{x.fillStyle='#f1efe9';x.fillRect(18,50,204,168);x.save();x.translate(26,28);x.scale(1.4,1.4);shirtArt(x,color||'#1b1c1a');x.restore();}
    x.restore();x.textAlign='center';x.textBaseline='middle';
    if(badge===undefined){x.fillStyle='#111';x.fillText(fitText(x,String(name||'').toUpperCase(),196,24,12),120,244);
      const lab=String(label||'').toUpperCase();if(lab){x.font='900 20px Inter,Arial,sans-serif';const w=Math.min(228,Math.max(120,x.measureText(lab).width+40));x.fillStyle='#111';rr(120-w/2-3,0,w+6,44,14);x.fill();x.fillStyle=chip||'#e6b3ef';rr(120-w/2,3,w,38,11);x.fill();x.fillStyle='#111';x.fillText(fitText(x,lab,w-20,20,11),120,23);}}
    else{x.fillStyle='#111';x.font='800 22px Inter,Arial,sans-serif';x.fillText('LAINNYA',120,244);}
    return c;}
  function iconMaterial(a,badge){
    const mk=img=>mkTex(cardCanvas({img,color:a&&a.color,label:a?stepShort(a):'',name:a&&a.name,chip:'#e6b3ef',badge}));
    const mat=new T.SpriteMaterial({map:mk(null),transparent:true,depthTest:false,toneMapped:false,fog:false});
    if(badge===undefined&&a&&a.image){const k=a.image+'|'+a.step+'|'+a.name;if(texCache[k]){mat.map=texCache[k];}else{const im=new Image();im.crossOrigin='anonymous';im.onload=()=>{try{const t=mk(im);texCache[k]=t;mat.map=t;mat.needsUpdate=true;}catch{}};im.onerror=()=>{};im.src=a.image;}}
    return mat;}
  function spotMaterial(){const mk=img=>mkTex(cardCanvas({img,label:spot.label,name:spot.name,chip:labelColor(spot.label||''),hot:true}));
    const m=new T.SpriteMaterial({map:mk(null),transparent:true,depthTest:false,toneMapped:false,fog:false});
    if(spot.image){const im=new Image();im.crossOrigin='anonymous';im.onload=()=>{try{m.map=mk(im);m.needsUpdate=true;}catch{}};im.src=spot.image;}return m;}

  /* ---------- penanda di dunia ---------- */
  function clearMarks(){marks.forEach(m=>{m.parent&&m.parent.remove(m);m.material.dispose();});marks=[];}
  function render(){
    clearMarks();const parent=C.group();if(!parent||!C.places.length)return;
    const by={};arts.forEach(a=>{const p=place(a);if(p&&p.hit)(by[p.id]=by[p.id]||{p,list:[]}).list.push(a);});
    if(spot&&!spot.hidden){const sp=C.places.find(q=>q.id==='fttr');if(sp&&sp.hit){sp.hit.updateWorldMatrix(true,false);const bb=new T.Box3().setFromObject(sp.hit),s=new T.Sprite(spotMaterial());s.renderOrder=25;s.scale.set(3.3,4.4,1);s.center.set(.5,0);s.position.set((bb.min.x+bb.max.x)/2,bb.max.y+6.2,(bb.min.z+bb.max.z)/2);s.userData={spot:true};parent.add(s);marks.push(s);}}
    Object.values(by).forEach(({p,list})=>{
      p.hit.updateWorldMatrix(true,false);const bb=new T.Box3().setFromObject(p.hit),y=bb.max.y+1.8,cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2;
      const shown=list.length>MAXI?MAXI-1:list.length,total=shown+(list.length>shown?1:0);
      for(let i=0;i<total;i++){const extra=i>=shown,off=(i-(total-1)/2)*2.55;
        const sp=new T.Sprite(iconMaterial(extra?null:list[i],extra?list.length-shown:undefined));
        sp.renderOrder=20;sp.scale.set(2.4,3.2,1);sp.center.set(.5,0);sp.position.set(cx+off*.7071,y,cz-off*.7071);
        sp.userData=extra?{moreAt:p.id}:{artId:list[i].id};parent.add(sp);marks.push(sp);}
    });
  }
  function hit(rc){if(!marks.length)return false;const h=rc.intersectObjects(marks,false);if(!h.length)return false;const u=h[0].object.userData;if(u.spot)openSpot();else if(u.artId)openArticle(u.artId);else if(u.moreAt)openBuilding(u.moreAt);return true;}

  /* ---------- kartu ---------- */
  let root=null;
  function ui(){if(root)return root;root=el('div','pg-root');root.hidden=true;root.innerHTML='<div class="pg-back"></div><section class="pg-sheet" role="dialog" aria-modal="true"><button class="pg-x" aria-label="Tutup">×</button><div class="pg-body"></div></section>';document.body.appendChild(root);
    root.querySelector('.pg-back').onclick=root.querySelector('.pg-x').onclick=close;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden)close();});return root;}
  function open(title,tag){const b=ui().querySelector('.pg-body');b.innerHTML='';const h=el('div','pg-head');h.append(el('small','pg-tag',tag||''),el('h2','pg-title',title));if(demo)h.append(el('span','pg-demo','DATA CONTOH'));b.append(h);ui().hidden=false;return b;}
  function close(){if(root)root.hidden=true;}
  const btn=(t,fn,cls)=>{const b=el('button','pg-btn'+(cls?' '+cls:''),t);b.onclick=fn;return b;};
  const go=u=>window.open(u,'_blank','noopener');

  function artImg(a,cls){const w=el('div',cls||'pg-pic');if(a.image){const im=new Image();im.src=a.image;im.alt=a.name||'';im.loading='lazy';im.referrerPolicy='no-referrer';im.onerror=()=>{w.innerHTML='';w.append(pinCanvasFor(a));};w.append(im);}else w.append(pinCanvasFor(a));return w;}
  function pinCanvasFor(a){const c=document.createElement('canvas');c.width=c.height=120;const x=c.getContext('2d');x.fillStyle='#f1efe9';x.fillRect(0,0,120,120);x.save();x.translate(-4,-6);shirtArt(x,a.color);x.restore();return c;}
  function timeline(a){const ul=el('ul','pg-tl'),idx=STEPS.findIndex(s=>s.id===a.step),saved=a.timeline||[];
    STEPS.forEach((s,i)=>{if(i>idx)return;const t=saved.find(x=>x.step===s.id),li=el('li',i===idx?'now':'');const top=el('b','',s.label||AT_NAME[s.at]);if(t&&t.at)top.append(el('em','',dateTxt(t.at)));li.append(top,el('span','',s.text));ul.append(li);});return ul;}
  function openArticle(id){const a=arts.find(x=>x.id===id);if(!a)return;const s=step(a.step),p=place(a);
    const b=open(a.name||'Artikel',AT_NAME[s.at]||'');const hero=artImg(a,'pg-hero');b.append(hero);
    const chip=el('div','pg-chip');chip.append(el('i','',''),el('span','',AT_NAME[s.at]||''));b.append(chip,el('p','pg-status',s.text));if(a.note)b.append(el('p','pg-note',a.note));
    b.append(timeline(a));const acts=el('div','pg-acts');
    if(s.at==='jnt')acts.append(btn('Cek Resi',()=>{close();C.lookup&&C.lookup('resi');},'ink'));
    if(p)acts.append(btn('Lihat di kota',()=>{close();C.goto(p);}));b.append(acts);
    if(s.at==='jnt')b.append(el('p','pg-hint','Cari pesananmu dengan ID order, email, atau no. HP untuk melihat resinya.'));}
  function openSpot(){if(!spot)return;const b=open(spot.name||'Sorotan','SOROTAN TOKO');b.append(artImg({image:spot.image,name:spot.name},'pg-hero'));
    if(spot.label){const chip=el('div','pg-chip');chip.style.background=labelColor(String(spot.label).toUpperCase());chip.append(el('i','',''),el('span','',String(spot.label).toUpperCase()));b.append(chip);}
    b.append(el('p','pg-status',spot.name||''));const acts=el('div','pg-acts');acts.append(btn('Masuk toko',()=>{close();C.enterStore&&C.enterStore();},'ink'));b.append(acts);}
  function grid(b,list,empty){if(!list.length){b.append(el('p','pg-empty',empty));return;}const g=el('div','pg-grid');list.forEach(a=>{const c=el('button','pg-cell');c.append(artImg(a,'pg-thumb'),el('span','',a.name||'Artikel'));c.onclick=()=>openArticle(a.id);g.append(c);});b.append(g);}
  const at=k=>arts.filter(a=>step(a.step).at===k);
  function openBuilding(pid){const p=C.places.find(q=>q.id===pid),k=Object.keys(AT).find(x=>AT[x]===pid);const b=open(p?p.name:'Artikel','DI BANGUNAN INI');grid(b,k?at(k):[],'Kosong.');}
  function office(){const b=open('Office FucktheRules','CEK PESANAN');b.append(el('p','pg-line','Cek progres pesananmu dengan ID order, email, atau no. HP.'));b.append(btn('Cek Pesanan',()=>{close();C.lookup&&C.lookup('lacak');},'ink'));
    const l=at('office');if(l.length){b.append(el('p','pg-sub','Sedang dikemas'));grid(b,l);}}
  function jntOffice(){const b=open('Kantor J&T Express','PENGIRIMAN');b.append(el('p','pg-line','Artikel yang sedang dalam perjalanan. Cari pesananmu dulu (ID order, email, atau no. HP) untuk melihat resinya.'));b.append(btn('Cek Resi',()=>{close();C.lookup&&C.lookup('resi');},'ink'));grid(b,at('jnt'),'Belum ada artikel di J&T.');}
  function vendorOffice(){const b=open('Vendor Sablon','PRODUKSI');b.append(el('p','pg-line','Artikel yang sedang dibuat. Ketuk untuk melihat detail.'));grid(b,at('vendor'),'Belum ada artikel di vendor.');}
  const openFor=id=>{if(id==='hq')office();else if(id==='jnt')jntOffice();else if(id==='vendor')vendorOffice();};

  /* ---------- data ---------- */
  function setArticles(list,isDemo){arts=Array.isArray(list)?list:[];demo=!!isDemo;render();}
  const demoData=()=>[{id:'d1',name:'Sleman Tee',color:'#1b1c1a',step:'jnt'},{id:'d2',name:'Soerabaja Tee',color:'#6a1f2a',step:'producing'},{id:'d3',name:'North Stand Tee',color:'#efece0',step:'vendor'},{id:'d4',name:'Away End Tee',color:'#1f2f55',step:'received'}];
  function setSpotlight(s){spot=s&&s.name?{name:String(s.name),image:s.image||'',label:s.label||'',hidden:!!s.hidden}:null;render();}
  function init(){spot={name:'Sleman Tee',image:'',label:'PRE ORDER',hidden:false};setArticles(demoData(),true);}
  return {hit,init,setArticles,setSpotlight,openSpot,render,open:openFor,openArticle,openBuilding,close,articles:()=>arts};
}
