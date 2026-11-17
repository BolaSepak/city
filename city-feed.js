/* city-feed.js (v1): membaca cityFeed (Firebase "city") secara live dan menggerakkan ikon baju di kota.
   Kosong/belum diisi di config.js = tetap memakai data contoh. Publik hanya membaca; penulisan hanya dari admin. */
export async function startFeed(PROG){
  const cfg=window.FTR_CITY_FIREBASE;if(!cfg||!cfg.projectId)return false;
  const V='12.13.0',B='https://www.gstatic.com/firebasejs/'+V+'/';
  const [{initializeApp,getApps},fs]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js')]);
  const app=getApps().find(a=>a.name==='cityPublic')||initializeApp(cfg,'cityPublic'),db=fs.getFirestore(app);
  /* teks langkah dari admin (cityConfig/steps) menimpa teks bawaan */
  try{const c=await fs.getDoc(fs.doc(db,'cityConfig','steps'));if(c.exists()){(c.data().steps||[]).forEach(x=>{const s=(window.FTR_CITY_STEPS||[]).find(y=>y.id===x.id);if(s&&x.text)s.text=String(x.text).slice(0,200);});}}catch(e){console.warn('cityConfig',e.code||e.message);}
  const q=fs.query(fs.collection(db,'cityFeed'),fs.where('hidden','==',false));
  fs.onSnapshot(q,snap=>{
    const list=snap.docs.map(d=>{const x=d.data();return {id:d.id,code:x.code||d.id,name:x.name||'Pesanan',color:x.color||'#1b1c1a',size:x.size||'',image:x.image||'',buyer:x.buyer||'',step:x.step,note:x.note||'',resi:x.resi||'',timeline:Array.isArray(x.timeline)?x.timeline:[]};});
    PROG.setOrders(list,false);
  },e=>console.warn('cityFeed',e.code||e.message));
  return true;
}
