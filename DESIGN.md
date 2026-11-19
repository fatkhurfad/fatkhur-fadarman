# Keputusan Desain LaundryCalc

Dokumen ini mencatat seluruh pilihan tampilan dan token visual yang dipakai pada aplikasi LaundryCalc.

## Keputusan Desain Pengguna

- **Kesan Visual:** Ramah dan hangat memakai huruf `Plus Jakarta Sans` (bobot 400, 500, 600 via `@fontsource/plus-jakarta-sans`).
- **Warna Aksen:** Biru (`blue-700`, hover `blue-800`, latar terpilih `blue-50`).
- **Sapaan Pengguna:** Anda.
- **Susunan Halaman:** Satu halaman bergulir pada ponsel; dua kolom pada layar desktop (kolom formulir di kiri dan panel ringkasan sticky di kanan).
- **Posisi Aksi Utama:** Bilah ringkasan menempel di bawah layar pada ponsel (tinggi ringkas <= 15% layar) dan panel ringkasan sticky di kanan pada desktop.
- **Gambar:** Tanpa gambar.
- **Bentuk Pilihan Fitur:**
  - Katalog Layanan Utama (FT-01): Kartu radio berderet vertikal dengan area sentuh minimal 44 x 44 px.
  - Input Berat (FT-02): Kolom input angka desimal dengan tombol penyesuaian cepat `-` dan `+`.
  - Add-on (FT-03): Daftar kotak centang interaktif berarea sentuh penuh.
  - Ringkasan Harga (FT-04): Total estimasi permanen di bilah bawah ponsel dengan panel rincian yang dapat dibuka/tutup; rincian lengkap tampil langsung pada desktop.

## Token Visual

| Peran | Kelas Tailwind |
| :--- | :--- |
| Latar halaman | `bg-neutral-50` |
| Kartu dan panel | `bg-white rounded-2xl` |
| Garis tepi input dan pemisah | `border-neutral-200` |
| Teks utama | `text-neutral-900` |
| Teks pendukung | `text-neutral-600` |
| Placeholder | `text-neutral-500` |
| Tombol utama | `bg-blue-700 hover:bg-blue-800 text-white rounded-xl` |
| Teks aksen | `text-blue-700` |
| Elemen terpilih | `border-blue-700 bg-blue-50` |
| Cincin fokus | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2` |
| Peringatan minimum charge | `bg-amber-50 text-amber-800` + ikon `Info` |
| Error validasi | `bg-red-50 text-red-800` / `text-red-800` + ikon `AlertCircle` |
| Badge layanan paling hemat | `bg-emerald-50 text-emerald-800 rounded-full` + ikon `Tag` |
| Bayangan elemen melayang | `shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]` |

## Aturan Gaya yang Dipatuhi

- Tidak memakai gradasi, efek glow, `backdrop-blur`, kartu di dalam kartu, atau garis tepi kiri tebal berwarna.
- Tidak memakai pil statis pada metadata durasi atau tarif.
- Seluruh angka harga dan berat memakai `tabular-nums`.
- Ukuran font minimal 14 px untuk teks biasa dan 16 px untuk seluruh kolom input.
- Transisi dibatasi pada warna, `opacity`, dan `transform` (150-200 ms, `ease-out`) serta menghormati `motion-reduce:`.
