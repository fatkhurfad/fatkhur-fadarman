# Daftar Fitur LaundryCalc

Dokumen ini merangkum seluruh fitur dari PRD LaundryCalc v1.1 beserta prioritas, ketergantungan, status pengerjaan, dan keputusan klarifikasi pengguna.

## Ringkasan Produk

- **Nama Aplikasi:** LaundryCalc (Katalog dan Kalkulator Estimasi Laundry)
- **Pengguna Utama:** Pelanggan laundry rumahan/kost dan Admin Operasional Toko Laundry
- **Lingkup Versi:** MVP v0.1 (berjalan sepenuhnya di browser, tanpa login, tanpa server, tanpa database)

## Daftar Fitur

| Kode | Nama Fitur | Prioritas | Ketergantungan | Status |
| :--- | :--- | :--- | :--- | :--- |
| FT-01 | Tampilan Katalog dan Durasi | Must Have | Tidak ada | Selesai |
| FT-02 | Input Berat dan Notifikasi Min. Charge | Must Have | FT-01 | Selesai |
| FT-03 | Opsi Add-on Terintegrasi | Must Have | FT-02 | Selesai |
| FT-04 | Floating Price Summary | Must Have | FT-01, FT-02, FT-03 | Selesai |
| FT-05 | Form Data Pemesan | Must Have | FT-03 | Selesai |
| FT-06 | WhatsApp Deep Link Button | Must Have | FT-01, FT-02, FT-03, FT-04, FT-05 | Selesai |
| FT-07 | Info Jam Operasional Toko | Should Have | Tidak ada | Ditunda |

## Keputusan Klarifikasi PRD

1. **Format Rupiah:** Tanpa spasi di layar maupun di pesan WhatsApp (`Rp50.000`, pemisah ribuan titik, tanpa desimal).
2. **Kondisi Awal Kalkulator:** Terisi awal paket Cuci Lipat (`L01`) dengan berat `3` kg sehingga estimasi awal (`Rp18.000`) langsung tampil.
3. **Batas dan Pembulatan Berat:** Menerima koma atau titik pada rentang valid `0,1` kg hingga `100` kg. Jika hasil perkalian berat desimal menghasilkan pecahan Rupiah, dibulatkan ke bilangan bulat terdekat (`Math.round`).
4. **Identitas Toko Contoh:** Nama toko `"Laundry UMKM"` dan nomor WhatsApp contoh `"6281234567890"` tersimpan di `src/config.ts`.
5. **Status FT-07:** Ditandai Ditunda sesuai permintaan pengguna sehingga tidak dibangun pada versi ini.
