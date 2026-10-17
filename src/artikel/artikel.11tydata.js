module.exports = {
  layout: "layouts/artikel.njk",
  eleventyComputed: {
    // Semua artikel memakai URL bersih: /artikel/nama-file/
    permalink: (data) => `/artikel/${data.page.fileSlug}/`,
    // Penulis default: tim redaksi dari site.json, bisa ditimpa per artikel
    author: (data) => data.author || data.site.author,
    authorRole: (data) => data.authorRole || data.site.authorRole,
  },
};
