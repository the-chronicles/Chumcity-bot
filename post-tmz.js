const puppeteer = require("puppeteer-core");
const chromium = require('chrome-aws-lambda');
const scrapeTMZ = require("./scrapers/tmz");

const username = "tmzcom"; // change if you're using another account
const password = "Loving@02";

(async () => {
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
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

    // 🔎 SCRAPE LATEST FROM TMZ
    const { title, link } = await scrapeTMZ();
    const postText = `🚨 TMZ: ${title}\n${link}`;

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
