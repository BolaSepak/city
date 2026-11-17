/* FTTR CITY — update pengiriman per artikel.
   Sumber: katalog + poUpdates dari Firebase website utama. Tidak membaca order/resi pembeli. */
const STORE={apiKey:'AIzaSyCVL_C4opQiKC6fNG_Rw4l-519rQZICH58',authDomain:'fvcktherules-store.firebaseapp.com',projectId:'fvcktherules-store',storageBucket:'fvcktherules-store.firebasestorage.app',messagingSenderId:'382347904485',appId:'1:382347904485:web:6715a7b395d44ad07a5b0c'};
export async function startFeed(PROG){
  const V='12.13.0',B='https://www.gstatic.com/firebasejs/'+V+'/';
  const [{initializeApp,getApps},fs]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js')]);
  const app=getApps().find(a=>a.name==='fttrStorePublicCity')||initializeApp(STORE,'fttrStorePublicCity'),db=fs.getFirestore(app);
  const productsRef=fs.collection(db,'produk');
  let unsubs=[],timer=null;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderPanel(items){
    let root=document.getElementById('cityArticleUpdates');
    if(!root){root=document.createElement('section');root.id='cityArticleUpdates';root.className='city-article-updates';root.innerHTML='<button class="cau-toggle" type="button"><span class="cau-dot"></span><b>UPDATE ARTIKEL</b><span class="cau-count"></span><span class="cau-chevron">⌄</span></button><div class="cau-body"></div>';document.body.append(root);root.querySelector('.cau-toggle').onclick=()=>root.classList.toggle('open');}
    root.querySelector('.cau-count').textContent=items.length?String(items.length):'';
    root.querySelector('.cau-body').innerHTML=items.length?items.map(a=>`<article class="cau-card"><img src="${esc(a.image)}" alt="${esc(a.name)}" loading="lazy"><div class="cau-info"><b>${esc(a.name)}</b><small class="cau-status">${esc(a.status)}</small><small class="cau-courier">J&T Express</small></div></article>`).join(''):'<p class="cau-empty">Belum ada artikel yang diserahkan ke ekspedisi.</p>';
  }
  async function refresh(products){
    unsubs.forEach(f=>f());unsubs=[];
    const list=products.filter(p=>p&&p.thumbnail);
    const cards=[];
    await Promise.all(list.map(async p=>{
      try{const snap=await fs.getDocs(fs.collection(db,'poUpdates',p.id,'items'));const docs=snap.docs.map(d=>({id:d.id,...d.data()}));
        const photo=docs.find(x=>x.id==='shipment-photo'||x.kind==='shipping-photo');
        const latest=docs.filter(x=>x.id!=='shipment-photo'&&x.text).sort((a,b)=>{const t=x=>x.createdAt?.toMillis?.()||0;return t(b)-t(a);})[0];
        if(photo||latest){const status=photo?'Sudah diserahkan ke J&T':(latest?.text||'Update artikel');cards.push({id:p.id,name:p.nama||p.name||'Artikel FTTR',image:p.thumbnail,status,step:photo?'jnt':'vendor'});}
      }catch(e){console.warn('poUpdates city',p.id,e.code||e.message);}
    }));
    cards.sort((a,b)=>a.name.localeCompare(b.name));
    // Progress markers are now one icon per article, not per customer order.
    PROG.setOrders(cards.map(a=>({id:'article-'+a.id,article:true,code:'',name:a.name,color:'#111',image:a.image,step:a.step,note:a.status,resi:''})),false);
    renderPanel(cards);
  }
  let products=[];
  const stop=fs.onSnapshot(fs.query(productsRef),snap=>{products=snap.docs.map(d=>({id:d.id,...d.data()}));refresh(products).catch(console.warn);},e=>console.warn('FTTR products feed',e.code||e.message));
  window.addEventListener('pagehide',()=>{stop();unsubs.forEach(f=>f());clearTimeout(timer);},{once:true});
  return true;
}
