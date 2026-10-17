module.exports = {
  layout: "layouts/artikel.njk",
  eleventyComputed: {
    // Artikel lintas lini tayang di /artikel/, sisanya di bawah lini dan jenis utamanya
    permalink: (data) =>
      data.lintas
        ? `/artikel/${data.slug}/`
        : `/${data.lini}/${data.jenis[0]}/${data.slug}/`,
    // Penulis default: tim redaksi dari site.json, bisa ditimpa per artikel
    author: (data) => data.author || data.site.author,
    authorRole: (data) => data.authorRole || data.site.authorRole,
  },
};
