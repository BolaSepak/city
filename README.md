# FUCKTHERULES CITY (repo `fucktherules-city`)

Kota virtual FucktheRules: pantau progres pesanan, jelajahi kota, dan lihat galeri teman-teman.
Salinan dari FTTR-CITY-V36 dengan branding FucktheRules. Semua file di root (tanpa folder).

## Status pengerjaan (v3: progres per artikel, pemilih bangunan, kamera 3D belakang, UI baru)
- [x] Tahap 1: fondasi, branding, `config.js` baru
- [x] Tahap 2: bangunan Vendor + Kantor J&T, HQ jadi Office FTR, ikon baju (data contoh), Cek Resi / Cek Pesanan (`city-progress.js`)
- [x] Tahap 3: tab admin "Progres" (tulis ke timeline toko + kota). Kota membaca `cityFeed` lewat `city-feed.js`; `firestore.rules` untuk project city
- [x] Tahap 4: upload foto (tekan peta kota + lokasi asli), moderasi, pin foto di kota, tab admin "Galeri"
- [x] Tahap 5: Peta Nyata (gelembung foto ala Instagram Map, cluster, kartu detail, lompat ke kota)
- [x] Tahap 6: mode 2D / 2.5D / 3D + kualitas ringan
- [x] Tahap 7: pengujian dan deploy (lihat `PANDUAN-PASANG.md`)

## Pasang (GitHub Pages)
1. Buat repo baru `fucktherules-city`, upload seluruh isi, Pages -> branch `main` / root.
2. `CNAME` berisi `city.fucktherules.my.id`; DNS: CNAME `city` -> `<username>.github.io`.
3. Isi `window.FTR_CITY_FIREBASE` di `config.js` setelah project Firebase "city" dibuat.

## Konfigurasi (`config.js`)
- `FTR_CITY_FIREBASE`: project Firebase khusus kota (terpisah dari toko).
- `FTR_CITY_CLOUDINARY`: cloud + preset galeri Gloriam, folder `fttr-city`.
- `FTR_CITY_STEPS`: tujuh langkah progres beserta posisinya di kota.
- `FTTR_CITY_API`: backend chat/online opsional (`server.js`, lihat `ONLINE-BACKEND.md`). Kosong = mode solo.

Catatan lama V36 (gameplay, HUD, pekerjaan, pertanian) ada di riwayat repo asalnya; kodenya tetap sama.
