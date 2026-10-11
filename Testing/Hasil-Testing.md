# Dokumentasi Pengujian — ClosetGirls Thrift Store

## 1. Tujuan

Memastikan fitur utama aplikasi (registrasi/login, katalog dan pencarian, keranjang, checkout) berjalan sesuai harapan, serta menemukan bug sedini mungkin.

## 2. Ruang lingkup & pendekatan

| Pendekatan | Cakupan | Alat |
|---|---|---|
| **Unit/logic test otomatis** | Logika di `js/`: utilitas, data produk, pencarian & filter, keranjang, validasi auth, checkout | `node:test` bawaan Node.js |
| **Functional test di browser** | Alur pengguna sungguhan: mengetik, mengeklik, berpindah halaman, tampilan ponsel | Chromium (Playwright) |

Test otomatis menjalankan **kode asli** di folder `js/` pada lingkungan browser tiruan (`tests/helpers/env.js`: `localStorage`, `document`, dan elemen palsu). Jadi yang diuji adalah kode yang sama dengan yang dipakai aplikasi, bukan salinan.

**Di luar cakupan:** tampilan visual/CSS, performa, keamanan (aplikasi ini simulasi tanpa backend), dan uji lintas-browser menyeluruh.

## 3. Lingkungan pengujian

| Item | Nilai |
|---|---|
| Node.js (test otomatis) | v24.21.0 |
| Browser (test fungsional) | Google Chrome Version 154.0.8037.98 |
| Perangkat/OS | Axioo HYPE 7 amd x8/Windows 11 |
| Cara menjalankan app | buka `index.html` |

## 4. Menjalankan test otomatis

```bash
npm test
```

### Hasil terakhir

| Testing | Jumlah |
|---|---|
| Total test | 60 |
| Lulus | 58 |
| Gagal | 0 |
| Bug yang diketahui | 2 |

Test dibagi per berkas:

| Berkas | Yang diuji |
|---|---|
| `tests/utils.test.js` | format Rupiah, `getProduct`, `store` (termasuk data rusak) |
| `tests/products.test.js` | id unik, field wajib, kategori valid, file gambar ada |
| `tests/search.test.js` | pencarian, filter kategori, urut harga, favorit |
| `tests/cart.test.js` | tambah, ubah jumlah (min 1, maks 99), hapus, kosongkan, subtotal, badge |
| `tests/auth.test.js` | registrasi, login, validasi form, penjagaan halaman, logout |
| `tests/checkout.test.js` | total + ongkir, validasi alamat/bank, VA per bank, QRIS, simpan pesanan |

## 5. Skenario uji (test case)

Kolom **Otomatis** menunjukkan berkas test otomatis yang juga mencakup skenario tersebut. Kolom **Hasil aktual** berisi hasil pengujian langsung di browser (lihat bagian 3 untuk cara pelaksanaannya).

