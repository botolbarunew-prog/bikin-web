# STANDAR WAJIB PROYEK WEBSITE (LAJU OFFICIAL / BIKIN-WEB)

Setiap kali menulis, mengedit, atau menambahkan kode HTML/Nunjucks (`.njk`), Markdown (`.md`), maupun CSS (`src/assets/css/style.css`), patuhi seluruh aturan berikut.

## Konteks proyek
- Situs statis dengan Eleventy (11ty). Build: `npx @11ty/eleventy`. Output di `_site/`.
- Konten diedit lewat Pages CMS (pagescms.org), yang menyimpan perubahan ke GitHub. Struktur editornya diatur di `.pages.yml` di root. Cloudflare Pages membangun ulang otomatis setiap ada commit ke branch utama.
- Hosting: Cloudflare Pages (project `laju-official`), alamat `https://laju-official.pages.dev`. Variabel `SITE_URL` di Cloudflare dipakai untuk alamat canonical dan sitemap bila pakai domain sendiri.
- Preview lokal: `jalankan-preview.bat` (klik dua kali) atau `npm run dev`, lalu buka http://localhost:8080. File `.bat` ini hanya untuk komputer lokal, jangan diupload.
- Pengguna berbicara Bahasa Indonesia dan tidak menulis kode. Jelaskan perubahan dengan bahasa sederhana.
- Pengguna mengupload file ke GitHub lewat antarmuka web. Folder baru harus bisa dibuat lewat nama file dengan path, jadi hindari menambah folder baru jika tidak perlu.

## Keputusan bisnis yang sudah final (jangan diubah tanpa konfirmasi)
- **Tidak ada harga** di mana pun di situs. Pemesanan selalu lewat WhatsApp.
- **Tidak ada keranjang atau pembayaran.**
- **Varian** ditampilkan sebagai informasi saja. Pembeli tidak memilih varian atau jumlah di situs.
- **Tombol WA tidak ada di kartu produk** di halaman daftar/katalog. Kartu hanya menjadi tautan ke halaman produk, dan tombol WA ada di halaman produk.
- **Satu tombol WA mengambang** di pojok kanan bawah. Tidak ada popover atau menu pilihan divisi.
- **Routing nomor WA** dikendalikan oleh `src/_data/site.json` (`whatsapp_1` dan `whatsapp_2` beserta daftar `units`) lewat filter `waFor`. Jangan hardcode nomor di template.
- Struktur: 4 lini (Grosir Botol Kebumen, Gizi Prima, Jas Hujan Topi, Digital Marketing) di bawah 1 payung induk (Laju Official). Lini dibagi menjadi jenis, lalu produk dan artikel.

## 1. Simplicity (Kesederhanaan & Progressive Disclosure)
- **Dilarang** gradasi ungu atau biru neon, `border-radius` lebih dari `6px` untuk card, dan lebih dari `4px` untuk tombol dan badge.
- **Dilarang** `box-shadow` dengan blur tebal. Bayangan hover hanya `0 4px 12px rgba(10, 25, 47, 0.08)`.
- **Dilarang** emoji dekoratif di HTML maupun konten.
- **Kartu produk** di halaman daftar hanya berisi empat elemen: (1) area visual `4/3`, (2) badge lini, (3) nama produk dengan panah kecil, (4) spesifikasi kunci dalam font mono.
- **Ruang kosong** minimal 35–40% dari area layar agar katalog terasa lega.

## 2. Consistency (Konsistensi Sistemik)
- **Grid 8-point.** Semua `margin`, `padding`, dan `gap` harus kelipatan 4 atau 8 (`4, 8, 12, 16, 20, 24, 32, 48, 64, 96`). Nilai `20px` hanya dipakai untuk padding card.
- **Hukum kedekatan.** Jarak di dalam card harus lebih rapat daripada jarak antar card (`gap: 24px`), dan jarak antar seksi halaman lebih besar lagi (`64px`).
- **Touch target minimal 44px** untuk semua tombol dan link navigasi di HP.
- **Komponen konsisten.** Gunakan komponen dari `src/_includes/partials/macros.njk` (`tombolWa`, `breadcrumb`, `gambar`, `kartuProduk`, `kartuLini`, `kartuJenis`, `kartuArtikel`). Jangan menulis markup kartu baru di halaman lain.

## 3. Visual hierarchy (warna 60-30-10 dan tipografi)
- **Warna (token di `:root`):**
  - Netral 60%: `--bg-canvas: #F8FAFC`, `--bg-surface: #FFFFFF`, `--border-subtle: #E2E8F0`, `--placeholder: #F1F5F9`.
  - Otoritas 30%: `--navy-900: #0A192F` (header, footer, heading), `--navy-800: #112240`, `--navy-700: #1E3A8A` (link dan aksen), `--text-body: #334155`, `--text-muted: #64748B`.
  - Konversi 10%: `--yellow-accent: #F59E0B` dan `--yellow-bright: #FACC15`.
