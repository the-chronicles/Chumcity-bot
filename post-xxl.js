const puppeteer = require("puppeteer");
const scrapeXXL = require("./scrapers/xxlmag");

const username = "xxlmagcom"; // your ChumCity profile for XXL
const password = "Loving@02";

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

    const { title, link } = await scrapeXXL();
    const postText = `🎵 XXL: ${title}\n${link}`;

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

    console.log(clicked ? "🚀 Post submitted!" : "❌ Share button not clickable or not found.");

    await browser.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
    await browser.close();
  }
})();
