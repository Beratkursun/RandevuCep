import { describe, expect, it } from "vitest";
import {
  baslangicFiyat,
  hizmetBul,
  salonBul,
  salonlar,
  tarihYaz,
  tl,
  toplamSure,
  toplamTutar,
} from "../src/lib/data";
import { kesim, sakal, salon } from "./helpers";

describe("salon kataloğu", () => {
  // @lat: [[testler#Veri#Salon kimlikle bulunur]]
  it("salonu kimlikle bulur, olmayan kimlikte undefined doner", () => {
    expect(salonlar).toHaveLength(12);
    expect(salonBul(1)?.ad).toBe("Kadıköy Berber Atölyesi");
    expect(salonBul(99)).toBeUndefined();
    expect(hizmetBul(salon, kesim.id)?.ad).toBe(kesim.ad);
    expect(hizmetBul(salon, "yok")).toBeUndefined();
  });

  // @lat: [[testler#Veri#Fiyat ve tarih tr-TR biçimlenir]]
  it("fiyati TL, tarihi Turkce uzun bicimde yazar", () => {
    expect(tl(1500)).toContain("1.500");
    expect(tl(1500)).toContain("₺");
    expect(tarihYaz("2026-10-18", "19:00")).toContain("Ekim");
    expect(tarihYaz("2026-10-18", "19:00")).toContain("19:00");
    expect(tarihYaz("")).toBe("");
  });

  // @lat: [[testler#Veri#Çok hizmetli toplamlar hesaplanır]]
  it("birden fazla hizmetin suresini ve tutarini toplar", () => {
    expect(toplamSure([kesim, sakal])).toBe(kesim.sureDk + sakal.sureDk);
    expect(toplamTutar([kesim, sakal])).toBe(kesim.fiyat + sakal.fiyat);
    expect(baslangicFiyat(salon)).toBe(Math.min(...salon.hizmetler.map((h) => h.fiyat)));
  });
});
