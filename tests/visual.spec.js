const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const sites = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sites.json'), 'utf-8'));

async function loadPage(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(500);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

function saveBaseline(snapshotPath, screenshot) {
  fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
  fs.writeFileSync(snapshotPath, screenshot);
}

async function hideFixedElements(page) {
  await page.addStyleTag({
    content: `*[style*="position: fixed"], *[style*="position:fixed"],
              header, .header, #header, [class*="header"], [class*="navbar"]
              { display: none !important; }`
  });
}

// Her site için ayrı test grubu oluştur
for (const site of sites) {
  test.describe(site.name, () => {

    test('Anasayfa - Tam Sayfa', async ({ page }, testInfo) => {
      await loadPage(page, site.test);
      saveBaseline(testInfo.snapshotPath('anasayfa-tam.png'), await page.screenshot({ fullPage: true }));

      await loadPage(page, site.prod);
      await expect(page).toHaveScreenshot('anasayfa-tam.png', { fullPage: true });
    });

    test('Anasayfa - Gorunen Alan', async ({ page }, testInfo) => {
      await loadPage(page, site.test);
      saveBaseline(testInfo.snapshotPath('anasayfa-viewport.png'), await page.screenshot());

      await loadPage(page, site.prod);
      await expect(page).toHaveScreenshot('anasayfa-viewport.png');
    });

    test('Header', async ({ page }, testInfo) => {
      await loadPage(page, site.test);
      const header1 = page.locator('header, #header, .header, [role="banner"]').first();
      if (!await header1.isVisible()) { test.skip(); return; }
      saveBaseline(testInfo.snapshotPath('header.png'), await header1.screenshot());

      await loadPage(page, site.prod);
      const header2 = page.locator('header, #header, .header, [role="banner"]').first();
      if (!await header2.isVisible()) { test.skip(); return; }
      await expect(header2).toHaveScreenshot('header.png');
    });

    test('Footer', async ({ page }, testInfo) => {
      await loadPage(page, site.test);
      const footer1 = page.locator('footer, #footer, .footer, [class*="footer"], [id*="footer"]').first();
      if (!await footer1.isVisible()) { test.skip(); return; }
      await footer1.scrollIntoViewIfNeeded();
      await hideFixedElements(page);
      saveBaseline(testInfo.snapshotPath('footer.png'), await footer1.screenshot());

      await loadPage(page, site.prod);
      const footer2 = page.locator('footer, #footer, .footer, [class*="footer"], [id*="footer"]').first();
      if (!await footer2.isVisible()) { test.skip(); return; }
      await footer2.scrollIntoViewIfNeeded();
      await hideFixedElements(page);
      await expect(footer2).toHaveScreenshot('footer.png');
    });

  });
}
