# UI Görsel Regresyon Test Aracı

Playwright'ın kendi `toHaveScreenshot()` özelliğini kullanarak iki ortamın (Test/Preprod) ana sayfasını görsel olarak karşılaştıran otomasyon aracı.

---

## Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|---|---|
| [Playwright](https://playwright.dev/) | Browser otomasyonu ve görsel karşılaştırma motoru |
| Node.js | Çalışma ortamı |
| Chromium | Headless browser (ekran görüntüsü için) |

---

## Nasıl Çalışır?

1. **Baseline oluşturma** — Test ortamının ekran görüntüsü alınır ve referans olarak `__snapshots__` klasörüne kaydedilir.
2. **Karşılaştırma** — Preprod ortamının ekran görüntüsü alınır ve baseline ile piksel piksel karşılaştırılır.
3. **Raporlama** — Fark varsa terminalde detaylı çıktı verilir, `test-results` klasörüne diff görseli kaydedilir.

---

## Yapılan Testler

| Test | Açıklama |
|---|---|
| Anasayfa - Tam Sayfa | Scroll dahil tüm sayfayı karşılaştırır |
| Anasayfa - Görünen Alan | Sadece ekranda görünen alanı karşılaştırır |
| Header | Header elementini karşılaştırır |
| Footer | Footer elementini karşılaştırır |

---

## Kurulum

```bash
npm install
npx playwright install chromium
```

---

## Kullanım

### 1. Klasöre gir
```powershell
cd C:\Users\ramaz\Desktop\Bot_Dersi\playwright-visual
```

### 2. Baseline oluştur (ilk seferinde veya Test ortamı güncellendiğinde)
```powershell
$env:URL1='https://test.site.com'; npx playwright test --update-snapshots
```
Test ortamının fotoğrafları `__snapshots__` klasörüne referans olarak kaydedilir.

### 3. Preprod ile karşılaştır (her deploy sonrası)
```powershell
$env:URL1='https://test.site.com'; $env:URL2='https://preprod.site.com'; npx playwright test
```

---

## Terminal Çıktısı

```
✘  Anasayfa - Tam Sayfa
     → FARK BULUNDU: 382.740 piksel farklı (%6.0) | Boyut: 1440x4441px → 1440x4412px
     → Diff gorseli: test-results klasorune bakiniz

✓  Header
     → Gorsel fark yok, ortamlar ayni gorunuyor

SONUC: 1 TESTTE FARK BULUNDU - Diff gorsellerini inceleyin
```

---

## Sonuç Yorumlama

| Sonuç | Anlam | Yapılacak |
|---|---|---|
| `PASSED` | Görsel fark yok | Bir şey yapmana gerek yok |
| `FAILED` | Fark bulundu | `test-results` klasöründeki `diff.png`'i aç |
| `SKIPPED` | Element bulunamadı | Selector'ı kontrol et |

### Diff görselleri nerede?
```
playwright-visual/
└── test-results/
    └── [test-adi]-chromium/
        ├── actual.png    → Preprod'un şu anki görüntüsü
        ├── expected.png  → Test ortamının baseline görüntüsü
        └── diff.png      → Farkların kırmızı ile işaretlendiği görsel
```

---

## Proje Yapısı

```
playwright-visual/
├── tests/
│   └── visual.spec.js       # Test dosyası
├── __snapshots__/           # Baseline görseller (otomatik oluşur)
├── test-results/            # Diff görseller (sadece FAILED testlerde oluşur)
├── playwright.config.js     # Playwright ayarları
├── reporter.js              # Özel Türkçe terminal raporu
└── README.md
```
