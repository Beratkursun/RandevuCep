import { beforeEach, describe, expect, it } from "vitest";
import { randevuSepeti } from "../src/lib/randevu-sepeti.svelte";
import { kesim, sakal, taslak } from "./helpers";

describe("randevu sepeti", () => {
  beforeEach(() => {
    randevuSepeti.temizle();
    randevuSepeti.dogrudanTemizle();
  });

  // @lat: [[testler#Sepet#Aynı taslak ikinci kez eklenmez]]
  it("ayni taslagi ikinci kez eklemez", () => {
    const t = taslak();

    expect(randevuSepeti.ekle(t)).toBe(true);
    expect(randevuSepeti.ekle({ ...t, id: "t2" })).toBe(false);
    expect(randevuSepeti.taslaklar).toHaveLength(1);
  });

  // @lat: [[testler#Sepet#Farklı hizmetler ayrı taslak olur]]
  it("farkli hizmetleri ayri taslaklarda tutar", () => {
    randevuSepeti.ekle(taslak({ hizmetler: [kesim] }));
    randevuSepeti.ekle(taslak({ id: "t2", hizmetler: [kesim, sakal] }));

    expect(randevuSepeti.taslaklar).toHaveLength(2);
  });

  // @lat: [[testler#Sepet#Toplam tutar ve süre türetilir]]
  it("taslak sayisini, tutari ve sureyi turetir", () => {
    randevuSepeti.ekle(taslak({ hizmetler: [kesim] }));
    randevuSepeti.ekle(taslak({ id: "t2", hizmetler: [sakal], saat: "11:00" }));

    expect(randevuSepeti.adet).toBe(2);
    expect(randevuSepeti.toplamTutar).toBe(kesim.fiyat + sakal.fiyat);
    expect(randevuSepeti.toplamSure).toBe(kesim.sureDk + sakal.sureDk);
  });

  // @lat: [[testler#Sepet#Taslak silinir ve sepet temizlenir]]
  it("taslagi indeksle siler, temizlemede her seyi bosaltir", () => {
    randevuSepeti.ekle(taslak({ hizmetler: [kesim] }));
    randevuSepeti.ekle(taslak({ id: "t2", hizmetler: [sakal], saat: "11:00" }));
    randevuSepeti.sil(0);

    expect(randevuSepeti.taslaklar).toHaveLength(1);
    expect(randevuSepeti.taslaklar[0].hizmetler[0].id).toBe(sakal.id);

    randevuSepeti.temizle();
    expect(randevuSepeti.taslaklar).toHaveLength(0);
    expect(randevuSepeti.toplamTutar).toBe(0);
  });

  // @lat: [[testler#Sepet#Doğrudan taslak ayrı tutulur]]
  it("dogrudan randevu taslagini sepetten ayri tutar", () => {
    const t = taslak();
    randevuSepeti.dogrudanAyarla(t);

    expect(randevuSepeti.dogrudan?.id).toBe(t.id);
    expect(randevuSepeti.taslaklar).toHaveLength(0);

    randevuSepeti.dogrudanTemizle();
    expect(randevuSepeti.dogrudan).toBeNull();
  });
});
