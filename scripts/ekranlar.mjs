// Sayfaları üç boyutta gezip ekran görüntüsü alır; taşma/kesilme ve konsol hatası kontrolü yapar.
//
// Web (varsayılan):
//   1) bun run build
//   2) python -m http.server 4177 --bind 127.0.0.1 --directory dist   (veya bun run dev)
//   3) bun run ekranlar
//
// Native cihaz/emülatör (tek kare, o an açık ekranı yakalar):
//   bun run ekranlar -- --native=android     → adb exec-out screencap -p
//   bun run ekranlar -- --native=ios         → xcrun simctl io booted screenshot
//   bun run ekranlar -- --native=ios --udid <UDID>   → idb screenshot (varsa)
//   Araç yoksa uyarı verir ve web moduna düşer.
//
// Çıktı: docs/ekranlar/<sayfa>-<boyut>.png · native-<platform>-<zaman>.png · rapor.json
import { spawnSync } from "node:child_process";
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

const argumanlar = process.argv.slice(2);
const nativeArg = argumanlar.find((a) => a.startsWith("--native"));
const nativePlatform = nativeArg
  ? nativeArg.includes("=")
    ? nativeArg.split("=")[1]
    : argumanlar[argumanlar.indexOf(nativeArg) + 1]
  : null;
const udidIndex = argumanlar.indexOf("--udid");
const udid = udidIndex >= 0 ? argumanlar[udidIndex + 1] : process.env.IOS_UDID;

await mkdir(CIKTI, { recursive: true });

function komut(varMi, args) {
  try {
    return spawnSync(varMi, args, { encoding: "buffer" });
  } catch {
    return null;
  }
}

function aracVar(ad) {
  const r = komut(ad, ["--version"]);
  return Boolean(r && r.status === 0);
}

function zaman() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

async function nativeYakala(platform) {
  if (platform === "android") {
    if (!aracVar("adb")) {
      console.warn("adb bulunamadı, web moduna düşülüyor.");
      return false;
    }
    const cihazlar = komut("adb", ["devices"]).stdout?.toString() ?? "";
    if (!/\tdevice/.test(cihazlar)) {
      console.warn("Bağlı Android cihaz/emülatör yok, web moduna düşülüyor.");
      return false;
    }
    const kare = komut("adb", ["exec-out", "screencap", "-p"]);
    if (!kare || kare.status !== 0 || !kare.stdout?.length) {
      console.warn("Android ekran görüntüsü alınamadı, web moduna düşülüyor.");
      return false;
    }
    const dosya = `${CIKTI}/native-android-${zaman()}.png`;
    await writeFile(dosya, kare.stdout);
    console.log(`Android ekran görüntüsü: ${dosya}`);
    return true;
  }

  if (platform === "ios") {
    if (udid && aracVar("idb")) {
      const dosya = `${CIKTI}/native-ios-${zaman()}.png`;
      const r = komut("idb", ["screenshot", "--udid", udid, dosya]);
      if (r && r.status === 0) {
        console.log(`iOS (idb) ekran görüntüsü: ${dosya}`);
        return true;
      }
    }
    if (aracVar("xcrun")) {
      const dosya = `${CIKTI}/native-ios-${zaman()}.png`;
      const r = komut("xcrun", ["simctl", "io", "booted", "screenshot", dosya]);
      if (r && r.status === 0) {
        console.log(`iOS simülatör ekran görüntüsü: ${dosya}`);
        return true;
      }
    }
    console.warn("xcrun/idb bulunamadı veya simülatör açık değil, web moduna düşülüyor.");
    return false;
  }

  console.warn(`Bilinmeyen platform: ${platform}. Kullanım: --native=android|ios`);
  return false;
}

if (nativePlatform) {
  const basarili = await nativeYakala(nativePlatform);
  if (basarili) process.exit(0);
}

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
          if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) return true;
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
