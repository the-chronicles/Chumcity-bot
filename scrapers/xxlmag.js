const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function scrapeXXL() {
  try {
    const { data: html } = await axios.get("https://www.xxlmag.com/");
    const $ = cheerio.load(html);

    const firstArticle = $("article").first();

    const title = firstArticle.find("header h2 a span").text().trim();
    const relativeLink = firstArticle.find("header h2 a").attr("href");

    if (!title || !relativeLink) {
      throw new Error("Missing title or link in first article.");
    }

    const link = relativeLink.startsWith("http")
      ? relativeLink
      : `https://www.xxlmag.com${relativeLink.replace(/^\/\//, "/")}`;

    return { title, link };
  } catch (err) {
    throw new Error("Failed to scrape XXLmag: " + err.message);
  }
};
