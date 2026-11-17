/* city-realmap.js (v1): "Peta Nyata" ala Instagram Map. Gelembung foto di lokasi asli, cluster saat berdekatan,
   ketuk untuk kartu detail (foto besar, @IG, lokasi asli, caption) + tombol "Lihat di kota FTR". */
import {loadLeaflet,geoSearch} from './city-upload.js?v=1';
const MC='https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/';
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let MP=null;
function loadCluster(){if(MP)return MP;MP=new Promise((ok,no)=>{const c=document.createElement('link');c.rel='stylesheet';c.href=MC+'MarkerCluster.css';document.head.append(c);const s=document.createElement('script');s.src=MC+'leaflet.markercluster.js';s.onload=ok;s.onerror=()=>{MP=null;no(new Error('Cluster gagal dimuat'));};document.head.append(s);});return MP;}
const when=v=>{const t=v&&v.toMillis?v.toMillis():0;return t?new Date(t).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):'';};

export function createRealMap({getItems,onCity,toast}){
  let root=null,map=null,cluster=null,card=null,L=null;
  const pin=it=>L.divIcon({className:'rm-ic',html:`<div class="rm-pin"><img src="${esc(it.thumb||it.url)}" alt="" loading="lazy" referrerpolicy="no-referrer"></div>`,iconSize:[54,64],iconAnchor:[27,62]});
  const build=()=>{root=el('div','rm-root');root.hidden=true;
    const top=el('div','rm-top'),back=el('button','rm-b','‹');back.setAttribute('aria-label','Kembali');back.onclick=close;
    const q=el('input','rm-q');q.placeholder='Cari tempat…';const me=el('button','rm-b','◎');me.setAttribute('aria-label','Lokasi saya');
    q.onkeydown=async e=>{if(e.key!=='Enter')return;const t=q.value.trim();if(!t)return;try{const r=await geoSearch(t);if(r)map.flyTo([r.lat,r.lng],13);else toast('Tempat tidak ditemukan');}catch{toast('Pencarian gagal');}};
    me.onclick=()=>{if(!navigator.geolocation)return toast('GPS tidak tersedia');navigator.geolocation.getCurrentPosition(p=>map.flyTo([p.coords.latitude,p.coords.longitude],13),()=>toast('GPS ditolak'),{timeout:12000});};
    top.append(back,q,me);const host=el('div','rm-map');card=el('div','rm-card');card.hidden=true;root.append(top,host,card);document.body.append(root);root.host=host;};
  function showCard(it){card.innerHTML='';card.hidden=false;
    const x=el('button','rm-x','×');x.onclick=()=>{card.hidden=true;};const im=new Image();im.src=it.url;im.alt=it.caption||'Foto';
    const b=el('div','rm-cb');b.append(el('small','',it.cityArea||''),el('h3','',it.placeName||'Foto'));
    if(it.ig){const a=el('a','rm-ig','@'+it.ig);a.href='https://instagram.com/'+encodeURIComponent(it.ig);a.target='_blank';a.rel='noopener noreferrer';b.append(a);}
    if(it.caption)b.append(el('p','',it.caption));const d=when(it.createdAt);if(d)b.append(el('small','',d));
    const go=el('button','rm-go','Lihat di kota FTR');go.onclick=()=>{close();onCity(it);};b.append(go);card.append(x,im,b);}
  function fill(){if(!map)return;cluster.clearLayers();const pts=[];
    getItems().filter(i=>typeof i.lat==='number'&&typeof i.lng==='number').forEach(it=>{const m=L.marker([it.lat,it.lng],{icon:pin(it),it});m.on('click',()=>showCard(it));cluster.addLayer(m);pts.push([it.lat,it.lng]);});
    if(pts.length&&!fill.fit){fill.fit=1;map.fitBounds(pts,{padding:[60,60],maxZoom:12});}
    if(!pts.length)toast('Belum ada foto dengan lokasi asli');}
  async function open(){
    try{L=await loadLeaflet();await loadCluster();}catch(e){toast(e.message);return;}
    if(!root)build();root.hidden=false;
    if(!map){map=L.map(root.host,{worldCopyJump:true,zoomControl:true}).setView([-2.5,118],4);root.host.classList.add('dark');
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
      cluster=L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:55,iconCreateFunction:c=>{const ms=c.getAllChildMarkers(),last=ms[0].options.it;
        return L.divIcon({className:'rm-ic',html:`<div class="rm-pin"><img src="${esc(last.thumb||last.url)}" alt=""><b>${ms.length}</b></div>`,iconSize:[54,64],iconAnchor:[27,62]});}});
      map.addLayer(cluster);}
    setTimeout(()=>{map.invalidateSize();fill();},60);}
  function close(){if(root)root.hidden=true;}
  return {open,close,refresh:fill};
}
