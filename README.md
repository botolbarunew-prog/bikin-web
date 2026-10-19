# Bikin Web

Situs statis (Eleventy) dengan halaman admin Decap CMS di `/admin`.

## Struktur konten

- `src/lini/` — lini usaha (satu file per lini)
- `src/jenis/` — jenis produk di dalam lini
- `src/produk/` — produk, terhubung ke lini dan jenis
- `src/artikel/` — artikel, bisa terhubung ke beberapa jenis
- `src/_data/site.json` — nama situs, domain, nomor WA default

## Publikasi

1. Upload file proyek ke repository GitHub `botolbarunew-prog/bikin-web`. Jangan upload `node_modules`, `_site`, atau `jalankan-preview.bat`.
2. Cloudflare Pages membangun ulang otomatis setiap ada commit ke branch utama. Pengaturan build: `npm run build`, output `_site`, dan variabel `NODE_VERSION` = `22`.
3. Edit konten dengan mengunggah file yang sudah diubah ke folder yang sesuai di repository ini.

## Preview lokal

Klik dua kali `jalankan-preview.bat`, lalu buka http://localhost:8080. Membutuhkan Node.js.

## Catatan

- Nomor WA, alamat, dan email ada di `src/_data/site.json`. Diedit langsung di file itu sampai masuk ke Pages CMS.
- Editor berbasis web (Pages CMS atau admin lain) belum digunakan. Semua konten diedit lewat file di repository ini.
