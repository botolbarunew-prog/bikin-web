module.exports = function (eleventyConfig) {
  // Aset statis: CSS, gambar, dan konfigurasi admin
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin/config.yml");
  eleventyConfig.addPassthroughCopy({"src/_redirects": "_redirects"});

  eleventyConfig.addGlobalData("year", () => new Date().getFullYear());
  // Netlify mengisi process.env.URL saat build, jadi domain baru ikut terbaca otomatis
  eleventyConfig.addGlobalData("siteUrl", () => (process.env.URL || "https://GANTI-DOMAIN").replace(/\/$/, ""));

  // Koleksi. Urutan manual dari field "urutan"; yang kosong ditaruh di belakang
  const urutkan = (a, b) => (a.data.urutan ?? 999) - (b.data.urutan ?? 999);
  eleventyConfig.addCollection("lini", (c) => c.getFilteredByGlob("src/lini/*.md").sort(urutkan));
  eleventyConfig.addCollection("jenis", (c) => c.getFilteredByGlob("src/jenis/*.md").sort(urutkan));
  eleventyConfig.addCollection("produk", (c) => c.getFilteredByGlob("src/produk/*.md"));
  eleventyConfig.addCollection("artikel", (c) =>
    c.getFilteredByGlob("src/artikel/*.md").sort((a, b) => new Date(b.data.tanggal) - new Date(a.data.tanggal))
  );

  // Ambil nilai dari path seperti "data.slug"
  const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

  eleventyConfig.addFilter("where", (items = [], key, value) => items.filter((i) => get(i, key) === value));
  eleventyConfig.addFilter("whereIn", (items = [], key, list = []) => items.filter((i) => list.includes(get(i, key))));
  eleventyConfig.addFilter("whereIncludes", (items = [], key, value) =>
    items.filter((i) => {
      const v = get(i, key);
      return Array.isArray(v) ? v.includes(value) : v === value;
    })
  );
  eleventyConfig.addFilter("find", (items = [], key, value) => items.find((i) => get(i, key) === value));
  eleventyConfig.addFilter("exclude", (items = [], url) => items.filter((i) => i.url !== url));
  eleventyConfig.addFilter("limit", (items = [], n) => items.slice(0, n));

  // Tanggal untuk tampilan (Bahasa Indonesia) dan untuk atribut datetime/schema (YYYY-MM-DD)
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  // Estimasi waktu baca: 200 kata per menit, dihitung dari teks tanpa tag HTML
  eleventyConfig.addFilter("readingTime", (html = "") => {
    const kata = String(html).replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(kata / 200))} mnt baca`;
  });

  // Inisial untuk avatar penulis
  eleventyConfig.addFilter("initial", (s = "") => String(s).trim().charAt(0).toUpperCase());

  // Routing nomor WA: lini yang tercantum di whatsapp_2 memakai nomor 2, selain itu nomor 1
  eleventyConfig.addFilter("waFor", (slug, site) => {
    if (site.whatsapp_2.units.includes(slug)) return site.whatsapp_2.number;
    return site.whatsapp_1.number;
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
