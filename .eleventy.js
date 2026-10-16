module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin/config.yml");
  eleventyConfig.addGlobalData("year", () => new Date().getFullYear());

  // Urutan manual dari field "urutan"; yang tidak diisi ditaruh di belakang
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
  eleventyConfig.addFilter("tanggalIndo", (d) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
