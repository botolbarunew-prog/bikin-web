module.exports = {
  layout: "layouts/jenis.njk",
  eleventyComputed: {
    permalink: (data) => `/${data.lini}/${data.slug}/`,
  },
};
