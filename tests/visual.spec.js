const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const URL1 = process.env.URL1 || 'https://www.takvim.com.tr/';
const URL2 = process.env.URL2 || URL1;

async function loadPage(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Lazy load için sayfanın en altına git ve 2 saniye bekle
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  // Bir kere daha aşağı kaydır, kalan lazy load elementleri tetikle
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(500);

  // En üste dön
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

function saveBaseline(snapshotPath, screenshot) {
  fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
  fs.writeFileSync(snapshotPath, screenshot);
}

test('Anasayfa - Tam Sayfa', async ({ page }, testInfo) => {
  await loadPage(page, URL1);
  saveBaseline(testInfo.snapshotPath('anasayfa-tam.png'), await page.screenshot({ fullPage: true }));

  await loadPage(page, URL2);
  await expect(page).toHaveScreenshot('anasayfa-tam.png', { fullPage: true });
});

test('Anasayfa - Gorunen Alan', async ({ page }, testInfo) => {
  await loadPage(page, URL1);
  saveBaseline(testInfo.snapshotPath('anasayfa-viewport.png'), await page.screenshot());

  await loadPage(page, URL2);
  await expect(page).toHaveScreenshot('anasayfa-viewport.png');
});

test('Header', async ({ page }, testInfo) => {
  await loadPage(page, URL1);
  const header1 = page.locator('header, #header, .header, [role="banner"]').first();
  if (!await header1.isVisible()) { test.skip(); return; }
  saveBaseline(testInfo.snapshotPath('header.png'), await header1.screenshot());

  await loadPage(page, URL2);
  const header2 = page.locator('header, #header, .header, [role="banner"]').first();
  if (!await header2.isVisible()) { test.skip(); return; }
  await expect(header2).toHaveScreenshot('header.png');
});

async function hideFixedElements(page) {
  await page.addStyleTag({
    content: `*[style*="position: fixed"], *[style*="position:fixed"],
              header, .header, #header, [class*="header"], [class*="navbar"]
              { display: none !important; }`
  });
}

test('Footer', async ({ page }, testInfo) => {
  await loadPage(page, URL1);
  const footer1 = page.locator('footer, #footer, .footer, [class*="footer"], [id*="footer"]').first();
  if (!await footer1.isVisible()) { test.skip(); return; }
  await footer1.scrollIntoViewIfNeeded();
  await hideFixedElements(page);
  saveBaseline(testInfo.snapshotPath('footer.png'), await footer1.screenshot());

  await loadPage(page, URL2);
  const footer2 = page.locator('footer, #footer, .footer, [class*="footer"], [id*="footer"]').first();
  if (!await footer2.isVisible()) { test.skip(); return; }
  await footer2.scrollIntoViewIfNeeded();
  await hideFixedElements(page);
  await expect(footer2).toHaveScreenshot('footer.png');
});
