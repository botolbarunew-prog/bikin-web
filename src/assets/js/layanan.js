// Form layanan pembeli: membuat pesan WhatsApp dari isian. Tidak ada data yang disimpan di situs.
// Nomor tujuan mengikuti lini produk (data-nomor dari filter waFor pada setiap pilihan).
(function () {
  var form = document.querySelector("[data-form-pembeli]");
  if (!form) return;

  var pesanAwal = form.getAttribute("data-pesan-awal") || "Halo Admin, saya";
  var input = form.querySelector("#fp-produk");
  var kotak = form.querySelector("[data-combo]");
  var daftar = form.querySelector("#daftar-produk");
  var opsi = Array.prototype.slice.call(daftar.querySelectorAll("[role=option]"));
  var pesan = form.querySelector(".form-pesan");
  var aktif = -1;

  function terlihat() {
    return opsi.filter(function (o) { return !o.hidden; });
  }

  function teksOpsi(o) {
    return o.textContent.trim();
  }

  // Daftar mengikuti ketikan: hanya produk yang mengandung teks yang tampil
  function saring() {
    var kunci = input.value.trim().toLowerCase();
    opsi.forEach(function (o) {
      o.hidden = kunci !== "" && teksOpsi(o).toLowerCase().indexOf(kunci) === -1;
      o.setAttribute("aria-selected", teksOpsi(o).toLowerCase() === kunci ? "true" : "false");
    });
    aktif = -1;
    clearAktif();
  }

  function clearAktif() {
    opsi.forEach(function (o) { o.classList.remove("aktif"); });
    input.removeAttribute("aria-activedescendant");
  }

  function tutup() {
    daftar.hidden = true;
    input.setAttribute("aria-expanded", "false");
    aktif = -1;
    clearAktif();
  }

  // Daftar tampil di bawah input jika ruangnya cukup, jika tidak di atasnya.
  // Dihitung ulang setiap halaman digulir atau layar berubah ukuran.
  function posisi() {
    var rect = input.getBoundingClientRect();
    var ruangBawah = window.innerHeight - rect.bottom;
    var ruangAtas = rect.top;
    var butuh = daftar.offsetHeight + 8;
    daftar.classList.toggle("diatas", ruangBawah < butuh && ruangAtas > ruangBawah);
  }

  function buka() {
    saring();
    if (!terlihat().length) return tutup();
    daftar.hidden = false;
    input.setAttribute("aria-expanded", "true");
    posisi();
  }

  window.addEventListener("scroll", function () {
    if (!daftar.hidden) posisi();
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (!daftar.hidden) posisi();
  });

  function sorot(i) {
    var list = terlihat();
    clearAktif();
    if (!list.length) return;
    aktif = (i + list.length) % list.length;
    list[aktif].classList.add("aktif");
    input.setAttribute("aria-activedescendant", list[aktif].id);
    list[aktif].scrollIntoView({ block: "nearest" });
  }

  function pilih(o) {
    input.value = teksOpsi(o);
    pesan.hidden = true;
    tutup();
  }

  function cocokOpsi(teks) {
    var kunci = teks.trim().toLowerCase();
    if (!kunci) return null;
    for (var i = 0; i < opsi.length; i++) {
      if (teksOpsi(opsi[i]).toLowerCase() === kunci) return opsi[i];
    }
    return null;
  }

  input.addEventListener("focus", buka);
  input.addEventListener("input", function () {
    pesan.hidden = true;
    buka();
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (daftar.hidden) buka();
      else sorot(aktif + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      sorot(aktif - 1);
    } else if (e.key === "Enter") {
      if (!daftar.hidden && aktif >= 0) {
        e.preventDefault();
        pilih(terlihat()[aktif]);
      }
    } else if (e.key === "Escape") {
      tutup();
    }
  });

  // mousedown dipakai agar input tidak kehilangan fokus sebelum pilihan tercatat
  opsi.forEach(function (o) {
    o.addEventListener("mousedown", function (e) {
      e.preventDefault();
      pilih(o);
    });
  });

  document.addEventListener("mousedown", function (e) {
    if (!kotak.contains(e.target)) tutup();
  });

  // Nama dan catatan: kolom muncul saat ikon + ditekan. Ikon hapus hanya aktif saat kolom terisi.
  form.querySelectorAll("[data-isian]").forEach(function (blok) {
    var tombol = blok.querySelector("[data-ikon]");
    var isi = blok.querySelector(".isian-isi");
    var isian = isi.querySelector("input, textarea");
    var judul = blok.querySelector(".isian-judul").textContent.replace("(opsional)", "").trim().toLowerCase();

    function segarkan() {
      var terisi = isian.value.trim() !== "";
      var terbuka = !isi.hidden;
      blok.toggleAttribute("data-terisi", terisi);
      blok.toggleAttribute("data-terbuka", terbuka);
      tombol.setAttribute("aria-expanded", String(terbuka));
      tombol.setAttribute("aria-label", terisi ? "Hapus " + judul : terbuka ? "Tutup " + judul : "Tambah " + judul);
    }

    tombol.addEventListener("click", function () {
      if (blok.hasAttribute("data-terisi")) {
        isian.value = "";
        isi.hidden = true;
      } else {
        isi.hidden = !isi.hidden;
        if (!isi.hidden) isian.focus();
      }
      segarkan();
    });

    isian.addEventListener("input", segarkan);
    segarkan();
  });

  // Tombol utama: pertama membuka form di tempat, lalu berubah menjadi tombol kirim
  var tombolForm = form.querySelector(".tombol-form");
  var isiForm = form.querySelector("#form-isi");

  function bukaForm() {
    isiForm.hidden = false;
    form.setAttribute("data-terbuka", "");
    tombolForm.textContent = "Kirim ke WhatsApp";
    tombolForm.setAttribute("aria-expanded", "true");
    input.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Di beranda form selalu terbuka, jadi tidak ada langkah membuka
    if (isiForm && isiForm.hidden) {
      bukaForm();
      return;
    }

    var o = cocokOpsi(input.value);
    if (!o) {
      tutup();
      pesan.hidden = false;
      input.focus();
      return;
    }

    var namaIsi = form.querySelector("#fp-nama").value.trim();
    var catatanIsi = form.querySelector("#fp-catatan").value.trim();

    // Kalimat utama selalu ada. Nama dan catatan hanya ditambahkan jika diisi.
    var teks = pesanAwal + " " + (namaIsi ? namaIsi + " " : "") + "ingin tanya tentang " + teksOpsi(o) + ".";
    if (catatanIsi) teks += " " + catatanIsi;

    var url = "https://wa.me/" + o.getAttribute("data-nomor") + "?text=" + encodeURIComponent(teks);
    window.open(url, "_blank", "noopener");
  });
})();
