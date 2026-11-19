/* city-feed.js (v2): membaca cityArticles (Firebase "city") secara live dan menggerakkan ikon artikel di kota.
   Publik hanya membaca; penulisan hanya dari admin. Tidak ada data order/pembeli/resi di sini. */
export async function startFeed(PROG){
  const cfg=window.FTR_CITY_FIREBASE;if(!cfg||!cfg.projectId)return false;
  const B='https://www.gstatic.com/firebasejs/12.13.0/';
  const [{initializeApp,getApps},fs]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js')]);
  const app=getApps().find(a=>a.name==='cityPublic')||initializeApp(cfg,'cityPublic'),db=fs.getFirestore(app);
  try{const c=await fs.getDoc(fs.doc(db,'cityConfig','steps'));if(c.exists()){(c.data().steps||[]).forEach(x=>{const s=(window.FTR_CITY_STEPS||[]).find(y=>y.id===x.id);if(s&&x.text)s.text=String(x.text).slice(0,200);});}}catch(e){console.warn('cityConfig',e.code||e.message);}
  fs.onSnapshot(fs.doc(db,'cityConfig','spotlight'),s=>PROG.setSpotlight(s.exists()?s.data():null),e=>console.warn('spotlight',e.code||e.message));
  fs.onSnapshot(fs.query(fs.collection(db,'cityArticles'),fs.where('hidden','==',false)),snap=>{
    PROG.setArticles(snap.docs.map(d=>{const x=d.data();return {id:d.id,name:x.name||'Artikel',image:x.image||'',color:x.color||'#1b1c1a',step:x.step,note:x.note||'',timeline:Array.isArray(x.timeline)?x.timeline:[]};}),false);
  },e=>console.warn('cityArticles',e.code||e.message));
  return true;
}
