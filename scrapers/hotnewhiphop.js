// scrapers/hotnewhiphop.js
const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeHotNewHipHop() {
  try {
    const { data: html } = await axios.get("https://www.hotnewhiphop.com/");
    const $ = cheerio.load(html);

    // Target the first news grid item with a valid structure
    const firstArticle = $("a.text-base.font-semibold").first();

    const title = firstArticle.text().trim();
    let link = firstArticle.attr("href");

    if (link && !link.startsWith("http")) {
      link = "https://www.hotnewhiphop.com" + link;
    }

    if (!title || !link) {
      throw new Error("Missing title or link in first article.");
    }

    return { title, link };
  } catch (err) {
    throw new Error("Failed to scrape HotNewHipHop: " + err.message);
  }
}

module.exports = scrapeHotNewHipHop;
