// Sayfaları üç boyutta gezip ekran görüntüsü alır ve taşma/kesilme kontrolü yapar.
// Kullanım:
//   1) bun run build
//   2) python -m http.server 4177 --bind 127.0.0.1 --directory dist   (veya bun run dev)
//   3) bun run ekranlar            (BASE_URL verilmezse http://127.0.0.1:4177)
//
// Çıktı: docs/ekranlar/<sayfa>-<boyut>.png ve docs/ekranlar/rapor.json
//
// Mobil cihazlarda native yakalama (Playwright yerine):
//   Android: adb exec-out screencap -p > ekran.png
//   iOS    : xcrun simctl io booted screenshot ekran.png
//   iOS (fiziksel cihaz): idb screenshot --udid <UDID> ekran.png
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const TABAN = process.env.BASE_URL ?? "http://127.0.0.1:4177";
const CIKTI = "docs/ekranlar";

const BOYUTLAR = [
  { ad: "mobil", width: 390, height: 844, scale: 2 },
  { ad: "tablet", width: 768, height: 1024, scale: 1 },
  { ad: "masaustu", width: 1440, height: 900, scale: 1 },
];

const SAYFALAR = [
  { yol: "/", ad: "kesfet" },
  { yol: "/salon/1/", ad: "salon-detay" },
  { yol: "/randevu/", ad: "sepet" },
  { yol: "/berber/", ad: "berber-giris" },
  { yol: "/yonetim/", ad: "yonetim" },
  { yol: "/profil/", ad: "profil" },
  { yol: "/hakkinda/", ad: "hakkinda" },
];

await mkdir(CIKTI, { recursive: true });

const tarayici = await chromium.launch();
const rapor = [];

for (const boyut of BOYUTLAR) {
  const baglam = await tarayici.newContext({
    viewport: { width: boyut.width, height: boyut.height },
    deviceScaleFactor: boyut.scale,
    isMobile: boyut.ad === "mobil",
    hasTouch: boyut.ad !== "masaustu",
    locale: "tr-TR",
  });
  const sayfa = await baglam.newPage();

  for (const hedef of SAYFALAR) {
    const adres = `${TABAN}${hedef.yol}`;
    const hatalar = [];
    sayfa.on("console", (m) => {
      if (m.type() === "error") hatalar.push(m.text());
    });
    sayfa.on("pageerror", (e) => hatalar.push(String(e)));

    await sayfa.goto(adres, { waitUntil: "networkidle" });
    await sayfa.waitForTimeout(700);

    const tasma = await sayfa.evaluate(() => {
      const genislik = document.documentElement.clientWidth;
      const yatay = document.documentElement.scrollWidth > genislik + 2;

      const kaydirilabilir = (el) => {
        let p = el.parentElement;
        while (p) {
          const s = getComputedStyle(p);
          if (/(auto|scroll)/.test(s.overflowX)) return true;
          p = p.parentElement;
        }
        return false;
      };

      const kesilenler = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (getComputedStyle(el).position === "fixed") continue;
        if (kaydirilabilir(el)) continue;
        if (r.right > genislik + 2 || r.left < -2) {
          kesilenler.push({
            secici:
              el.tagName.toLowerCase() +
              (el.className ? "." + String(el.className).split(" ")[0] : ""),
            sol: Math.round(r.left),
            sag: Math.round(r.right),
          });
        }
      }
      return { genislik, yatay, kesilenler: kesilenler.slice(0, 8) };
    });

    const dosya = `${CIKTI}/${hedef.ad}-${boyut.ad}.png`;
    await sayfa.screenshot({ path: dosya, fullPage: true });

    rapor.push({
      sayfa: hedef.ad,
      boyut: boyut.ad,
      adres,
      dosya,
      yatayTasma: tasma.yatay,
      kesilenler: tasma.kesilenler,
      konsolHatalari: hatalar.slice(0, 5),
    });
    console.log(
      `${hedef.ad}/${boyut.ad} → ${tasma.yatay ? "YATAY TAŞMA" : "tamam"}${
        tasma.kesilenler.length ? " (" + tasma.kesilenler.length + " kesik)" : ""
      }`,
    );
  }

  await baglam.close();
}

await tarayici.close();
await writeFile(`${CIKTI}/rapor.json`, JSON.stringify(rapor, null, 2), "utf-8");

const sorunlu = rapor.filter(
  (r) => r.yatayTasma || r.kesilenler.length > 0 || r.konsolHatalari.length > 0,
);
console.log(`\n${rapor.length} görüntü alındı, ${sorunlu.length} sayfada sorun bulundu.`);
for (const s of sorunlu) {
  console.log(
    `- ${s.sayfa}/${s.boyut}: taşma=${s.yatayTasma} kesik=${s.kesilenler.length} hata=${s.konsolHatalari.length}`,
  );
}
process.exit(sorunlu.length > 0 ? 1 : 0);
