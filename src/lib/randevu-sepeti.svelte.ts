import type { RandevuTaslagi } from "./types";
import { toplamSure as sureHesapla, toplamTutar as tutarHesapla } from "./data";

function ayniTaslak(a: RandevuTaslagi, b: RandevuTaslagi): boolean {
  return (
    a.salonId === b.salonId &&
    a.berberId === b.berberId &&
    a.tarih === b.tarih &&
    a.saat === b.saat &&
    a.hizmetler.length === b.hizmetler.length &&
    a.hizmetler.every((h, i) => h.id === b.hizmetler[i]?.id)
  );
}

class RandevuSepeti {
  taslaklar = $state<RandevuTaslagi[]>([]);
  dogrudan = $state<RandevuTaslagi | null>(null);

  // @lat: [[sepet#Türetilmiş Değerler]]
  adet = $derived(this.taslaklar.length);
  toplamTutar = $derived(this.taslaklar.reduce((t, x) => t + tutarHesapla(x.hizmetler), 0));
  toplamSure = $derived(this.taslaklar.reduce((t, x) => t + sureHesapla(x.hizmetler), 0));

  // @lat: [[sepet#Taslak Ekleme]]
  ekle(taslak: RandevuTaslagi): boolean {
    if (this.taslaklar.some((t) => ayniTaslak(t, taslak))) return false;
    this.taslaklar.push(taslak);
    return true;
  }

  // @lat: [[sepet#Silme ve Temizleme]]
  sil(index: number) {
    this.taslaklar.splice(index, 1);
  }

  temizle() {
    this.taslaklar = [];
  }

  // @lat: [[sepet#Doğrudan Randevu]]
  dogrudanAyarla(taslak: RandevuTaslagi) {
    this.dogrudan = taslak;
  }

  dogrudanTemizle() {
    this.dogrudan = null;
  }
}

export const randevuSepeti = new RandevuSepeti();
