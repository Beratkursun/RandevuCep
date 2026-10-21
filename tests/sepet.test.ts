import { beforeEach, describe, expect, it } from "vitest";
import { etkinlikler } from "../src/lib/data";
import { sepet } from "../src/lib/sepet.svelte";

const etkinlik = etkinlikler[0];
const yanTribun = etkinlik.biletler[1];
const kaleArkasi = etkinlik.biletler[0];

describe("sepet", () => {
  beforeEach(() => {
    sepet.temizle();
  });

  // @lat: [[testler#Sepet#Aynı kategoride adet birleşir]]
  it("ayni etkinlik ve kategoride yeni satir acmaz, adedi artirir", () => {
    sepet.ekle(etkinlik, yanTribun, 1);
    sepet.ekle(etkinlik, yanTribun, 2);

    expect(sepet.kalemler).toHaveLength(1);
    expect(sepet.kalemler[0].adet).toBe(3);
  });

  // @lat: [[testler#Sepet#Farklı kategoriler ayrı satır olur]]
  it("farkli bilet kategorilerini ayri satirlarda tutar", () => {
    sepet.ekle(etkinlik, yanTribun, 1);
    sepet.ekle(etkinlik, kaleArkasi, 1);

    expect(sepet.kalemler).toHaveLength(2);
  });

  // @lat: [[testler#Sepet#Toplam ve adet türetilir]]
  it("bilet adedini ve tutari kalemlerden turetir", () => {
    sepet.ekle(etkinlik, yanTribun, 2);
    sepet.ekle(etkinlik, kaleArkasi, 1);

    expect(sepet.adet).toBe(3);
    expect(sepet.toplam).toBe(2 * yanTribun.fiyat + kaleArkasi.fiyat);
  });

  // @lat: [[testler#Sepet#Kalem silinir ve sepet temizlenir]]
  it("kalemi indeksle siler, temizlemede her seyi bosaltir", () => {
    sepet.ekle(etkinlik, yanTribun, 1);
    sepet.ekle(etkinlik, kaleArkasi, 1);
    sepet.sil(0);

    expect(sepet.kalemler).toHaveLength(1);
    expect(sepet.kalemler[0].bilet.ad).toBe(kaleArkasi.ad);

    sepet.temizle();
    expect(sepet.kalemler).toHaveLength(0);
    expect(sepet.toplam).toBe(0);
  });
});
