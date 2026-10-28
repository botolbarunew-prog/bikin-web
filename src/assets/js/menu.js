// Menu HP: "Unit Bisnis" bisa dibuka dan ditutup. Saat halaman sedang berada di salah satu unit, daftarnya langsung terbuka.
(function () {
  var dropdown = document.querySelector('.dropdown');
  if (!dropdown) return;

  var tombol = dropdown.querySelector('.dropdown-tombol');
  var panel = dropdown.querySelector('.dropdown-panel');

  function atur(buka) {
    dropdown.classList.toggle('terbuka', buka);
    tombol.setAttribute('aria-expanded', buka ? 'true' : 'false');
  }

  atur(!!panel.querySelector('[aria-current="page"]'));

  tombol.addEventListener('click', function () {
    atur(!dropdown.classList.contains('terbuka'));
  });
})();

// Menu satu baris hanya dipakai jika muat di header dan tidak menabrak logo (minimal 24px jaraknya). Jika tidak, pakai hamburger.
(function () {
  var html = document.documentElement;
  var bar = document.querySelector('.site-header .bar');
  var brand = document.querySelector('.site-header .brand');
  var nav = document.querySelector('.site-nav');
  if (!bar || !brand || !nav) return;

  function aturMenuLebar() {
    html.classList.add('menu-lebar');
    var muat = bar.scrollWidth <= bar.clientWidth && nav.getBoundingClientRect().left - brand.getBoundingClientRect().right >= 24;
    html.classList.toggle('menu-lebar', muat);
  }

  aturMenuLebar();
  window.addEventListener('resize', aturMenuLebar);
  if (document.fonts) document.fonts.ready.then(aturMenuLebar);
})();