- **Tombol utama (WA)**: latar `#FACC15`, teks `#0A192F`, `font-weight: 700`. **Jangan pernah** memakai teks putih di atas kuning.
- **Tombol sekunder**: transparan dengan border `1.5px solid #0A192F`, teks `#0A192F`. Dalam satu area tidak boleh ada dua tombol kuning.
- **Font**: 'Plus Jakarta Sans' (400–800) untuk UI dan bacaan, 'JetBrains Mono' (500–600) untuk spesifikasi, ukuran, bahan, tanggal, dan kode.
- **Skala tipografi**: `xs 0.75rem`, `sm 0.875rem`, `base 1rem` (line-height 1.65), `lg 1.25rem`, `xl 1.563rem`, `2xl 1.953rem`, `3xl clamp(2rem, 4vw, 2.75rem)` dengan `letter-spacing: -0.03em` dan `font-weight: 800`.
- **Layout rata kiri** (pola F), bukan rata tengah, kecuali tombol.

## 4. Feedback dan affordance
- Semua elemen interaktif memakai `transition: ... 0.15s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Hover card**: `border-color: #1E3A8A`, `transform: translateY(-2px)`, dan bayangan tipis seperti di atas.
- **Tombol**: hover mengubah latar kuning ke `#F59E0B` dan menggeser panah `3px` ke kanan. Active memakai `transform: scale(0.98)`. Focus-visible memakai `outline: 2px solid #F59E0B; outline-offset: 2px`.
- **Breadcrumb** wajib ada di halaman produk, jenis, lini, dan artikel. Item terakhir ditandai `aria-current`.
- **Menu aktif** di header diberi garis bawah `#FACC15`.

## 5. Psikologi pembeli dan CRO
- **Pesan WA otomatis** di halaman produk harus menyebut nama produk: `Halo Admin, saya tertarik memesan {{ title }} di website. Bisa info stok dan harga grosirnya?` (ter-encode dengan `urlencode`).
- **Poin kepercayaan** di halaman produk diambil dari `site.tepercaya` di `site.json`, bukan ditulis langsung di template. Isi poin ini harus bisa dipertanggungjawabkan, dan pengguna yang memutuskan isinya.
- **Seksi "3 langkah pemesanan"** diambil dari `site.langkah` di `site.json`.
- **Badge harga** cukup berbunyi "Tanya harga grosir" atau yang setara. Jangan menulis kata "tersedia harga", karena bertentangan dengan keputusan tanpa harga.
- **Artikel tidak boleh buntu.** Sertakan ajakan kontekstual di sidebar atau akhir artikel yang menghubungkan topik dengan produk di katalog.

## 6. Artikel dan SEO E-E-A-T
- **Byline** di `layouts/artikel.njk`: penulis, peran, tanggal dengan `<time datetime>`, tanggal diperbarui jika ada, dan waktu baca dari filter `readingTime`.
- **Penulis default** adalah tim redaksi dari `site.json`. **Jangan** menambahkan klaim keahlian, sertifikasi, atau "diverifikasi oleh ahli" yang tidak bisa dibuktikan pengguna.
- **Lebar baca** maksimal `680px` dengan `font-size: 1.0625rem` dan `line-height: 1.75`.
- **Schema JSON-LD** `Article` (headline, description, datePublished, dateModified, author, publisher) dan `BreadcrumbList` wajib ada di artikel.
- **Tanggal** memakai field `tanggal` di frontmatter, bukan `date`.

## 7. Gambar dan admin
- **Fallback gambar**: jika foto kosong, macro `gambar` otomatis menampilkan placeholder teknis (ikon garis navy dengan label mono). Jangan membuat `<img>` tanpa fallback.
- **Nama field foto** adalah `foto` di produk dan artikel, dan `gambar` di lini. Jangan mengganti nama field karena sudah dipakai di data dan admin.
- **Sinkronisasi editor**: setiap field baru di frontmatter harus ditambahkan juga ke `.pages.yml`. Data perusahaan (alamat, email, nomor WA, poin kepercayaan, dan daftar) diatur langsung di `src/_data/site.json`, karena belum ada di editor.
- **Jangan** memasukkan data placeholder yang tampak nyata. Jika belum ada data, tulis teks yang jelas sebagai placeholder.

## 8. Teknis
- Setelah mengubah template, CSS, atau data, jalankan `npx @11ty/eleventy` dan pastikan build berhasil tanpa error.
- Hasil build tidak boleh mengandung `undefined` atau `[object`.
- Jangan menambah dependensi baru tanpa konfirmasi pengguna.
- Google Fonts dimuat dari `fonts.googleapis.com`. Jangan menambah script pihak ketiga tanpa persetujuan.
