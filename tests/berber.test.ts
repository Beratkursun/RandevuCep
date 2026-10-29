import { beforeEach, describe, expect, it } from "vitest";
import type { YonetimRandevusu } from "../src/lib/yonetim";
import {
  oturumOku,
  yedekBerberDurumGuncelle,
  yedekBerberEkle,
  yedekBerberGiris,
  yedekBerberRandevulari,
  bosSaatler,
  kazancOzeti,
  yedekKapaliSlotlar,
  yedekSlotAc,
  yedekSlotKapat,
  yedekRandevuEkle,
  yedekSalonEkle,
} from "../src/lib/yonetim";

describe("berber girişi", () => {
  // @lat: [[testler#Berber#Tarayıcı yedeğinde berber girişi çalışır]]
  it("salon + ad + PIN doğrular, yalnızca kendi randevularını gösterir", () => {
    const salon = yedekSalonEkle("Moda Berber", "İstanbul", "Moda Cad. 5");
    const emre = yedekBerberEkle(salon.id, "Emre Usta", "1234");
    const mert = yedekBerberEkle(salon.id, "Mert Usta", "5678");

    const kendi = yedekRandevuEkle({
      kod: "WEB-RNV-001-A",
      salonId: salon.id,
      berberId: emre.id,
      hizmet: "Saç Kesimi",
      tarih: "2026-11-06",
      saat: "14:00",
      tutar: 250,
    });
    yedekRandevuEkle({
      kod: "WEB-RNV-001-B",
      salonId: salon.id,
      berberId: mert.id,
      hizmet: "Sakal",
      tarih: "2026-11-06",
      saat: "15:00",
      tutar: 150,
    });

    const oturum = yedekBerberGiris(salon.id, "emre usta", "1234");
    expect(oturum.ad).toBe("Emre Usta");
    expect(oturum.salonAd).toBe("Moda Berber");
    expect(oturumOku()).toBeNull();

    expect(() => yedekBerberGiris(salon.id, "Emre Usta", "9999")).toThrow("PIN hatalı");
    expect(() => yedekBerberGiris(salon.id, "Emre Usta", "12")).toThrow();
    expect(() => yedekBerberEkle(salon.id, "Ali Usta", "abcd")).toThrow();

    const liste = yedekBerberRandevulari(emre.id);
    expect(liste).toHaveLength(1);
    expect(liste[0].id).toBe(kendi.id);

    expect(() => yedekBerberDurumGuncelle(mert.id, kendi.id, "onaylandi")).toThrow();
    yedekBerberDurumGuncelle(emre.id, kendi.id, "onaylandi");
    expect(yedekBerberRandevulari(emre.id)[0].durum).toBe("onaylandi");
  });
  // @lat: [[testler#Berber#Tarayıcı yedeğinde slot kapatılır]]
  it("kapalı slotu kaydeder, tekrar eklemez ve yeniden açar", () => {
    const salon = yedekSalonEkle("Moda Berber", "İstanbul", "");
    const emre = yedekBerberEkle(salon.id, "Emre Usta", "1234");

    yedekSlotKapat(emre.id, "2026-11-08", "10:00");
    yedekSlotKapat(emre.id, "2026-11-08", "10:00");
    expect(yedekKapaliSlotlar(emre.id, "2026-11-08")).toEqual(["10:00"]);
    expect(() => yedekSlotKapat(emre.id, "2026-11-08", "9:00")).toThrow();

    yedekSlotAc(emre.id, "2026-11-08", "10:00");
    expect(yedekKapaliSlotlar(emre.id, "2026-11-08")).toEqual([]);
    expect(() => yedekSlotAc(emre.id, "2026-11-08", "10:00")).toThrow();
  });
  // @lat: [[testler#Berber#Kazanç ve boş saatler hesaplanır]]
  it("onaylı randevulardan gün/hafta/ay kazancı ve boş saatleri hesaplar", () => {
    const bugun = "2026-11-10";
    const kayit = (id: number, tarih: string, durum: YonetimRandevusu["durum"], tutar: number): YonetimRandevusu => ({
      id,
      kod: `K-${id}`,
      salonAd: "Moda Berber",
      berberAd: "Emre Usta",
      hizmet: "Saç Kesimi",
      tarih,
      saat: "10:00",
      durum,
      tutar,
    });
    const liste = [
      kayit(1, "2026-11-10", "onaylandi", 250),
      kayit(2, "2026-11-09", "onaylandi", 150),
      kayit(3, "2026-11-01", "onaylandi", 100),
      kayit(4, "2026-11-10", "iptal", 999),
      kayit(5, "2026-10-31", "onaylandi", 50),
    ];

    const ozet = kazancOzeti(liste, bugun);
    expect(ozet.bugun).toBe(250);
    expect(ozet.hafta).toBe(400);
    expect(ozet.ay).toBe(500);
    expect(ozet.gunluk).toHaveLength(7);
    expect(ozet.gunluk.at(-1)).toEqual({ gun: bugun, tutar: 250 });

    expect(bosSaatler(["10:00", "11:00"], ["09:00", "10:00", "11:00", "12:00"])).toEqual([
      "09:00",
      "12:00",
    ]);
  });
});

beforeEach(() => {
  localStorage.clear();
});
