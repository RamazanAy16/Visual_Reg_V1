const { test, expect } = require('@playwright/test');

const URL1 = process.env.URL1 || 'https://www.takvim.com.tr/';
const URL2 = process.env.URL2 || URL1;

async function loadPage(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
}

// --update-snapshots → URL1'i baseline olarak kaydet
// Normal run        → URL2'yi URL1 baseline'ıyla karşılaştır
function getUrl(isUpdate) {
  return isUpdate ? URL1 : URL2;
}

test('Anasayfa - Tam Sayfa', async ({ page }, testInfo) => {
  const url = getUrl(testInfo.config.updateSnapshots === 'all');
  await loadPage(page, url);
  await expect(page).toHaveScreenshot('anasayfa-tam.png', { fullPage: true });
});

test('Anasayfa - Görünen Alan', async ({ page }, testInfo) => {
  const url = getUrl(testInfo.config.updateSnapshots === 'all');
  await loadPage(page, url);
  await expect(page).toHaveScreenshot('anasayfa-viewport.png');
});

test('Header', async ({ page }, testInfo) => {
  const url = getUrl(testInfo.config.updateSnapshots === 'all');
  await loadPage(page, url);
  const header = page.locator('header, #header, .header, [role="banner"]').first();
  if (await header.isVisible()) {
    await expect(header).toHaveScreenshot('header.png');
  } else {
    test.skip();
  }
});

test('Footer', async ({ page }, testInfo) => {
  const url = getUrl(testInfo.config.updateSnapshots === 'all');
  await loadPage(page, url);
  const footer = page.locator('footer, #footer, .footer').first();
  if (await footer.isVisible()) {
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveScreenshot('footer.png');
  } else {
    test.skip();
  }
});
