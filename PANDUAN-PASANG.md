# Panduan pasang FUCKTHERULES CITY

Tiga bagian: **kota** (repo `fucktherules-city`), **admin** (repo admin yang sudah ada), dan **Firebase "city"** (`city-fucktherules`).

## 1. Firebase city (sekali saja)
1. Firebase Console > project `city-fucktherules` > **Firestore Database** > Create database (mode production, region terdekat).
2. Tab **Rules**: tempel isi `firestore.rules` (di repo kota) > **Publish**.
3. **Authentication** > Sign-in method > aktifkan **Email/Password**. Tab Users > Add user: dua email admin (`diasadhityap@gmail.com`, `fvcktherules3404@gmail.com`) dengan password SAMA seperti di project toko.
4. Authentication > Settings > **Authorized domains**: tambah `city.fucktherules.my.id`, `admin.fucktherules.my.id`, dan `<username>.github.io` bila perlu.
5. Tidak perlu membuat koleksi manual. `cityFeed`, `cityConfig`, `cityGallery` terbentuk saat pertama ditulis.

## 2. Admin
1. Upload isi `admin-main-kota.zip` ke repo admin (timpa file lama). Domain tetap `admin.fucktherules.my.id`.
2. Login seperti biasa. Menu hamburger > **Kota** > tab **Progres** dan **Galeri Kota**.
3. Jika muncul "Belum tersambung: Kota", akun di project city belum dibuat (langkah 1.3) atau passwordnya berbeda.

## 3. Kota
1. Buat repo `fucktherules-city`, upload seluruh isi zip (semua file di root).
2. Settings > Pages > branch `main`, folder `/ (root)`. Custom domain `city.fucktherules.my.id` (file `CNAME` sudah ada).
3. DNS: record CNAME `city` mengarah ke `<username>.github.io`. Centang Enforce HTTPS (wajib agar GPS bekerja).
4. Buka kota. Selama `cityFeed` kosong, kota menampilkan ikon baju kosong; data contoh hanya tampil bila `config.js` tidak punya `projectId`.

## 4. Cloudinary
- Cloud `dpkmdjfbt`, preset `gloriam-galeri` (Settings > Upload > Upload presets). Pastikan **Signing mode: Unsigned**.
- Foto kota masuk folder `fttr-city/` dan bertag `fttr-city`. Jika preset punya folder tetap, folder dari aplikasi diabaikan (tidak merusak).
- Galeri web Gloriam tidak terpengaruh: ia membaca Firestore `gloriam-store`, bukan Cloudinary.

## 5. Uji menyeluruh (urut)
1. Admin > Kota > Progres > **Sinkronkan ke kota**. Harap muncul "N order disalin".
2. Buka kota (hard refresh): ikon baju muncul di atas Toko/J&T.
3. Pilih satu order PO > langkah **Masuk vendor** > Kirim update. Cek: (a) ikon pindah ke Vendor, (b) halaman Cek Pesanan web utama menampilkan kalimat baru.
4. Langkah **Diserahkan ke J&T** dengan nomor resi. Cek: ikon di Kantor J&T, tombol Cek Resi menyalin resi dan membuka J&T, dan Cek Resi web utama.
5. Di kota: Office FucktheRules > Cek Pesanan > masukkan kode order.
6. HP: Upload Fotomu > foto, ketuk peta kota, pakai GPS, kirim. Di Admin > Galeri Kota harus muncul di Antrean.
7. Setujui. Pin foto muncul di kota dan gelembung di Peta Nyata. Ketuk > Lihat di kota FTR.
8. Admin > Galeri Kota > Upload manual: foto dari IG dengan username dan lokasi. Langsung tampil.
9. Coba mode 2D / 2.5D / 3D dan tombol Ringan di HP.

## 6. Masalah umum
| Gejala | Penyebab / solusi |
|---|---|
| `permission-denied` saat kirim update | Rules belum dipublish, atau email admin tidak ada di `isAdmin()` |
| "belum disinkronkan di Pengiriman" | Order belum punya dokumen `lacak`; pakai tombol SINKRONKAN di tab Pengiriman admin dulu |
| Upload foto gagal "Upload preset not found" | Nama preset salah atau tidak Unsigned |
| Pin foto tidak muncul di kota | Foto masih pending, atau `cityX/cityZ` kosong |
| Peta nyata kosong | Tidak ada foto approved yang punya lokasi asli |
| GPS tidak jalan | Situs belum HTTPS atau izin lokasi ditolak browser |
| Tampilan lama tersangkut | Hard refresh; service worker memakai cache `ftr-city-shell-v2-6` |
| Error index Firestore | Tidak seharusnya terjadi (query galeri tanpa orderBy); bila muncul, klik tautan di console untuk membuat index |

## 7. Keamanan dan batas
- Kunci Firebase dan preset Cloudinary memang publik di aplikasi web; keamanan ada di **Rules** (publik hanya bisa membuat foto pending dengan field terbatas) dan di moderasi admin.
- Batas 5 upload/hari per perangkat hanya di sisi aplikasi (bisa dilewati orang yang paham teknis). Moderasi admin adalah pengaman utamanya.
- Koordinat pengunjung dibulatkan (~100 m). Data pembeli di kota hanya inisial.
- Foto yang dihapus dari galeri tidak otomatis terhapus di Cloudinary.
- Peta nyata memakai server publik OpenStreetMap (tile dan pencarian). Jika trafik besar, ganti ke penyedia tile berbayar.
