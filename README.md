# Bikin Web

Situs statis (Eleventy) untuk Laju Official. Konten diedit lewat halaman admin Decap CMS di `/admin/`, dengan login Decap Turbo.

## Struktur konten

- `src/lini/`: lini usaha (satu file per lini)
- `src/jenis/`: jenis produk di dalam lini
- `src/produk/`: produk, terhubung ke lini dan jenis
- `src/artikel/`: artikel, bisa terhubung ke beberapa jenis
- `src/_data/site.json`: nama, alamat, email, dan nomor WA

## Publikasi

1. Upload file proyek ke repository GitHub `botolbarunew-prog/bikin-web`. Jangan upload `node_modules`, `_site`, atau `jalankan-preview.bat`.
2. Cloudflare Pages membangun ulang otomatis setiap ada commit ke branch utama. Pengaturan build: `npm run build`, output `_site`, dan variabel `NODE_VERSION` = `22`.
3. Edit konten lewat `/admin/` di https://laju-official.pages.dev, atau dengan mengunggah file yang sudah diubah ke repository.

## Preview lokal

Klik dua kali `jalankan-preview.bat`, lalu buka http://localhost:8080. Membutuhkan Node.js.

## Catatan

- Nomor WA, alamat, dan email ada di `src/_data/site.json`.
- Login admin memakai Decap Turbo. Alamat admin yang terdaftar: `https://laju-official.pages.dev/admin/`.
