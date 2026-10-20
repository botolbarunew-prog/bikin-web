// Jika sebuah foto gagal dimuat (file hilang atau rusak), tampilkan placeholder agar kotak tidak kosong.
// Dipasang di fase capture karena event error pada gambar tidak naik ke elemen induk.
(function () {
  var cadangan = "/assets/placeholder/foto-belum-tersedia.svg";
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (!img || img.tagName !== "IMG") return;
    // Cegah perulangan jika placeholder pun gagal
    if (img.getAttribute("data-cadangan") === "1") return;
    img.setAttribute("data-cadangan", "1");
    img.src = cadangan;
  }, true);
})();
