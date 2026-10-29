import { beforeEach, describe, expect, it } from "vitest";
import {
  oturumOku,
  yedekBerberDurumGuncelle,
  yedekBerberEkle,
  yedekBerberGiris,
  yedekBerberRandevulari,
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
});

beforeEach(() => {
  localStorage.clear();
});
