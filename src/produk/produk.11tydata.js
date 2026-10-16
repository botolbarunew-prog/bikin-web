module.exports = {
  layout: "layouts/produk.njk",
  eleventyComputed: {
    permalink: (data) => `/${data.lini}/${data.jenis}/${data.slug}/`,
  },
};
