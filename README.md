# Bikin Web

Situs statis (Eleventy) dengan halaman admin Decap CMS di `/admin`.

## Struktur konten

- `src/lini/` — lini usaha (satu file per lini)
- `src/jenis/` — jenis produk di dalam lini
- `src/produk/` — produk, terhubung ke lini dan jenis
- `src/artikel/` — artikel, bisa terhubung ke beberapa jenis
- `src/_data/site.json` — nama situs, domain, nomor WA default

## Publikasi (tanpa install di komputer)

1. Upload seluruh isi folder ini ke repository GitHub lewat antarmuka web.
2. Di Netlify, pilih "Import from Git" dan pilih repository tersebut. Build otomatis memakai `netlify.toml`.
3. Ganti `repo: GANTI/NAMA-REPO` di `src/admin/config.yml` dengan repository GitHub yang sebenarnya.
4. Buka `/admin` di domain situs untuk mengedit konten.

## Catatan

- Nomor WA, nama situs, domain, dan konten contoh masih placeholder.
- Login admin memakai akun GitHub. Cara autentikasi Netlify perlu dicek ulang saat setup.
