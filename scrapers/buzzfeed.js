const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function scrapeBuzzfeed() {
  const { data } = await axios.get("https://www.buzzfeed.com/");
  const $ = cheerio.load(data);

  // Select trending post card
  const firstCard = $("li.trendingPosts_secondaryCard__T092l").first();

  const anchor = firstCard.find("a.splashCard_linkWrap__PEcVi");
  const link = anchor.attr("href")?.startsWith("http")
    ? anchor.attr("href")
    : `https://www.buzzfeed.com${anchor.attr("href")}`;

  const title = anchor.find("h3.splashCard_heading__EzXmj").text().trim();

  if (!title || !link) throw new Error("Unable to find article");

  return {
    title,
    link,
  };
};
