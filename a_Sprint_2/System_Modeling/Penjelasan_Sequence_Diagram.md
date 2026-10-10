# PENJELASAN SEQUENCE DIAGRAM
## ClosetGirls ThriftShop

## 1. Pendahuluan

Sequence Diagram merupakan diagram yang digunakan untuk menggambarkan urutan interaksi antara pengguna, halaman sistem, sistem, dan database dalam menjalankan suatu fitur.

Pada proyek ClosetGirls ThriftShop, Sequence Diagram digunakan untuk menjelaskan alur kerja fitur-fitur utama sistem mulai dari proses login hingga pengguna keluar dari akun.

## 2. Tujuan Sequence Diagram

Tujuan pembuatan Sequence Diagram pada proyek ClosetGirls ThriftShop adalah:

1. Menggambarkan urutan interaksi antara pengguna dan sistem.
2. Menjelaskan proses yang terjadi pada setiap fitur.
3. Mempermudah anggota kelompok memahami alur kerja sistem.
4. Menjadi acuan dalam proses pengembangan dan pengujian sistem.

---

# 3. Sequence Diagram Login

## Pengertian

Sequence Diagram Login menggambarkan proses ketika pengguna memasukkan email dan kata sandi untuk masuk ke dalam sistem ClosetGirls ThriftShop.

## Diagram

```mermaid
sequenceDiagram
    actor Pengguna
    participant Login as Halaman Login
    participant Sistem
    participant DB as Database

    Pengguna->>Login: Membuka halaman Login
    Pengguna->>Login: Memasukkan email dan kata sandi
    Pengguna->>Login: Menekan tombol Login
    Login->>Sistem: Mengirim data login
    Sistem->>DB: Memeriksa data akun
    DB-->>Sistem: Mengirim hasil pemeriksaan

    alt Data valid
        Sistem-->>Login: Login berhasil
        Login-->>Pengguna: Menampilkan halaman Beranda
    else Data tidak valid
        Sistem-->>Login: Login gagal
        Login-->>Pengguna: Menampilkan pesan kesalahan
    end
```

## Penjelasan Proses

1. Pengguna membuka halaman Login.
2. Pengguna memasukkan email dan kata sandi.
3. Pengguna menekan tombol Login.
4. Sistem memeriksa data akun melalui database.
5. Jika data valid, pengguna diarahkan ke halaman Beranda.
6. Jika data tidak valid, sistem menampilkan pesan kesalahan.

---

# 4. Sequence Diagram Registrasi

## Pengertian

Sequence Diagram Registrasi menggambarkan proses pembuatan akun baru oleh pengguna agar dapat menggunakan sistem ClosetGirls ThriftShop.

## Diagram

```mermaid
sequenceDiagram
    actor Pengguna
    participant Reg as Halaman Registrasi
    participant Sistem
    participant DB as Database

    Pengguna->>Reg: Membuka halaman Registrasi
    Pengguna->>Reg: Mengisi data akun
    Pengguna->>Reg: Menekan tombol Registrasi
    Reg->>Sistem: Mengirim data registrasi
    Sistem->>Sistem: Memvalidasi data
    Sistem->>DB: Memeriksa akun terdaftar
    DB-->>Sistem: Mengirim hasil pemeriksaan

    alt Data valid dan akun belum terdaftar
        Sistem->>DB: Menyimpan data akun
        DB-->>Sistem: Konfirmasi penyimpanan
        Sistem-->>Reg: Registrasi berhasil
        Reg-->>Pengguna: Menampilkan pesan berhasil
    else Data tidak valid atau akun sudah terdaftar
        Sistem-->>Reg: Registrasi gagal
        Reg-->>Pengguna: Menampilkan pesan kesalahan
    end
```

## Penjelasan Proses

1. Pengguna membuka halaman Registrasi.
2. Pengguna mengisi data akun.
3. Sistem memvalidasi data dan memeriksa apakah akun sudah terdaftar.
4. Jika data valid, sistem menyimpan akun ke database.
5. Sistem menampilkan hasil registrasi kepada pengguna.

---

# 5. Sequence Diagram Beranda

## Pengertian

Sequence Diagram Beranda menggambarkan proses ketika pengguna membuka halaman utama ClosetGirls ThriftShop untuk melihat kategori dan produk yang tersedia.

## Diagram

```mermaid
sequenceDiagram
    actor Pengguna
    participant Beranda as Halaman Beranda
    participant Sistem
    participant DB as Database

    Pengguna->>Beranda: Membuka halaman Beranda
    Beranda->>Sistem: Meminta data kategori dan produk
    Sistem->>DB: Mengambil kategori dan produk
    DB-->>Sistem: Mengirim data
    Sistem-->>Beranda: Mengirim data Beranda
    Beranda-->>Pengguna: Menampilkan kategori dan produk
```

