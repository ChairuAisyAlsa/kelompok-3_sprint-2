# ClosetGirls Thrift Store

Aplikasi web toko pakaian thrift berbasis **HTML, CSS, dan JavaScript murni** (tanpa framework dan tanpa backend). Seluruh data pengguna, keranjang, favorit, dan pesanan disimpan di `localStorage` browser sebagai **simulasi**.



## Fitur

- Registrasi, login, logout, dan sesi pengguna
- Beranda, katalog produk, pencarian, filter kategori, dan urut harga
- Detail produk dan daftar favorit
- Keranjang belanja (tambah, ubah jumlah, hapus, kosongkan)
- Checkout dengan alamat pengiriman, Transfer Bank (Virtual Account simulasi), dan QRIS
- Halaman profil

## Menjalankan aplikasi

Cara termudah: buka `index.html` di browser. 

Alur awal: **Daftar akun → Login → Pilih produk → Keranjang → Checkout**.

## Menjalankan test

Butuh [Node.js](https://nodejs.org) 20 atau lebih baru. Tidak ada dependensi yang perlu di-install.

```bash
npm test                 # ringkas
npm run test:report      # tampilan detail per test
```

Detail rencana dan hasil pengujian ada di [`TESTING`](kelompok-3_sprint-2/testing).

## Struktur proyek

```
.
├── index.html            # gerbang awal (arahkan ke login/beranda)
├── pages/                # halaman: login, register, home, catalog, cart, checkout, ...
├── css/                  # main.css, components.css, auth.css
├── js/
│   ├── app.js            # inisialisasi + utilitas bersama
│   ├── auth.js           # login, registrasi, sesi, profil
│   ├── cart.js           # keranjang & checkout
│   ├── search.js         # pencarian, filter, urutan
│   ├── navigation.js     # ikon & navigasi bawah
│   └── data/products.js  # data produk
├── assets/               # gambar produk, ikon, logo
```

