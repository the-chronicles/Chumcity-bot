const puppeteer = require("puppeteer");
const scrapeBuzzfeed = require("./scrapers/buzzfeed");

const username = "buzzfeedcom"; // update this if you're using a different profile
const password = "Loving@02"; // same here

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log("🔐 Logging in...");
    await page.goto("https://chumcity.xyz/welcome", { waitUntil: "networkidle2" });

    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: "networkidle2" })
    ]);

    console.log("✅ Logged in!");

    await page.goto(`https://chumcity.xyz/${username}`, { waitUntil: "networkidle2" });

    // 🔎 SCRAPE LATEST FROM BUZZFEED
    const { title, link } = await scrapeBuzzfeed();
    const postText = `📰 BuzzFeed: ${title}\n${link}`;

    await page.waitForSelector("textarea", { visible: true });
    await page.click("textarea");

    await page.waitForSelector("#publisher-button", { visible: true });
    await page.type("textarea", postText);

    console.log("📝 Posting text...");

    const clicked = await page.evaluate(() => {
      const btn = document.querySelector('#publisher-button');
      if (btn && !btn.disabled && btn.offsetParent !== null) {
        btn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log("🚀 Post submitted!");
    } else {
      console.log("❌ Share button not clickable or not found.");
    }

    await browser.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
    await browser.close();
  }
})();
