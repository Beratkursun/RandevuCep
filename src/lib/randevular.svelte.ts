import type { Randevu, RandevuTaslagi } from "./types";
import { berberBul, salonBul } from "./data";
import { randevuKoduAl } from "./native";

const ANAHTAR = "randevularim";

// @lat: [[randevular#Kalıcılık]]
function yukle(): Randevu[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const kayit = localStorage.getItem(ANAHTAR);
    if (!kayit) return [];
    const veri = JSON.parse(kayit);
    return Array.isArray(veri) ? (veri as Randevu[]) : [];
  } catch {
    return [];
  }
}

export class Randevular {
  liste = $state<Randevu[]>(yukle());

  // @lat: [[randevular#Onay Akışı]]
  async onayla(taslaklar: RandevuTaslagi[]): Promise<Randevu[]> {
    const olusan: Randevu[] = [];

    for (const taslak of taslaklar) {
      const salon = salonBul(taslak.salonId);
      if (!salon) continue;

      const berber = berberBul(salon, taslak.berberId);
      const kod = await randevuKoduAl(taslak.salonId);
      const randevu: Randevu = {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        kod,
        salonId: salon.id,
        berberId: taslak.berberId,
        salonAd: salon.ad,
        berberAd: berber?.ad ?? "İlk müsait berber",
        hizmetler: taslak.hizmetler.map((h) => ({
          ad: h.ad,
          fiyat: h.fiyat,
          sureDk: h.sureDk,
        })),
        tarih: taslak.tarih,
        saat: taslak.saat,
        toplamTutar: taslak.hizmetler.reduce((t, h) => t + h.fiyat, 0),
        toplamSure: taslak.hizmetler.reduce((t, h) => t + h.sureDk, 0),
        durum: "onaylandi",
      };

      this.liste.unshift(randevu);
      olusan.push(randevu);
    }

    this.kaydet();
    return olusan;
  }

  kaydet() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ANAHTAR, JSON.stringify(this.liste));
    }
  }

  temizle() {
    this.liste = [];
    this.kaydet();
  }
}

export const randevular = new Randevular();
