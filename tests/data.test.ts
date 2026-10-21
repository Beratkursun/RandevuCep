import { describe, expect, it } from "vitest";
import { etkinlikBul, etkinlikler, tarihYaz, tl } from "../src/lib/data";

describe("etkinlik katalogu", () => {
  // @lat: [[testler#Veri#Etkinlik kimlikle bulunur]]
  it("etkinligi kimlikle bulur, olmayan kimlikte undefined doner", () => {
    expect(etkinlikler).toHaveLength(6);
    expect(etkinlikBul(3)?.baslik).toBe("Gece Yarısı Orkestrası");
    expect(etkinlikBul(99)).toBeUndefined();
  });

  // @lat: [[testler#Veri#Fiyat ve tarih tr-TR biçimlenir]]
  it("fiyati TL, tarihi Turkce uzun bicimde yazar", () => {
    expect(tl(1500)).toContain("1.500");
    expect(tl(1500)).toContain("₺");
    expect(tarihYaz("2026-10-18T19:00")).toContain("Ekim");
    expect(tarihYaz("2026-10-18T19:00")).toContain("19:00");
  });
});
