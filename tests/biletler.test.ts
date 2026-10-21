import { beforeEach, describe, expect, it } from "vitest";
import { etkinlikler } from "../src/lib/data";
import { biletlerim } from "../src/lib/biletler.svelte";
import type { SepetKalemi } from "../src/lib/sepet.svelte";

const etkinlik = etkinlikler[0];

describe("biletler", () => {
  beforeEach(() => {
    localStorage.clear();
    biletlerim.liste.length = 0;
  });

  // @lat: [[testler#Biletler#Satın alma bilet kodu üretir ve kalıcılaştırır]]
  it("tarayici ortaminda kod uretir, bileti listeye ve localStorage'a yazar", async () => {
    const kalem: SepetKalemi = {
      etkinlik,
      bilet: etkinlik.biletler[1],
      adet: 2,
    };

    await biletlerim.satinAl([kalem]);

    expect(biletlerim.liste).toHaveLength(1);
    expect(biletlerim.liste[0].kod).toMatch(/^WEB-1-[0-9A-Z]+$/);
    expect(biletlerim.liste[0].kategori).toBe(etkinlik.biletler[1].ad);
    expect(biletlerim.liste[0].adet).toBe(2);

    const kayitli = JSON.parse(localStorage.getItem("biletlerim") ?? "[]");
    expect(kayitli).toHaveLength(1);
    expect(kayitli[0].kod).toBe(biletlerim.liste[0].kod);
  });
});
