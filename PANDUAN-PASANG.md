# Panduan pasang FUCKTHERULES CITY (v3)

Tiga bagian: **kota** (repo `fucktherules-city`), **admin** (repo admin yang sudah ada), **Firebase "city"** (`city-fucktherules`).

## Apa yang berubah di v3
- **Progres per ARTIKEL**, bukan per order. Gambar asli artikel muncul di atas bangunan tempat artikel itu berada. Kota tidak menampilkan data order, pembeli, atau resi; orang mencari resinya sendiri di situs J&T (tombol Cek Resi) dan kode pesanan di web utama (Cek Pesanan di Office).
- **Upload galeri memilih BANGUNAN** di gambar asli peta FucktheRules (tiap bangunan punya hitbox). Foto tampil di atas bangunan itu.
- **3D = kamera dari belakang karakter**; geser layar untuk memutar, joystick mengikuti arah kamera.
- UI baru bertema web utama (kertas, tinta, Inter, kuning/lavender), nama kota di atas dihapus, bar status tipis ala GTA, kontrol kecil di HP dan melebar di desktop.

## 1. Firebase city
1. Firestore Database dibuat. Tab **Rules**: tempel isi `firestore.rules` terbaru > **Publish** (WAJIB ulang: koleksi `cityArticles` baru, `cityFeed` dihapus).
2. Authentication: Email/Password aktif, dua akun admin dengan password sama seperti project toko. Authorized domains: `city.fucktherules.my.id`, `admin.fucktherules.my.id`.

## 2. Admin
Timpa isi repo admin dengan `admin-main-kota.zip`. Menu Kota punya dua tab: **Progres Artikel** dan **Galeri Kota**.

## 3. Kota
Upload seluruh isi `fucktherules-city-final.zip` ke repo (file di root). Pages + HTTPS + CNAME seperti sebelumnya. Hard refresh setelah update (service worker `ftr-city-shell-v3-1`).

## 4. Ekspor gambar peta (sekali, setelah kota online)
1. Buka `https://city.fucktherules.my.id/?exportmap=1` di **laptop atau HP**, tunggu sekitar 5 detik. Dua file terunduh: `city-map.jpg` dan `city-map.json`.
2. Upload keduanya ke root repo `fucktherules-city`.
3. Ulangi kapan pun tata letak kota berubah.
Tanpa dua file ini, kota tetap jalan (membuat gambar peta langsung dari dunia yang sedang tampil, agak lebih berat), tetapi **admin** hanya punya peta sederhana dan hanya bisa memilih stadion dan stasiun.

## 5. Cloudinary
Cloud `dpkmdjfbt`, preset `gloriam-galeri` (Unsigned). Foto kota masuk folder `fttr-city/`. Galeri web Gloriam tidak terpengaruh.

## 6. Cara kerja progres
- Admin > Kota > Progres Artikel: pilih satu atau banyak artikel, pilih langkah, (opsional catatan), **Kirim update**.
- Hasilnya: (a) timeline semua order PO berbayar yang memuat artikel itu di web utama berubah, (b) gambar artikel pindah ke bangunan langkah itu di kota.
- Artikel baru muncul di kota saat pertama kali diberi langkah. Centang "Tampilkan semua produk" untuk memilih artikel yang belum punya order.
- Resi per order tetap diisi di tab **Pengiriman** (web utama), tidak di sini.
- Gambar artikel diambil dari kolom `thumbnail` produk (dicocokkan lewat nama artikel).

## 7. Uji menyeluruh
1. Admin > Progres Artikel: pilih satu artikel > Masuk vendor > Kirim. Kota: gambar artikel muncul di Vendor. Web utama: timeline order artikel itu berubah.
2. Ulangi dengan Diserahkan ke J&T: gambar pindah ke Kantor J&T. Ketuk bangunan J&T: ada Cek Resi (membuka situs J&T).
3. Kota > Upload Fotomu: pilih foto, ketuk stadion di peta, GPS, kirim. Admin > Galeri Kota > Setujui. Pin foto muncul di atas stadion.
4. Peta Nyata: gelembung foto > ketuk > Lihat di kota FTR.
5. Mode 2D / 2.5D / 3D (3D: geser layar memutar kamera, joystick maju = menjauhi kamera).

## 8. Masalah umum
| Gejala | Solusi |
|---|---|
| `permission-denied` | Rules belum dipublish ulang, atau email admin tidak ada di `isAdmin()` |
| Gambar artikel hanya ikon kaos | `thumbnail` produk kosong, atau alamat relatif tidak bisa dimuat dari kota (CORS). Pakai alamat gambar penuh (https) |
| Admin: peta upload sederhana | `city-map.jpg/json` belum diupload ke repo kota (langkah 4) |
| Upload gagal "Upload preset not found" | Preset salah atau tidak Unsigned |
| Pin foto tidak muncul | Foto masih pending, atau tidak ada bangunan terpilih |
| GPS tidak jalan | Situs belum HTTPS atau izin lokasi ditolak |
| Tampilan lama tersangkut | Hard refresh |
| Kamera 3D menembus gedung | Batas versi ini (belum ada tabrakan kamera); putar atau zoom keluar |

## 9. Keamanan dan batas
- Kunci Firebase dan preset Cloudinary publik; keamanan ada di Rules dan moderasi admin. Data publik kota hanya nama dan gambar artikel, langkah progres, dan foto yang disetujui.
- Batas 5 upload/hari/perangkat hanya di sisi aplikasi. Koordinat pengunjung dibulatkan (~100 m).
- Foto yang dihapus dari galeri tidak terhapus di Cloudinary.
- **Peta nyata = citra satelit Esri + nama tempat** (tombol 🛰️/🗺️ di pojok peta untuk pindah ke peta jalan OpenStreetMap; pilihan diingat). Keduanya server publik tanpa API key, cukup untuk trafik kecil sampai sedang dan atribusi sudah tampil di peta. Untuk trafik besar atau penggunaan komersial berat, Esri meminta akun/API key ArcGIS; bisa diganti ke penyedia lain (MapTiler, Mapbox) dengan mengubah satu fungsi `baseLayers` di `city-upload.js`.
- Zoom satelit di beberapa daerah terpencil lebih rendah dari kota besar; di atas zoom 18 gambar hanya diperbesar.
