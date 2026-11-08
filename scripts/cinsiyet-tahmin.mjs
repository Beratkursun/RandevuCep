// Ağ erişimi olmadan, işletme adından cinsiyet tahmini yapar ve
// src/lib/gercek-berberler.ts içindeki boş cinsiyet alanlarını doldurur.
import { readFileSync, writeFileSync } from "node:fs";

const yol = "src/lib/gercek-berberler.ts";
let metin = readFileSync(yol, "utf8");

metin = metin.replace(/ad: "([^"]+)",[\s\S]*?cinsiyet: undefined,/g, (blok, ad) => {
  const a = ad.toLocaleLowerCase("tr");
  const c = /(bayan|kadın|kadin|hanım|güzellik)/.test(a)
    ? "kadin"
    : /(erkek|bay)/.test(a)
      ? "erkek"
      : "unisex";
  return blok.replace("cinsiyet: undefined", `cinsiyet: "${c}"`);
});

writeFileSync(yol, metin, "utf8");
console.log("cinsiyet alanları dolduruldu");
