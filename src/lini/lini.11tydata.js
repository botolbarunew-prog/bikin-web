module.exports = {
  layout: "layouts/lini.njk",
  eleventyComputed: {
    permalink: (data) => `/${data.slug}/`,
  },
};
