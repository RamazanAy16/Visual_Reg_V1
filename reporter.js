class TurkishReporter {
  constructor() {
    this.results = [];
  }

  onTestEnd(test, result) {
    const site = test.parent?.title || 'Genel';
    const name = test.title;
    const status = result.status;
    const duration = (result.duration / 1000).toFixed(1);

    let diffInfo = '';
    if (status === 'failed' && result.error) {
      const msg = result.error.message || '';

      // Piksel farkı
      const pixelMatch = msg.match(/(\d+)\s+pixels?\s+\(ratio\s+([\d.]+)/);
      if (pixelMatch) {
        const pixels = parseInt(pixelMatch[1]).toLocaleString('tr-TR');
        const ratio = (parseFloat(pixelMatch[2]) * 100).toFixed(1);
        diffInfo = `${pixels} piksel farklı (%${ratio})`;
      }

      // Boyut farkı
      const sizeMatch = msg.match(/(\d+)px by (\d+)px.*received (\d+)px by (\d+)px/);
      if (sizeMatch) {
        diffInfo += ` | Boyut: ${sizeMatch[1]}x${sizeMatch[2]}px → ${sizeMatch[3]}x${sizeMatch[4]}px`;
      }
    }

    this.results.push({ site, name, status, duration, diffInfo });
  }

  onEnd(result) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const total = this.results.length;

    // Site isimlerini grupla
    const sites = [...new Set(this.results.map(r => r.site))];

    console.log('\n' + '═'.repeat(60));
    console.log('  UI GORSEL REGRESYON TEST RAPORU');
    console.log('═'.repeat(60));

    for (const site of sites) {
      const siteResults = this.results.filter(r => r.site === site);
      console.log(`\n  [ ${site} ]`);
      for (const r of siteResults) {
        if (r.status === 'passed') {
          console.log(`    ✓  ${r.name} (${r.duration}s)`);
          console.log(`         → Gorsel fark yok, ortamlar ayni gorunuyor`);
        } else if (r.status === 'failed') {
          console.log(`    ✘  ${r.name} (${r.duration}s)`);
          console.log(`         → FARK BULUNDU: ${r.diffInfo}`);
          console.log(`         → Diff gorseli: test-results klasorune bakiniz`);
        } else if (r.status === 'skipped') {
          console.log(`    -  ${r.name}`);
          console.log(`         → Element bulunamadi, gecildi`);
        }
      }
    }

    console.log('\n' + '─'.repeat(60));
    console.log(`  Toplam: ${total} test`);
    console.log(`  Gecti : ${passed} | Basarisiz: ${failed} | Atlandi: ${skipped}`);

    if (failed === 0) {
      console.log('\n  SONUC: TUM TESTLER GECTI - Ortamlar gorsel olarak ayni');
    } else {
      console.log(`\n  SONUC: ${failed} TESTTE FARK BULUNDU - Diff gorsellerini inceleyin`);
    }
    console.log('═'.repeat(60) + '\n');
  }
}

module.exports = TurkishReporter;