## Penjelasan Proses

1. Pengguna membuka halaman Beranda.
2. Sistem meminta data kategori dan produk dari database.
3. Database mengirimkan data yang tersedia.
4. Sistem mengirimkan data ke halaman Beranda.
5. Halaman Beranda menampilkan kategori dan produk kepada pengguna.

---

# 6. Sequence Diagram Pencarian Produk

## Pengertian

Sequence Diagram Pencarian Produk menggambarkan proses ketika pengguna mencari produk berdasarkan kata kunci tertentu.

## Diagram

```mermaid
sequenceDiagram
    actor Pembeli
    participant Search as Halaman Pencarian
    participant Sistem
    participant DB as Database

    Pembeli->>Search: Membuka fitur Pencarian
    Pembeli->>Search: Memasukkan kata kunci
    Search->>Sistem: Mengirim kata kunci
    Sistem->>DB: Mencari produk yang sesuai
    DB-->>Sistem: Mengirim hasil pencarian
    Sistem-->>Search: Mengirim daftar produk
    Search-->>Pembeli: Menampilkan hasil pencarian
```

## Penjelasan Proses

1. Pembeli membuka fitur Pencarian Produk.
2. Pembeli memasukkan kata kunci.
3. Sistem mencari produk yang sesuai melalui database.
4. Database mengirimkan hasil pencarian.
5. Sistem menampilkan hasil pencarian kepada pembeli.

---

# 7. Sequence Diagram Katalog

## Pengertian

Sequence Diagram Katalog menggambarkan proses ketika pembeli membuka katalog untuk melihat daftar produk yang tersedia.

## Diagram

```mermaid
sequenceDiagram
    actor Pembeli
    participant Katalog as Halaman Katalog
    participant Sistem
    participant DB as Database

    Pembeli->>Katalog: Membuka halaman Katalog
    Pembeli->>Katalog: Memilih kategori produk
    Katalog->>Sistem: Meminta daftar produk
    Sistem->>DB: Mengambil data produk
    DB-->>Sistem: Mengirim daftar produk
    Sistem-->>Katalog: Mengirim data katalog
    Katalog-->>Pembeli: Menampilkan produk
```

## Penjelasan Proses

1. Pembeli membuka halaman Katalog.
2. Pembeli memilih kategori produk.
3. Sistem mengambil data produk dari database.
4. Database mengirimkan daftar produk.
5. Halaman Katalog menampilkan produk kepada pembeli.

---

# 8. Sequence Diagram Detail Produk

## Pengertian

Sequence Diagram Detail Produk menggambarkan proses ketika pembeli memilih produk untuk melihat informasi lengkap produk tersebut.

## Diagram

```mermaid
sequenceDiagram
    actor Pembeli
    participant Katalog as Halaman Katalog
    participant Sistem
    participant DB as Database

    Pembeli->>Katalog: Memilih produk
    Katalog->>Sistem: Meminta detail produk
    Sistem->>DB: Mengambil data produk
    DB-->>Sistem: Mengirim detail produk
    Sistem-->>Katalog: Mengirim informasi produk
    Katalog-->>Pembeli: Menampilkan detail produk
```

## Penjelasan Proses

1. Pembeli memilih salah satu produk dari katalog.
2. Halaman Katalog meminta detail produk kepada sistem.
3. Sistem mengambil data produk dari database.
4. Database mengirimkan data produk.
5. Sistem mengirimkan informasi produk ke halaman Katalog.
6. Pembeli melihat detail produk.

## Informasi Produk

Informasi produk dapat mencakup:

- Foto produk
- Nama produk
- Harga
- Kategori
- Ukuran
- Kondisi
- Deskripsi
- Stok

---

# 9. Sequence Diagram Keranjang

## Pengertian

Sequence Diagram Keranjang menggambarkan proses ketika pembeli menambahkan produk ke keranjang dan melihat produk yang telah dipilih.

## Diagram

```mermaid
sequenceDiagram
    actor Pembeli
    participant Produk as Halaman Produk
    participant Keranjang as Halaman Keranjang
    participant Sistem
    participant DB as Database

    Pembeli->>Produk: Memilih Tambah ke Keranjang
    Produk->>Sistem: Mengirim data produk
    Sistem->>DB: Menyimpan data keranjang
    DB-->>Sistem: Konfirmasi penyimpanan
    Sistem-->>Produk: Mengirim hasil proses
    Produk-->>Pembeli: Menampilkan konfirmasi

    Pembeli->>Keranjang: Membuka Keranjang
    Keranjang->>Sistem: Meminta data keranjang
    Sistem->>DB: Mengambil data keranjang
    DB-->>Sistem: Mengirim data keranjang
    Sistem-->>Keranjang: Mengirim daftar produk
    Keranjang-->>Pembeli: Menampilkan isi keranjang
```

