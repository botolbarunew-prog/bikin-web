module.exports = {
  layout: "layouts/artikel.njk",
  eleventyComputed: {
    permalink: (data) =>
      data.lintas
        ? `/artikel/${data.slug}/`
        : `/${data.lini}/${data.jenis[0]}/${data.slug}/`,
  },
};
