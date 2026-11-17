# FTTR City — implementasi UI/UX dan galeri bangunan

## Yang diubah
- HUD monokrom hitam/putih mengikuti karakter visual website utama; nama distrik di header disembunyikan tanpa menghapus state distrik yang dipakai sistem multiplayer.
- Kamera default diturunkan dan dipusatkan di belakang karakter agar jalan terbaca dari foreground menuju depan. Kontrol kamera/zoom yang sudah ada tetap dipertahankan.
- HUD dan kontrol menggunakan ukuran adaptif untuk layar ponsel dan desktop.
- Update artikel mengambil katalog `produk` dan thumbnail `thumbnail` dari Firebase website utama (`fvcktherules-store`). Data yang dibaca hanya katalog dan `poUpdates/{produkId}/items`; tidak membaca daftar order atau nomor resi pelanggan.
- Setiap artikel yang punya update mendapat satu ikon di lokasi J&T. Ikon menggunakan thumbnail produk asli dari website utama, bukan ilustrasi kaos buatan. Kartu update juga menampilkan thumbnail, nama artikel, status, dan J&T Express.
- Galeri upload memakai koordinat layout kota FTTR. Peta kanvas menampilkan grid jalan dan marker bangunan dari objek bangunan aktual. Setiap marker/area bangunan dapat dipilih; titik akan snap ke hitbox stadion/toko/bangunan terdekat dan menyimpan `placeId`.
- Pin foto di dalam dunia ditempatkan di atas tinggi bangunan yang dipilih, termasuk stadion.

## Yang tidak diubah
- Repository/website utama `fucktherules.my.id` tidak diubah.
- Struktur order, data pembeli, resi, pembayaran, dan Firestore rules toko tidak diubah.
- Persetujuan foto galeri tetap melalui admin kota seperti sebelumnya.

## Instalasi
Ganti isi repository FTTR City dengan isi ZIP ini, commit, lalu deploy melalui alur hosting City yang sekarang. Jangan pasang file ZIP ini ke repository website utama. Setelah deploy, lakukan hard refresh atau tutup-buka ulang PWA agar service worker baru terpasang.

## Catatan integrasi
- City membaca data produk publik dan update per artikel dari Firebase toko. Aturan Firestore toko yang ada sudah menyediakan read publik untuk `produk` dan `poUpdates/{pid}/items`.
- Agar thumbnail tampil, produk di katalog toko perlu memiliki field `thumbnail` berupa URL HTTPS.
- Status "Sudah diserahkan ke J&T" muncul setelah admin menyimpan dokumen `shipment-photo` untuk artikel terkait. Foto bukti tidak ditampilkan di City; yang ditampilkan adalah thumbnail produk asli.
- Pengujian yang dilakukan di paket: pemeriksaan sintaks JavaScript dan integritas ZIP. Belum dilakukan deploy/live browser test terhadap Firebase/hosting.
