// Galeri produk dan pilihan produk.
// - Foto utama bisa digeser (slider) dengan titik dan penanda angka.
// - Di desktop, thumbnail tampil di bawah dan bisa diklik.
// - Ketuk foto untuk layar penuh: foto memenuhi layar, kontrol di tepi layar.
//   Ketuk foto sekali lagi untuk memperbesar, lalu geser untuk melihat detail.
// - Memilih pilihan yang punya foto memindahkan tampilan ke fotonya.
// - Pesan WhatsApp ikut berubah sesuai pilihan.
(function () {
  var galeri = document.querySelector("[data-galeri]");
  var slider = galeri ? galeri.querySelector("[data-slider]") : null;
  if (!galeri || !slider) return;

  var penuh = galeri.parentNode.querySelector("[data-penuh]");
  var penuhArea = penuh ? penuh.querySelector("[data-penuh-area]") : null;
  var penuhImg = penuh ? penuh.querySelector("[data-penuh-img]") : null;
  var penuhAngka = penuh ? penuh.querySelector("[data-penuh-angka]") : null;
  var penuhPanah = penuh ? penuh.querySelectorAll("[data-penuh-geser]") : [];
  var indeksPenuh = 0;

  var thumbs = galeri.querySelector("[data-thumbs]");
  var titik = galeri.querySelector("[data-titik]");
  var angka = galeri.querySelector("[data-angka]");
  var panahThumb = galeri.querySelectorAll("[data-thumb-panah]");

  // Buang foto ganda, dan buang placeholder jika sudah ada foto asli
  var semua = Array.prototype.slice.call(slider.querySelectorAll(".slide"));
  var adaFoto = semua.some(function (s) { return s.getAttribute("data-src"); });
  var vistos = {};
  semua.forEach(function (s) {
    var src = s.getAttribute("data-src");
    if (!src) {
      if (adaFoto) s.remove();
      return;
    }
    if (vistos[src]) {
      s.remove();
      return;
    }
    vistos[src] = true;
  });

  var slides = Array.prototype.slice.call(slider.querySelectorAll(".slide"));
  var jumlah = slides.length;
  galeri.classList.toggle("satu", jumlah <= 1);
  // Panah thumbnail hanya dipakai jika foto lebih dari 4
  galeri.classList.toggle("tanpa-panah", jumlah <= 4);

  // Titik dan thumbnail, satu per foto
  slides.forEach(function (s, i) {
    var src = s.getAttribute("data-src");
    if (titik) {
      var t = document.createElement("span");
      t.className = "titik";
      titik.appendChild(t);
    }
    if (thumbs && src) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "thumb";
      b.setAttribute("aria-label", "Lihat foto " + (i + 1) + " dari " + jumlah);
      var img = document.createElement("img");
      // Thumbnail memakai versi WebP yang lebih kecil (dibuat saat build)
      img.src = src.replace(/\.(jpe?g|png)$/i, ".webp");
      img.alt = "";
      img.loading = "lazy";
      b.appendChild(img);
      b.addEventListener("click", function () { ke(i); });
      thumbs.appendChild(b);
    }
  });

  var aktif = 0;

  function tandai(i) {
    aktif = i;
    if (titik) {
      titik.querySelectorAll(".titik").forEach(function (t, k) { t.classList.toggle("aktif", k === i); });
    }
    if (thumbs) {
      var daftarThumb = thumbs.querySelectorAll(".thumb");
      daftarThumb.forEach(function (t, k) { t.classList.toggle("aktif", k === i); });
      // Pastikan thumbnail yang aktif terlihat di deretan kecil
      var t = daftarThumb[i];
      if (t) {
        var kiri = t.getBoundingClientRect().left - thumbs.getBoundingClientRect().left;
        var kanan = kiri + t.offsetWidth - thumbs.clientWidth;
        // Tanpa animasi, supaya tidak saling membatalkan saat foto besar ikut bergeser
        if (kiri < 0) thumbs.scrollLeft += kiri;
        else if (kanan > 0) thumbs.scrollLeft += kanan;
      }
    }
    if (angka) angka.textContent = (i + 1) + " / " + jumlah;
  }

  function ke(i) {
    var s = slides[i];
    if (!s) return;
    slider.scrollTo({ left: s.offsetLeft, behavior: "smooth" });
    tandai(i);
  }

  function indeksDari(src) {
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute("data-src") === src) return i;
    }
    return -1;
  }

  // Geser manual: perbarui titik dan thumbnail sesuai slide yang paling dekat
  slider.addEventListener("scroll", function () {
    var pos = slider.scrollLeft;
    var terdekat = 0;
    var jarak = Infinity;
    slides.forEach(function (s, i) {
      var d = Math.abs(s.offsetLeft - pos);
      if (d < jarak) { jarak = d; terdekat = i; }
    });
    if (terdekat !== aktif) tandai(terdekat);
  }, { passive: true });

  // Panah keyboard saat slider sedang fokus
  slider.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); ke(Math.min(aktif + 1, jumlah - 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); ke(Math.max(aktif - 1, 0)); }
  });

  // Panah thumbnail (desktop): geser foto besar satu langkah, thumbnail ikut menyesuaikan
  panahThumb.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      var arah = parseInt(tombol.getAttribute("data-arah"), 10);
      ke(Math.min(Math.max(aktif + arah, 0), jumlah - 1));
    });
  });

  tandai(0);

  // Layar penuh
  if (penuh && penuhImg) {
    penuh.classList.toggle("satu", jumlah <= 1);

    var zoom = false;
    var geserX = 0;
    var geserY = 0;
    var tarik = null;

    slides.forEach(function (s, i) {
      if (!s.getAttribute("data-src")) return;
      s.addEventListener("click", function () { bukaPenuh(i); });
    });

    function terapkanZoom() {
      penuhImg.style.transform = zoom ? "translate(" + geserX + "px, " + geserY + "px) scale(2)" : "";
      penuh.classList.toggle("diperbesar", zoom);
    }

    function reset() {
      zoom = false;
      geserX = 0;
      geserY = 0;
      terapkanZoom();
    }

    function tampilPenuh(i) {
      var s = slides[i];
      if (!s) return;
      reset();
      indeksPenuh = i;
      penuhImg.src = s.getAttribute("data-src");
      var img = s.querySelector("img");
      penuhImg.alt = img ? img.alt : "";
      if (penuhAngka) penuhAngka.textContent = (i + 1) + " / " + jumlah;
    }

    function bukaPenuh(i) {
      tampilPenuh(i);
      if (!penuh.open) penuh.showModal();
    }

    function geserPenuh(arah) {
      tampilPenuh(Math.min(Math.max(indeksPenuh + arah, 0), jumlah - 1));
    }

    // Apakah titik klik berada di dalam foto yang tampil (bukan area kosong di sekitarnya)
    function diDalamFoto(e) {
      var r = penuhImg.getBoundingClientRect();
      var nw = penuhImg.naturalWidth || 800;
      var nh = penuhImg.naturalHeight || 600;
      var skala = Math.min(r.width / nw, r.height / nh);
      var lebar = nw * skala;
      var tinggi = nh * skala;
      var kiri = r.left + (r.width - lebar) / 2;
      var atas = r.top + (r.height - tinggi) / 2;
      return e.clientX >= kiri && e.clientX <= kiri + lebar && e.clientY >= atas && e.clientY <= atas + tinggi;
    }

    penuh.addEventListener("close", reset);

    penuh.querySelector("[data-penuh-tutup]").addEventListener("click", function () { penuh.close(); });

    // Klik area kosong di sekitar foto menutup tampilan. Tombol X, panah, dan n/n tidak menutup.
    penuh.addEventListener("click", function (e) {
      var t = e.target;
      if (t === penuh || t === penuhArea || t.classList.contains("penuh-isi")) penuh.close();
    });

    penuhPanah.forEach(function (b) {
      b.addEventListener("click", function () { geserPenuh(parseInt(b.getAttribute("data-penuh-geser"), 10)); });
    });

    penuh.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") geserPenuh(1);
      if (e.key === "ArrowLeft") geserPenuh(-1);
    });

    // Foto: ketuk untuk memperbesar atau mengecilkan. Saat diperbesar, seret untuk melihat bagian lain.
    // Ketuk di luar foto yang tampil (saat belum diperbesar) menutup tampilan.
    penuhImg.addEventListener("pointerdown", function (e) {
      tarik = { x: e.clientX, y: e.clientY, px: geserX, py: geserY, geser: false };
      penuhImg.setPointerCapture(e.pointerId);
    });

    penuhImg.addEventListener("pointermove", function (e) {
      if (!tarik) return;
      var dx = e.clientX - tarik.x;
      var dy = e.clientY - tarik.y;
      if (!tarik.geser && Math.hypot(dx, dy) > 6) tarik.geser = true;
      if (tarik.geser && zoom) {
        var batasX = penuhArea.clientWidth / 2;
        var batasY = penuhArea.clientHeight / 2;
        geserX = Math.max(-batasX, Math.min(batasX, tarik.px + dx));
        geserY = Math.max(-batasY, Math.min(batasY, tarik.py + dy));
        terapkanZoom();
      }
    });

    function toggleZoom() {
      zoom = !zoom;
      geserX = 0;
      geserY = 0;
      terapkanZoom();
    }

    penuhImg.addEventListener("pointerup", function (e) {
      if (!tarik) return;
      var klik = !tarik.geser;
      tarik = null;
      if (!klik) return;
      if (!zoom && !diDalamFoto(e)) {
        penuh.close();
        return;
      }
      toggleZoom();
    });

    // Keyboard: Enter atau Spasi pada foto untuk memperbesar atau mengecilkan
    penuhImg.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleZoom();
      }
    });

    // Geser jari ke kiri atau kanan untuk pindah foto di HP (tidak saat diperbesar)
    var sentuhX = null;
    penuh.addEventListener("touchstart", function (e) {
      if (zoom || e.touches.length > 1) { sentuhX = null; return; }
      sentuhX = e.touches[0].clientX;
    }, { passive: true });
    penuh.addEventListener("touchend", function (e) {
      if (sentuhX === null) return;
      var dx = e.changedTouches[0].clientX - sentuhX;
      sentuhX = null;
      if (Math.abs(dx) > 40) geserPenuh(dx < 0 ? 1 : -1);
    });
  }

  // Pilihan produk: ringkasan, foto, dan pesan WhatsApp
  var form = document.getElementById("pilihan-produk");
  var tombolPesan = document.getElementById("tombol-pesan");
  if (!tombolPesan) return;

  var nomor = tombolPesan.getAttribute("data-nomor");
  var dasar = tombolPesan.getAttribute("data-pesan-dasar") || "";

  function perbarui(dariPilihan) {
    var pilihan = [];
    var fotoPilihan = "";

    if (form) {
      form.querySelectorAll("input[type=radio]:checked").forEach(function (input) {
        var grup = input.getAttribute("data-grup");
        var index = input.getAttribute("data-index");

        pilihan.push(grup + " " + input.value);

        var hasil = document.querySelector('[data-hasil="' + index + '"]');
        if (hasil) hasil.textContent = input.value;

        if (input.getAttribute("data-gambar")) {
          fotoPilihan = input.getAttribute("data-gambar");
        }
      });
    }

    if (fotoPilihan) {
      var i = indeksDari(fotoPilihan);
      if (i >= 0) ke(i);
    }

    var teks = dasar;
    if (pilihan.length) teks += " Pilihan: " + pilihan.join(", ") + ".";
    teks += " Bisa info stok dan harga grosirnya?";

    tombolPesan.setAttribute("href", "https://wa.me/" + nomor + "?text=" + encodeURIComponent(teks));
  }

  if (form) form.addEventListener("change", function () { perbarui(true); });
  perbarui(false);
})();
