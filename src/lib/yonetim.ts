// Yönetim panelinin veri sözleşmesi ve tarayıcı yedeği.
// Tauri içinde Rust komutları, tarayıcıda aynı arayüzü taklit eden localStorage yedeği kullanılır.

export type YonetimDurumu = "bekliyor" | "onaylandi" | "iptal";

export interface YonetimSalonu {
  id: number;
  ad: string;
  sehir: string;
  adres: string;
}

export interface YonetimHizmeti {
  id: number;
  salonId: number;
  ad: string;
  sureDk: number;
  fiyat: number;
}

export interface YonetimBerberi {
  id: number;
  salonId: number;
  ad: string;
}

export interface YonetimRandevusu {
  id: number;
  kod: string;
  salonAd: string;
  berberAd: string;
  hizmet: string;
  tarih: string;
  saat: string;
  durum: YonetimDurumu;
  tutar: number;
}

export interface YeniRandevuKaydi {
  kod: string;
  salonId: number;
  berberId: number | null;
  hizmet: string;
  tarih: string;
  saat: string;
  tutar: number;
}

export const DURUMLAR: YonetimDurumu[] = ["bekliyor", "onaylandi", "iptal"];

// @lat: [[yonetim#Panel Akışı]]
export function durumEtiketi(durum: string): string {
  if (durum === "bekliyor") return "Bekliyor";
  if (durum === "onaylandi") return "Onaylandı";
  if (durum === "iptal") return "İptal";
  return durum;
}

export function ozetSayilari(liste: YonetimRandevusu[]) {
  return liste.reduce(
    (t, r) => {
      if (r.durum === "bekliyor") t.bekliyor += 1;
      if (r.durum === "onaylandi") {
        t.onaylandi += 1;
        t.ciro += r.tutar;
      }
      if (r.durum === "iptal") t.iptal += 1;
      return t;
    },
    { bekliyor: 0, onaylandi: 0, iptal: 0, ciro: 0 },
  );
}

// @lat: [[yonetim#Tarayıcı Yedeği]]
const ANAHTAR = "yonetim-verisi";

export interface YedekVeri {
  salonlar: YonetimSalonu[];
  hizmetler: YonetimHizmeti[];
  berberler: YonetimBerberi[];
  randevular: YonetimRandevusu[];
  sayac: number;
}

function bosVeri(): YedekVeri {
  return { salonlar: [], hizmetler: [], berberler: [], randevular: [], sayac: 1 };
}

export function yedekOku(): YedekVeri {
  try {
    if (typeof localStorage === "undefined") return bosVeri();
    const ham = localStorage.getItem(ANAHTAR);
    if (!ham) return bosVeri();
    const veri = JSON.parse(ham);
    if (!veri || !Array.isArray(veri.salonlar) || !Array.isArray(veri.randevular)) return bosVeri();
    return veri as YedekVeri;
  } catch {
    return bosVeri();
  }
}

export function yedekYaz(veri: YedekVeri): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(ANAHTAR, JSON.stringify(veri));
}

export function yedekSalonEkle(ad: string, sehir: string, adres: string): YonetimSalonu {
  const veri = yedekOku();
  const salon: YonetimSalonu = { id: veri.sayac++, ad: ad.trim(), sehir: sehir.trim(), adres: adres.trim() };
  veri.salonlar.push(salon);
  yedekYaz(veri);
  return salon;
}

export function yedekHizmetEkle(salonId: number, ad: string, sureDk: number, fiyat: number): YonetimHizmeti {
  const veri = yedekOku();
  const hizmet: YonetimHizmeti = { id: veri.sayac++, salonId, ad: ad.trim(), sureDk, fiyat };
  veri.hizmetler.push(hizmet);
  yedekYaz(veri);
  return hizmet;
}

export function yedekBerberEkle(salonId: number, ad: string): YonetimBerberi {
  const veri = yedekOku();
  const berber: YonetimBerberi = { id: veri.sayac++, salonId, ad: ad.trim() };
  veri.berberler.push(berber);
  yedekYaz(veri);
  return berber;
}

export function yedekRandevuEkle(kayit: YeniRandevuKaydi): YonetimRandevusu {
  const veri = yedekOku();
  const salon = veri.salonlar.find((s) => s.id === kayit.salonId);
  const berber = kayit.berberId ? veri.berberler.find((b) => b.id === kayit.berberId) : undefined;
  const randevu: YonetimRandevusu = {
    id: veri.sayac++,
    kod: kayit.kod,
    salonAd: salon?.ad ?? "Salon",
    berberAd: berber?.ad ?? "İlk müsait berber",
    hizmet: kayit.hizmet,
    tarih: kayit.tarih,
    saat: kayit.saat,
    durum: "bekliyor",
    tutar: kayit.tutar,
  };
  veri.randevular.unshift(randevu);
  yedekYaz(veri);
  return randevu;
}

export function yedekDurumGuncelle(id: number, durum: YonetimDurumu): void {
  const veri = yedekOku();
  const kayit = veri.randevular.find((r) => r.id === id);
  if (!kayit) throw new Error("randevu bulunamadı");
  if (!DURUMLAR.includes(durum)) throw new Error("geçersiz durum");
  kayit.durum = durum;
  yedekYaz(veri);
}