## Penjelasan Proses

1. Pembeli memilih produk yang ingin dimasukkan ke keranjang.
2. Sistem menerima data produk.
3. Sistem menyimpan data keranjang.
4. Sistem memberikan konfirmasi kepada pembeli.
5. Pembeli membuka halaman Keranjang.
6. Sistem mengambil data keranjang dari database.
7. Halaman Keranjang menampilkan produk yang telah dipilih.

---

# 10. Sequence Diagram Checkout

## Pengertian

Sequence Diagram Checkout menggambarkan proses ketika pembeli melanjutkan produk yang ada di keranjang ke tahap checkout.

## Diagram

```mermaid
sequenceDiagram
    actor Pembeli
    participant Checkout as Halaman Checkout
    participant Sistem
    participant DB as Database

    Pembeli->>Checkout: Membuka halaman Checkout
    Checkout->>Sistem: Meminta data keranjang
    Sistem->>DB: Mengambil data produk
    DB-->>Sistem: Mengirim data produk
    Sistem-->>Checkout: Mengirim ringkasan pesanan
    Checkout-->>Pembeli: Menampilkan ringkasan pesanan

    Pembeli->>Checkout: Mengonfirmasi pesanan
    Checkout->>Sistem: Mengirim data pesanan
    Sistem->>DB: Menyimpan data pesanan
    DB-->>Sistem: Konfirmasi penyimpanan
    Sistem-->>Checkout: Mengirim hasil checkout
    Checkout-->>Pembeli: Menampilkan hasil checkout
```

## Penjelasan Proses

1. Pembeli membuka halaman Checkout.
2. Sistem mengambil data produk dari keranjang.
3. Halaman Checkout menampilkan ringkasan pesanan.
4. Pembeli melakukan konfirmasi pesanan.
5. Sistem menyimpan data pesanan ke database.
6. Sistem menampilkan hasil checkout kepada pembeli.

---

# 11. Sequence Diagram Profil

## Pengertian

Sequence Diagram Profil menggambarkan proses ketika pembeli membuka halaman Profil untuk melihat informasi akun.

## Diagram

```mermaid
sequenceDiagram
    actor Pembeli
    participant Profil as Halaman Profil
    participant Sistem
    participant DB as Database

    Pembeli->>Profil: Membuka halaman Profil
    Profil->>Sistem: Meminta data profil
    Sistem->>DB: Mengambil data akun
    DB-->>Sistem: Mengirim data akun
    Sistem-->>Profil: Mengirim data profil
    Profil-->>Pembeli: Menampilkan informasi akun
```

## Penjelasan Proses

1. Pembeli membuka halaman Profil.
2. Halaman Profil meminta data akun kepada sistem.
3. Sistem mengambil data profil dari database.
4. Database mengirimkan data akun.
5. Halaman Profil menampilkan informasi akun kepada pembeli.

---

# 12. Sequence Diagram Keluar Akun

## Pengertian

Sequence Diagram Keluar Akun atau Logout menggambarkan proses ketika pembeli keluar dari akun ClosetGirls ThriftShop.

## Diagram

```mermaid
sequenceDiagram
    actor Pembeli
    participant Profil as Halaman Profil
    participant Sistem

    Pembeli->>Profil: Memilih menu Logout
    Profil->>Sistem: Mengirim permintaan Logout
    Sistem->>Sistem: Mengakhiri sesi pengguna
    Sistem-->>Profil: Mengirim konfirmasi Logout
    Profil-->>Pembeli: Menampilkan halaman Login
```

## Penjelasan Proses

1. Pembeli membuka halaman Profil.
2. Pembeli memilih menu Logout atau Keluar Akun.
3. Halaman Profil mengirimkan permintaan Logout kepada sistem.
4. Sistem memproses keluar akun.
5. Sistem mengakhiri sesi pengguna.
6. Pengguna diarahkan kembali ke halaman Login.

---

# 13. Kesimpulan

Sequence Diagram pada proyek ClosetGirls ThriftShop digunakan untuk menggambarkan urutan interaksi antara pengguna, halaman sistem, sistem, dan database pada fitur-fitur utama.

Sequence Diagram yang dibuat meliputi:

1. Login
2. Registrasi
3. Beranda
4. Pencarian Produk
5. Katalog
6. Detail Produk
7. Keranjang
8. Checkout
9. Profil
10. Keluar Akun

Dokumentasi ini dapat menjadi acuan dalam proses pengembangan, pengujian, dan perbaikan sistem ClosetGirls ThriftShop.
