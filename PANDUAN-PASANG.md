# Panduan pasang FUCKTHERULES CITY (v3)

Tiga bagian: **kota** (repo `fucktherules-city`), **admin** (repo admin yang sudah ada), **Firebase "city"** (`city-fucktherules`).

## Toko = game toko (v3.1)
- **Masuk toko di kota membuka game toko (`game.fucktherules.my.id`) persis, lengkap 3D, katalog, checkout Midtrans, dan HP**, di lapisan layar penuh dengan tombol **‹ Kota**. Kota berhenti menggambar selama toko terbuka. Tidak ada kode game yang diduplikasi, jadi toko di kota selalu sama dengan game.
- Agar game langsung terbuka tanpa layar intro saat dipanggil dari kota, upload isi `game-main-embed.zip` ke repo game (hanya `game.js`, `style.css`, `index.html` yang berubah; tanpa itu game tetap jalan, hanya intro PLAY tampil dulu).
- Alamat game diatur di `config.js` (`FTR_CITY_LINKS.game`).
- **Cek Resi** (Kantor J&T) dan **Cek Pesanan** (Office) memakai pencarian yang SAMA dengan web utama dan HP di game: ketik **ID order / email / no. HP**, hasilnya daftar pesanan, lalu detail dengan resi dan tombol *Salin resi* / *Lacak di J&T ›* (baru setelah resi ketemu). Cek Pesanan menampilkan timeline lengkap. Data pembeli sudah tersamar dari web utama.
- Pencarian ini membaca `https://fucktherules.my.id/firebase.js` (modul yang sama dengan game). Pastikan **API key Google** project toko mengizinkan `https://city.fucktherules.my.id/*` (Google Cloud Console > Credentials > HTTP referrers), sama seperti yang dulu dilakukan untuk game.

## Mode karakter / non karakter
Di dock kanan, tepat di bawah tombol ⚡, ada tombol berikon orang.
- **Aktif (default):** seperti biasa: karakter, bar status, joystick, bisa kerja dan masuk bangunan.
- **Ikon dicoret = non karakter:** karakter, bar status, dan joystick disembunyikan, kota hanya untuk dilihat-lihat. Geser layar untuk menjelajah; daftar tempat (📍) memindahkan kamera ke tempat itu. Mode 3D di sini berarti kamera orbit (geser untuk memutar).
- Saat memencet kerja, misi, melamar kerja, atau masuk bangunan di mode non karakter, muncul pesan **"Harus pakai mode karakter"** berisi tutorial 3 langkah dan tombol *Aktifkan sekarang*; tombol karakter berkedip 9 detik. Pilihan mode diingat per perangkat. Toko, Cek Resi, Cek Pesanan, Sorotan, galeri, dan Peta Nyata tetap bisa dipakai di kedua mode.

## Apa yang berubah di v3
- **Progres per ARTIKEL**, bukan per order. Gambar asli artikel muncul di atas bangunan tempat artikel itu berada. Kota tidak menampilkan data order, pembeli, atau resi; orang mencari resinya sendiri di situs J&T (tombol Cek Resi) dan kode pesanan di web utama (Cek Pesanan di Office).
- **Upload galeri di gambar asli peta FucktheRules**: ketuk **bangunan** (hitbox) = foto tampil di atas bangunan itu; ketuk **tempat lain** (jalan, taman, mana saja) = titik bebas persis di situ.
- **3D = kamera dari belakang karakter**; geser layar untuk memutar, joystick mengikuti arah kamera.
- UI baru bertema web utama (kertas, tinta, Inter, kuning/lavender), nama kota di atas dihapus, bar status tipis ala GTA, kontrol kecil di HP dan melebar di desktop.

## 1. Firebase city
1. Firestore Database dibuat. Tab **Rules**: tempel isi `firestore.rules` terbaru > **Publish** (WAJIB ulang: koleksi `cityArticles` baru, `cityFeed` dihapus).
2. Authentication: Email/Password aktif, dua akun admin dengan password sama seperti project toko. Authorized domains: `city.fucktherules.my.id`, `admin.fucktherules.my.id`.

## 2. Admin
Timpa isi repo admin dengan `admin-main-kota.zip`. Menu Kota punya dua tab: **Progres Artikel** dan **Galeri Kota**.

## 3. Kota
Upload seluruh isi `fucktherules-city-final.zip` ke repo (file di root). Pages + HTTPS + CNAME seperti sebelumnya. Hard refresh setelah update (service worker `ftr-city-shell-v3-9`).

## 4. Gambar peta untuk upload
- **Di kota:** gambar peta dibuat otomatis dari dunia kota yang sedang tampil. Tidak ada langkah tambahan.
- **Di admin (Upload manual):** admin membuka kota secara tersembunyi (`?mapmsg=1`) dan menerima gambar peta serta hitbox bangunan. Pertama kali dibuka butuh sekitar 10–30 detik (teks "Memuat peta kota…"), dan setelah itu tersimpan selama halaman tidak dimuat ulang. Kota harus sudah online di `city.fucktherules.my.id`.
- **Opsional, lebih cepat:** buka `https://city.fucktherules.my.id/?exportmap=1`, tunggu sekitar 5 detik, lalu upload `city-map.jpg` dan `city-map.json` yang terunduh ke root repo kota. Kalau dua file itu ada, keduanya dipakai lebih dulu (kota dan admin langsung memuatnya).
- Peta sederhana (zona hijau, hanya stadion dan stasiun) hanya muncul kalau semua cara di atas gagal.