| ID | Fitur | Langkah | Hasil diharapkan | Otomatis | Hasil aktual | Status |
|---|---|---|---|---|---|---|
| TC-01 | Registrasi | Isi semua data valid, klik Daftar | Akun tersimpan, masuk ke beranda | auth | Setelah klik Daftar, diarahkan ke beranda (home.html). Akun tersimpan (1 akun, email sari@mail.com). Beranda menampilkan 8 produk. | ✅ Lulus |
| TC-02 | Registrasi | Daftar dengan email yang sudah terdaftar | Muncul "Email ini sudah terdaftar" | auth | Muncul pesan error "Email ini sudah terdaftar. Silakan login.". Tetap di halaman registrasi, akun tidak digandakan. | ✅ Lulus |
| TC-03 | Registrasi | Nama < 2 huruf, email salah, telepon "123", sandi < 6, konfirmasi beda | Muncul pesan error sesuai, akun tidak dibuat | auth | Semua kasus ditolak dan tidak ada akun dibuat: nama 1 huruf → "Nama lengkap minimal 2 karakter."; email "bukan-email" → "Masukkan alamat email yang valid."; telepon "123" → "Nomor telepon harus 9–15 digit."; sandi 3 karakter → "Kata sandi minimal 6 karakter."; konfirmasi beda → "Konfirmasi kata sandi tidak sama.". | ✅ Lulus |
| TC-04 | Login | Email/sandi salah | Muncul "Email atau kata sandi salah" | auth | sandi salah → "Email atau kata sandi salah. Belum punya akun? Daftar dulu."; email tidak terdaftar → "Email atau kata sandi salah. Belum punya akun? Daftar dulu.". Tidak ada sesi yang dibuat. | ✅ Lulus |
| TC-05 | Akses halaman | Buka `pages/cart.html` tanpa login | Diarahkan ke halaman login | auth | Membuka cart.html tanpa login langsung dialihkan ke /pages/login.html. | ✅ Lulus |
| TC-06 | Pencarian | Ketik "hoodie" | Hanya produk hoodie tampil | search | Dari 14 produk, mengetik "hoodie" menyisakan 3 produk: Hoodie Oversize Cream, Hoodie Pink Pastel, Hoodie Zip Abu. | ✅ Lulus |
| TC-07 | Pencarian | Ketik kata acak | Muncul "Produk tidak ditemukan" | search | Mengetik "zzzxxyy" menampilkan pesan: "Tidak ada hasil Produk tidak ditemukan. Coba kata kunci atau kategori lain.". | ✅ Lulus |
| TC-08 | Filter/urut | Klik tombol filter berulang | Urutan: Terbaru → Termurah → Termahal | search | Klik filter 3x: "Urutkan: Harga terendah" (harga pertama Rp60.000, terakhir Rp120.000) → "Urutkan: Harga tertinggi" (harga pertama Rp120.000, terakhir Rp60.000) → "Urutkan: Terbaru" (harga pertama Rp85.000, terakhir Rp80.000). Urutan kembali ke awal pada klik ke-3. | ✅ Lulus |
| TC-09 | Keranjang | Tambah produk yang sama 2x | Jumlah jadi 2, badge ikut berubah | cart | Klik "Tambah ke Keranjang" 2x pada produk yang sama: toast "Masuk ke keranjang", badge keranjang menunjukkan 2. Di keranjang hanya ada 1 baris dengan jumlah 2. | ✅ Lulus |
| TC-10 | Keranjang | Kurangi jumlah saat qty 1 | Tetap 1 | cart | Tombol minus ditekan 2x saat jumlah 1: jumlah tetap 1, produk tidak terhapus. | ✅ Lulus |
| TC-11 | Keranjang | Hapus satu produk, lalu kosongkan semua | Item hilang, tampil "Keranjang masih kosong" | cart | Hapus 1 produk: tersisa 1 produk (Blouse Floral Lengan Puff). Klik ikon tempat sampah + konfirmasi OK: tampil "Keranjang masih kosong Yuk, pilih pakaian thrift favoritmu. Lihat katalog", bar total tersembunyi, data keranjang kosong. | ✅ Lulus |
| TC-12 | Checkout | Bayar tanpa alamat / tanpa memilih bank | Muncul peringatan, pesanan tidak dibuat | checkout | tanpa alamat → toast "Tambahkan alamat pengiriman dulu"; ada alamat tapi belum pilih bank → toast "Pilih bank untuk transfer dulu". Tidak ada pesanan tersimpan. | ✅ Lulus |
| TC-13 | Checkout | Data lengkap, Transfer Bank atau QRIS | Pesanan tersimpan, VA/QRIS tampil, keranjang kosong | checkout | Transfer Bank (BCA): subtotal Rp238.000, ongkir Rp10.000, total Rp248.000. Setelah Bayar muncul popup "Pesanan berhasil dibuat Transfer ke Virtual Account BCA 3960 5197 4155 3 Total Rp248.000 (nomor ini hanya simulasi) Kembali ke beranda…". Pesanan tersimpan (1), keranjang kosong. Uji QRIS: popup "Pesanan berhasil dibuat Pembayaran via QRIS sebesar Rp100.000 (simulasi). Kembali ke beranda…". Bukti: `docs/screenshots/tc13-checkout-berhasil.png`. | ✅ Lulus |
| TC-14 | Favorit | Klik ikon hati di detail produk, buka `catalog.html?fav=1` | Produk muncul di daftar favorit | search | Klik ikon hati: toast "Ditambahkan ke favorit". Di catalog.html?fav=1 judul halaman "FAVORIT" dan tampil 1 produk (Blouse Floral Lengan Puff). | ✅ Lulus |
| TC-15 | Logout | Klik logout | Sesi hilang, kembali ke login | auth | Menu "Keluar Akun" membuka halaman konfirmasi ("Yakin ingin keluar?"). Setelah klik Keluar, diarahkan ke login.html dan sesi terhapus. | ✅ Lulus |
| TC-16 | Tampilan | Klik ikon mata di kolom kata sandi | Sandi tampil/tersembunyi bergantian | — | Tipe input sandi berubah password → text → password setiap klik ikon mata (label tombol berubah menjadi "Sembunyikan kata sandi" saat tampil). | ✅ Lulus |
| TC-17 | Detail produk | Buka `product-detail.html?id=9999` | Muncul "Produk tidak ditemukan" | — | Muncul pesan "Produk tidak ditemukan Produk ini mungkin sudah terjual. Kembali ke katalog" dengan tombol "Kembali ke katalog"; tombol Tambah/Beli disembunyikan. | ✅ Lulus |
| TC-18 | Profil | Ubah alamat lewat menu profil, lalu buka checkout | Alamat baru terisi di checkout | — | Alamat diubah lewat menu Alamat (toast "Alamat disimpan"). Di halaman checkout, alamat terisi otomatis: "Jl. Kenanga 5, Medan". | ✅ Lulus |
| TC-19 | Responsif | Buka di ukuran ponsel (375×812) | Tata letak tidak pecah, navigasi bawah terlihat | — | Viewport 375×812 (ukuran ponsel). home: tanpa scroll horizontal, navigasi bawah terlihat; catalog: tanpa scroll horizontal, navigasi bawah terlihat; cart: tanpa scroll horizontal, navigasi bawah terlihat; checkout: tanpa scroll horizontal, navigasi bawah terlihat; profile: tanpa scroll horizontal, navigasi bawah terlihat; product-detail: tanpa scroll horizontal, navigasi bawah terlihat. Bukti: `docs/screenshots/tc19-mobile-beranda.png`. | ✅ Lulus |
| TC-20 | Data | Refresh halaman setelah menambah ke keranjang | Isi keranjang tetap ada | — | Setelah menambah produk lalu me-refresh halaman keranjang, isi keranjang tetap ada (1 produk: Tunik Hitam Etnik Tali). | ✅ Lulus |
| TC-21 | Registrasi (kasus tepi) | Daftar dengan telepon 16 digit `1234567890123456` | Ditolak karena melebihi 15 digit | — | telepon 16 digit "1234567890123456" DITERIMA: akun terbuat dan langsung masuk ke beranda tanpa pesan error (harusnya ditolak). → **BUG-01**. | ❌ Gagal |
| TC-22 | Registrasi (kasus tepi) | Daftar dengan telepon `---------` | Ditolak karena bukan nomor telepon | — | telepon "---------" DITERIMA: akun terbuat dan langsung masuk ke beranda tanpa pesan error (harusnya ditolak). → **BUG-02**. | ❌ Gagal |

