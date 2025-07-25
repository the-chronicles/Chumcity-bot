const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function scrapeTMZ() {
  try {
    const { data } = await axios.get("https://www.tmz.com/");
    const $ = cheerio.load(data);

    const firstArticle = $(".hero-bar__card").first();
    const link = firstArticle.find("a").attr("href");
    const title = firstArticle.find("h3.hero-bar__card-title").text().trim();

    if (!title || !link) {
      throw new Error("Missing title or link in first article.");
    }

    return {
      title,
      link: link.startsWith("http") ? link : `https://www.tmz.com${link}`
    };
  } catch (error) {
    throw new Error("Failed to scrape TMZ: " + error.message);
  }
};
