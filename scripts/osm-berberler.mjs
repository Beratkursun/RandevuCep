// OpenStreetMap'ten İstanbul'daki gerçek berber/kuaför kayıtlarını çeker ve
// src/lib/gercek-berberler.ts dosyasını üretir.
// Kullanım: node scripts/osm-berberler.mjs
// Veri lisansı: © OpenStreetMap katkıcıları, ODbL 1.0

import { writeFile } from "node:fs/promises";

const SORGU = `[out:json][timeout:90];
(
  node["shop"="hairdresser"](40.85,28.60,41.25,29.35);
  way["shop"="hairdresser"](40.85,28.60,41.25,29.35);
);
out center tags 200;`;

const RENKLER = [
  "linear-gradient(135deg, #0f766e, #134e4a)",
  "linear-gradient(135deg, #7c3aed, #312e81)",
  "linear-gradient(135deg, #f59e0b, #7c2d12)",
  "linear-gradient(135deg, #10b981, #064e3b)",
  "linear-gradient(135deg, #ef4444, #7f1d1d)",
  "linear-gradient(135deg, #6366f1, #1e1b4b)",
];

const HIZMETLER = [
  { id: "kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 30, fiyat: 300 },
  { id: "sakal", ad: "Sakal Tıraşı", kategori: "Sakal", sureDk: 20, fiyat: 180 },
  { id: "kombo", ad: "Saç + Sakal", kategori: "Saç", sureDk: 45, fiyat: 420 },
];

const BERBERLER = [
  { id: "usta", ad: "Usta", uzmanlik: ["Saç", "Sakal"] },
  { id: "ilk", ad: "İlk müsait", uzmanlik: ["Saç"] },
];

function temiz(deger) {
  return typeof deger === "string" ? deger.trim() : "";
}

const yanit = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "RandevuCep/1.0 (egitim projesi)",
  },
  body: new URLSearchParams({ data: SORGU }),
});

if (!yanit.ok) throw new Error(`Overpass hatası: ${yanit.status}`);
const veri = await yanit.json();

const gorulen = new Set();
const kayitlar = [];

for (const el of veri.elements ?? []) {
  const t = el.tags ?? {};
  const ad = temiz(t.name);
  if (!ad || gorulen.has(ad.toLocaleLowerCase("tr"))) continue;
  gorulen.add(ad.toLocaleLowerCase("tr"));

  const semt = temiz(t["addr:suburb"]) || temiz(t["addr:district"]) || temiz(t["addr:city"]) || "İstanbul";
  const sokak = temiz(t["addr:street"]);
  const kapi = temiz(t["addr:housenumber"]);
  const adres = sokak ? `${sokak}${kapi ? " No: " + kapi : ""}` : "Adres bilgisi OpenStreetMap'te yok";

  kayitlar.push({
    ad,
    semt,
    adres,
    telefon: temiz(t.phone) || temiz(t["contact:phone"]),
    web: temiz(t.website) || temiz(t["contact:website"]),
    osm: `${el.type}/${el.id}`,
    lat: el.lat ?? el.center?.lat ?? null,
    lon: el.lon ?? el.center?.lon ?? null,
  });
}

kayitlar.sort((a, b) => a.semt.localeCompare(b.semt, "tr"));
const secilen = kayitlar.slice(0, 30);

const satirlar = secilen.map((k, i) => {
  const id = 1000 + i;
  const aciklama =
    `OpenStreetMap'te kayıtlı gerçek işletme (${k.osm}). ` +
    `Hizmet listesi ve fiyatlar uygulama tarafından örnek olarak üretilmiştir; işletmeyle doğrulanmamıştır.`;
  return `  {
    id: ${id},
    ad: ${JSON.stringify(k.ad)},
    semt: ${JSON.stringify(k.semt)},
    adres: ${JSON.stringify(k.adres)},
    puan: 0,
    renk: ${JSON.stringify(RENKLER[i % RENKLER.length])},
    aciklama: ${JSON.stringify(aciklama)},
    calismaSaatleri: "OpenStreetMap'te belirtilmemiş",
    hizmetler: ${JSON.stringify(HIZMETLER)},
    berberler: ${JSON.stringify(BERBERLER)},
    kaynak: "OSM",
    iletisim: ${JSON.stringify({ telefon: k.telefon, web: k.web, osm: k.osm })},
  },`;
});

const dosya = `// ÜRETİLMİŞ DOSYA — elle düzenlemeyin.
// Kaynak: OpenStreetMap (Overpass API), lisans: ODbL 1.0
// © OpenStreetMap katkıcıları — https://www.openstreetmap.org/copyright
// Yeniden üretmek için: node scripts/osm-berberler.mjs
import type { Salon } from "./types";

export const gercekBerberler: Salon[] = [
${satirlar.join("\n")}
];
`;

await writeFile("src/lib/gercek-berberler.ts", dosya, "utf-8");
console.log(`${secilen.length} gerçek kayıt yazıldı → src/lib/gercek-berberler.ts`);
