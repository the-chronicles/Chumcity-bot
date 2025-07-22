const puppeteer = require("puppeteer");

const username = "austin40";
const password = "Loving@02";
const postText = "🚨 TMZ: 'The Cosby Show' Star Malcolm-Jamal Warner Dead At 54, Accidental Drowning\nhttps://www.tmz.com/2025/07/21/malcolm-jamal-warner-dead-cosby-show/";

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

    // Click to open the post composer
await page.waitForSelector("textarea", { visible: true });
await page.click("textarea"); // this expands the form

// Wait for the expanded form to appear (includes the button)
await page.waitForSelector("#publisher-button", { visible: true });

// Type in the post text
await page.type("textarea", postText);

console.log("📝 Posting text...");

// Try clicking the Share button
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
