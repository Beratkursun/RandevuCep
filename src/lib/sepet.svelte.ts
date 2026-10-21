// Adım 9: Paylaşılan durum (store) — sepet tüm sayfalardan erişilebilir
// Dosya adı ".svelte.ts" ile bittiği için içinde $state / $derived kullanabiliriz.
import type { BiletKategorisi, Etkinlik } from "./data";

export interface SepetKalemi {
  etkinlik: Etkinlik;
  bilet: BiletKategorisi;
  adet: number;
}

// @lat: [[sepet#Sepet Durumu]]
class Sepet {
  kalemler = $state<SepetKalemi[]>([]);

  // @lat: [[sepet#Türetilmiş Değerler]]
  adet = $derived(this.kalemler.reduce((t, k) => t + k.adet, 0));
  toplam = $derived(this.kalemler.reduce((t, k) => t + k.adet * k.bilet.fiyat, 0));

  // @lat: [[sepet#Birleştirme Kuralı]]
  ekle(etkinlik: Etkinlik, bilet: BiletKategorisi, adet: number) {
    const mevcut = this.kalemler.find(
      (k) => k.etkinlik.id === etkinlik.id && k.bilet.ad === bilet.ad,
    );
    if (mevcut) mevcut.adet += adet;
    else this.kalemler.push({ etkinlik, bilet, adet });
  }

  // @lat: [[sepet#Kalem Silme ve Temizleme]]
  sil(index: number) {
    this.kalemler.splice(index, 1);
  }

  temizle() {
    this.kalemler = [];
  }
}

export const sepet = new Sepet();