Keterangan status: ✅ lulus · ❌ gagal. Ringkasan: **20 dari 22 skenario lulus; 2 gagal (TC-21 dan TC-22) dan keduanya adalah bug yang sama dengan BUG-01 dan BUG-02.**

Untuk mengulang pengujian sendiri: buka aplikasi di browser, ikuti kolom "Langkah", dan bandingkan dengan "Hasil diharapkan". Untuk memulai dari data kosong, hapus data lewat DevTools → Application → Local Storage → Clear. Tangkapan layar bukti ada di `docs/screenshots/`.

## 6. Temuan bug

| ID | Lokasi | Deskripsi | Dampak | Status |
|---|---|---|---|---|
| BUG-01 | `js/auth.js` (`initRegister`) | Pesan menyebut "9–15 digit", tetapi regex `/^[0-9+\s-]{9,16}$/` menerima hingga **16 karakter** | Nomor 16 digit lolos validasi (terbukti di browser, TC-21) | Terbuka |
| BUG-02 | `js/auth.js` (`initRegister`) | Regex mengizinkan `+`, spasi, dan `-` di mana saja, sehingga `---------` dianggap nomor telepon valid | Nomor tidak bermakna lolos validasi (terbukti di browser, TC-22) | Terbuka |

Kedua bug sudah direpresentasikan oleh test di `tests/auth.test.js` yang ditandai `{ todo: 'BUG-01' }` dan `{ todo: 'BUG-02' }`. Test tersebut saat ini *gagal sesuai harapan* tanpa menggagalkan seluruh rangkaian test.

**Saran perbaikan:** wajibkan nomor diawali `+` opsional lalu angka, dan hitung jumlah **digit** saja, misalnya:

```js
const digits = phone.replace(/\D/g, '');
if (!/^\+?[0-9\s-]+$/.test(phone) || digits.length < 9 || digits.length > 15) { /* tolak */ }
```


## 7. Batasan yang diketahui (bukan bug testing)

- Kata sandi tersimpan sebagai teks biasa di `localStorage` (ada catatan di `js/auth.js`; ini simulasi).
- Nomor Virtual Account dan QRIS hanya simulasi, tidak terhubung ke bank.
- Tidak ada stok produk, jadi produk yang sama bisa dibeli tanpa batas.

## 8. Kesimpulan

Dari **22 skenario** yang diuji langsung di browser, **20 lulus dan 2 gagal** (TC-21 dan TC-22). Kedua kegagalan itu berasal dari bug yang sama dengan yang ditemukan test otomatis, yaitu validasi nomor telepon yang terlalu longgar (BUG-01 dan BUG-02). Test otomatis menjalankan **60 test: 58 lulus, 0 gagal, 2 `todo`** untuk bug tersebut.

Fitur utama (registrasi, login/logout, penjagaan halaman, katalog, pencarian, favorit, keranjang, checkout dengan Transfer Bank dan QRIS, profil) berfungsi sesuai spesifikasi. Tidak ditemukan error JavaScript di console selama pengujian, dan tampilan pada lebar ponsel 375 px tidak memiliki scroll horizontal dengan navigasi bawah selalu terlihat.

**Tindak lanjut:** perbaiki validasi telepon di `js/auth.js` (lihat saran di bagian 6), lalu hapus opsi `{ todo }` pada dua test terkait agar menjadi syarat wajib lulus.