## 5. Cloudinary
Cloud `dpkmdjfbt`, preset `gloriam-galeri` (Unsigned). Foto kota masuk folder `fttr-city/`. Galeri web Gloriam tidak terpengaruh.

## 5b. Sorotan toko
Admin > Kota > **Sorotan**: pilih satu artikel (foto otomatis dari thumbnail web utama), pilih keterangan (PRE ORDER, READY STOCK, NEW DROP, SEGERA HADIR, SOLD OUT, atau tulis sendiri), lalu **Tampilkan di kota**. Papan berisi keterangan di atas, foto, dan nama artikel melayang di atas Toko FucktheRules City; ketuk papan untuk membuka kartu dan tombol Masuk toko. Disimpan di `cityConfig/spotlight` (tidak perlu mengubah aturan Firebase).

## 6. Cara kerja progres
- Admin > Kota > Progres Artikel: pilih satu atau banyak artikel, pilih langkah, (opsional catatan), **Kirim update**.
- Hasilnya: (a) timeline semua order PO berbayar yang memuat artikel itu di web utama berubah, (b) gambar artikel pindah ke bangunan langkah itu di kota.
- Artikel baru muncul di kota saat pertama kali diberi langkah. Centang "Tampilkan semua produk" untuk memilih artikel yang belum punya order.
- Resi per order tetap diisi di tab **Pengiriman** (web utama), tidak di sini.
- Gambar artikel diambil dari kolom `thumbnail` produk (dicocokkan lewat nama artikel).

## 7. Uji menyeluruh
1. Admin > Progres Artikel: pilih satu artikel > Masuk vendor > Kirim. Kota: gambar artikel muncul di Vendor. Web utama: timeline order artikel itu berubah.
2. Ulangi dengan Diserahkan ke J&T: gambar pindah ke Kantor J&T. Ketuk bangunan J&T: ada Cek Resi (membuka situs J&T).
3. Kota > Upload Fotomu: pilih foto, ketuk stadion (atau jalan) di peta, GPS, kirim. Admin > Galeri Kota > Setujui. Pin foto muncul di atas stadion.
4. Peta Nyata: gelembung foto > ketuk > Lihat di kota FTR.
5. Mode 2D / 2.5D / 3D (3D: geser layar memutar kamera, joystick maju = menjauhi kamera).

## 8. Masalah umum
| Gejala | Solusi |
|---|---|
| `permission-denied` | Rules belum dipublish ulang, atau email admin tidak ada di `isAdmin()` |
| Gambar artikel hanya ikon kaos | `thumbnail` produk kosong, atau alamat relatif tidak bisa dimuat dari kota (CORS). Pakai alamat gambar penuh (https) |
| Admin: peta upload sederhana | Kota belum online/versi lama, atau memuat lebih dari 60 detik. Muat ulang tab Galeri Kota; atau ekspor `city-map.jpg/json` (langkah 4) |
| Progres Artikel: gambar artikel kosong | Nama artikel di order tidak mirip nama produk. Panel mencocokkan nama persis, tanpa awalan "(Pre Order)", lalu kemiripan kata; ganti nama produk agar mirip jika masih kosong |
| Upload gagal "Upload preset not found" | Preset salah atau tidak Unsigned |
| Pin foto tidak muncul | Foto masih pending, atau tidak ada bangunan terpilih |
| GPS tidak jalan | Situs belum HTTPS atau izin lokasi ditolak |
| Tampilan lama tersangkut | Hard refresh |
| Toko tidak tampil / kosong | Game belum dideploy, atau `FTR_CITY_LINKS.game` salah. Tombol ↗ membuka game di tab baru |
| Cek Resi: "Belum bisa terhubung ke web utama" | Referrer API key belum menyertakan domain kota, atau `firebase.js?v=...` di config tidak sama dengan versi yang dipakai game |
| Popup pembayaran di toko bermasalah di HP | Pembayaran tertentu (deep link e-wallet) kadang lebih lancar di tab penuh: pakai tombol ↗ |
| Kamera 3D menembus gedung | Batas versi ini (belum ada tabrakan kamera); putar atau zoom keluar |

## 9. Keamanan dan batas
- Kunci Firebase dan preset Cloudinary publik; keamanan ada di Rules dan moderasi admin. Data publik kota hanya nama dan gambar artikel, langkah progres, dan foto yang disetujui.
- Batas 5 upload/hari/perangkat hanya di sisi aplikasi. Koordinat pengunjung dibulatkan (~100 m).
- Foto yang dihapus dari galeri tidak terhapus di Cloudinary.
- **Peta nyata = citra satelit Esri + nama tempat** (tombol 🛰️/🗺️ di pojok peta untuk pindah ke peta jalan OpenStreetMap; pilihan diingat). Keduanya server publik tanpa API key, cukup untuk trafik kecil sampai sedang dan atribusi sudah tampil di peta. Untuk trafik besar atau penggunaan komersial berat, Esri meminta akun/API key ArcGIS; bisa diganti ke penyedia lain (MapTiler, Mapbox) dengan mengubah satu fungsi `baseLayers` di `city-upload.js`.
- Zoom satelit di beberapa daerah terpencil lebih rendah dari kota besar; di atas zoom 18 gambar hanya diperbesar.
