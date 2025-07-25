const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function scrapeVice() {
  const { data } = await axios.get("https://www.vice.com/en");
  const $ = cheerio.load(data);

  const firstArticle = $("li.wp-block-post").first();

  const title = firstArticle.find("h2.wp-block-post-title a").text().trim();
  const link = firstArticle.find("h2.wp-block-post-title a").attr("href")?.trim();
  const img = firstArticle.find("figure img").attr("src");

  if (!title || !link) throw new Error("Unable to find article");

  return {
    title,
    link,
    img,
  };
};
