/* city-store-embed.js (v1): masuk toko = membuka game toko (game.fucktherules.my.id, 3D penuh) di lapisan layar penuh.
   Kota berhenti menggambar selama toko terbuka (hemat baterai/GPU); ditutup = kembali ke kota. Tidak menduplikasi kode game. */
const L=window.FTR_CITY_LINKS||{};let root=null;
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;};
export function openGameStore({toast=()=>{}}={}){
  const url=(L.game||'https://game.fucktherules.my.id/')+((L.game||'').includes('?')?'&':'?')+'embed=1';
  if(root){root.remove();root=null;}
  root=el('div','st-root');const bar=el('div','st-bar'),back=el('button','st-b','‹ Kota'),ttl=el('span','st-t','FVCKTHERULES STORE'),ext=el('button','st-b','↗');ext.setAttribute('aria-label','Buka di tab baru');back.setAttribute('aria-label','Kembali ke kota');
  bar.append(back,ttl,ext);const wrap=el('div','st-wrap'),ld=el('div','st-ld','Memuat toko…'),hint=el('div','st-hint');hint.hidden=true;hint.append(el('span','','Toko tidak tampil? '),(()=>{const b=el('button','st-b','Buka di tab baru');b.onclick=()=>window.open(L.game||'https://game.fucktherules.my.id/','_blank','noopener');return b;})());
  const fr=document.createElement('iframe');fr.title='Toko FVCKTHERULES';fr.allow='fullscreen; clipboard-write; payment; accelerometer; gyroscope';fr.referrerPolicy='strict-origin-when-cross-origin';
  const close=()=>{window.__cityPaused=false;fr.src='about:blank';root&&root.remove();root=null;window.removeEventListener('message',onMsg);};
  let gOrigin='';try{gOrigin=new URL(L.game||'https://game.fucktherules.my.id/').origin;}catch{}
  const onMsg=e=>{if(e.origin===gOrigin&&e.data&&e.data.ftr==='exit')close();};window.addEventListener('message',onMsg);
  back.onclick=close;ext.onclick=()=>window.open(L.game||'https://game.fucktherules.my.id/','_blank','noopener');
  fr.onload=()=>{ld.hidden=true;hint.hidden=true;clearTimeout(t);};const t=setTimeout(()=>{hint.hidden=false;},10000);
  wrap.append(fr,ld,hint);root.append(bar,wrap);document.body.append(root);window.__cityPaused=true;fr.src=url;
}
