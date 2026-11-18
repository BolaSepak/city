/* Konfigurasi tunggal FUCKTHERULES CITY. Tidak ada rahasia di sini (semua nilai publik). */
window.FTTR_CITY_API = '';   /* opsional: backend chat/online (server.js). Kosong = mode solo */

/* Firebase "city" (project baru, terpisah dari toko). Isi dari Firebase Console > Project settings > Web app. */
window.FTR_CITY_FIREBASE = {
  apiKey: 'AIzaSyDphf7cMy_Qlbjfr3kzmWtvhq13vvzwKUw',
  authDomain: 'city-fucktherules.firebaseapp.com',
  projectId: 'city-fucktherules',
  storageBucket: 'city-fucktherules.firebasestorage.app',
  messagingSenderId: '143997546650',
  appId: '1:143997546650:web:ecc8c22ad98446bc18ef23'
};

/* Cloudinary: memakai cloud + preset galeri Gloriam, dipisah lewat folder. */
window.FTR_CITY_CLOUDINARY = {
  cloud: 'dpkmdjfbt',
  preset: 'gloriam-galeri',
  folder: 'fttr-city'
};

/* Toko utama (tautan "Ke Toko") dan pelacakan J&T (tombol Cek Resi). */
window.FTR_CITY_LINKS = {
  store: 'https://fucktherules.my.id',
  jntTrack: 'https://jet.co.id/track'
};

/* Langkah progres (teks default; nanti bisa diedit admin lewat cityConfig). Posisi = bangunan di kota. */
window.FTR_CITY_STEPS = [
  { id: 'received', label: 'Pesanan diterima',  at: 'shop',    text: 'Pesananmu mendarat di markas FTR. Kami mulai bergerak.' },
  { id: 'vendor', label: 'Masuk vendor',    at: 'vendor',  text: 'Desainmu sudah di tangan vendor. Mesin sablon mulai menyala.' },
  { id: 'producing', label: 'Produksi', at: 'vendor',  text: 'Kain dipotong, sablon naik. Kaosmu lagi dibentuk.' },
  { id: 'done', label: 'Kaos jadi',      at: 'vendor',  text: 'Lolos pemeriksaan kualitas. Kaosmu siap tampil.' },
  { id: 'packed', label: 'Dikemas',    at: 'office',  text: 'Dibungkus rapi, tinggal berangkat.' },
  { id: 'jnt', label: 'Diserahkan ke J&T',       at: 'jnt',     text: 'Paket sudah di tangan J&T. Perjalanan dimulai.' },
  { id: 'arrived', label: 'Sampai tujuan',   at: 'home',    text: 'Paket mendarat di rumahmu. Kaos ini resmi jadi milikmu.' }
];
