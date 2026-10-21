import { beforeEach, describe, expect, it } from "vitest";
import { Randevular, randevular } from "../src/lib/randevular.svelte";
import { kesim, sakal, salon, taslak } from "./helpers";

describe("randevular", () => {
  beforeEach(() => {
    localStorage.clear();
    randevular.liste.length = 0;
  });

  // @lat: [[testler#Randevular#Onay kodu üretir ve kalıcılaştırır]]
  it("tarayici ortaminda kod uretir, randevuyu listeye ve localStorage'a yazar", async () => {
    await randevular.onayla([taslak({ hizmetler: [kesim, sakal] })]);

    expect(randevular.liste).toHaveLength(1);
    expect(randevular.liste[0].kod).toMatch(/^WEB-RNV-001-[0-9A-Z]+$/);
    expect(randevular.liste[0].salonAd).toBe(salon.ad);
    expect(randevular.liste[0].berberAd).toBe("Emre Usta");
    expect(randevular.liste[0].hizmetler.map((h) => h.ad)).toEqual([kesim.ad, sakal.ad]);
    expect(randevular.liste[0].toplamTutar).toBe(kesim.fiyat + sakal.fiyat);
    expect(randevular.liste[0].toplamSure).toBe(kesim.sureDk + sakal.sureDk);

    const kayitli = JSON.parse(localStorage.getItem("randevularim") ?? "[]");
    expect(kayitli).toHaveLength(1);
    expect(kayitli[0].kod).toBe(randevular.liste[0].kod);
  });

  // @lat: [[testler#Randevular#İlk müsait berber boş kimlikle saklanır]]
  it("berber secilmezse ilk musait berber etiketiyle saklar", async () => {
    await randevular.onayla([taslak({ berberId: null })]);

    expect(randevular.liste[0].berberId).toBeNull();
    expect(randevular.liste[0].berberAd).toBe("İlk müsait berber");
  });

  // @lat: [[testler#Randevular#Bozuk kayıt boş listeyle açılır]]
  it("localStorage'daki bozuk kaydi bos liste kabul eder", () => {
    localStorage.setItem("randevularim", "bozuk-json");

    const yeni = new Randevular();
    expect(yeni.liste).toEqual([]);
  });
});
