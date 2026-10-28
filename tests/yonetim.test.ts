import { beforeEach, describe, expect, it } from "vitest";
import {
  durumEtiketi,
  ozetSayilari,
  yedekDurumGuncelle,
  yedekOku,
  yedekRandevuEkle,
  yedekSalonEkle,
  type YonetimRandevusu,
} from "../src/lib/yonetim";

function randevu(over: Partial<YonetimRandevusu> = {}): YonetimRandevusu {
  return {
    id: 1,
    kod: "RNV-001-ABC123",
    salonAd: "Moda Berber",
    berberAd: "Emre Usta",
    hizmet: "Saç Kesimi",
    tarih: "2026-11-02",
    saat: "14:00",
    durum: "bekliyor",
    tutar: 250,
    ...over,
  };
}

describe("yonetim paneli yardımcıları", () => {
  // @lat: [[testler#Yönetim#Durum etiketleri ve özet hesaplanır]]
  it("durum etiketlerini çevirir, bilinmeyeni ham bırakır ve özeti hesaplar", () => {
    expect(durumEtiketi("bekliyor")).toBe("Bekliyor");
    expect(durumEtiketi("onaylandi")).toBe("Onaylandı");
    expect(durumEtiketi("iptal")).toBe("İptal");
    expect(durumEtiketi("belirsiz")).toBe("belirsiz");

    const ozet = ozetSayilari([
      randevu({ id: 1, durum: "onaylandi", tutar: 250 }),
      randevu({ id: 2, durum: "onaylandi", tutar: 150 }),
      randevu({ id: 3, durum: "bekliyor", tutar: 400 }),
      randevu({ id: 4, durum: "iptal", tutar: 300 }),
    ]);

    expect(ozet).toEqual({ bekliyor: 1, onaylandi: 2, iptal: 1, ciro: 400 });
  });

  // @lat: [[testler#Yönetim#Tarayıcı yedeği kaydı saklar]]
  it("tarayıcı yedeğinde salon ve randevu ekler, durumu günceller", () => {
    const salon = yedekSalonEkle("Moda Berber", "İstanbul", "Moda Cad. 5");
    const kayit = yedekRandevuEkle({
      kod: "WEB-RNV-001-ABC",
      salonId: salon.id,
      berberId: null,
      hizmet: "Saç Kesimi",
      tarih: "2026-11-05",
      saat: "15:00",
      tutar: 250,
    });

    expect(kayit.salonAd).toBe("Moda Berber");
    expect(kayit.berberAd).toBe("İlk müsait berber");
    expect(yedekOku().randevular).toHaveLength(1);

    yedekDurumGuncelle(kayit.id, "onaylandi");
    expect(yedekOku().randevular[0].durum).toBe("onaylandi");
    expect(() => yedekDurumGuncelle(kayit.id, "belirsiz" as never)).toThrow();
  });
});

beforeEach(() => {
  localStorage.clear();
});
