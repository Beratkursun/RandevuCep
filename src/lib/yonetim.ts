// Yönetim panelinin ve berber oturumunun veri sözleşmesi.
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
  pin?: string;
}

export interface YonetimRandevusu {
  id: number;
  kod: string;
  salonAd: string;
  berberId?: number | null;
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

export interface BerberOturumu {
  id: number;
  ad: string;
  salonId: number;
  salonAd: string;
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

export function yedekBerberEkle(salonId: number, ad: string, pin: string): YonetimBerberi {
  if (!/^\d{4}$/.test(pin)) throw new Error("PIN 4 haneli olmalı");
  const veri = yedekOku();
  const berber: YonetimBerberi = { id: veri.sayac++, salonId, ad: ad.trim(), pin };
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
    berberId: kayit.berberId,
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

// @lat: [[yonetim#Berber Girişi]]
const OTURUM_ANAHTARI = "berber-oturum";

export function oturumOku(): BerberOturumu | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const ham = localStorage.getItem(OTURUM_ANAHTARI);
    if (!ham) return null;
    const veri = JSON.parse(ham);
    return veri && typeof veri.id === "number" ? (veri as BerberOturumu) : null;
  } catch {
    return null;
  }
}

export function oturumYaz(oturum: BerberOturumu): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(OTURUM_ANAHTARI, JSON.stringify(oturum));
}

export function oturumSil(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(OTURUM_ANAHTARI);
}

export function yedekBerberGiris(salonId: number, ad: string, pin: string): BerberOturumu {
  if (!/^\d{4}$/.test(pin)) throw new Error("PIN 4 haneli olmalı");
  const veri = yedekOku();
  const salon = veri.salonlar.find((s) => s.id === salonId);
  if (!salon) throw new Error("salon bulunamadı");
  const berber = veri.berberler.find(
    (b) => b.salonId === salonId && b.ad.toLocaleLowerCase("tr") === ad.trim().toLocaleLowerCase("tr"),
  );
  if (!berber) throw new Error("berber bulunamadı");
  if (berber.pin !== pin) throw new Error("PIN hatalı");
  return { id: berber.id, ad: berber.ad, salonId, salonAd: salon.ad };
}

// @lat: [[yonetim#Berber Paneli]]
export function yedekBerberRandevulari(berberId: number): YonetimRandevusu[] {
  return yedekOku().randevular.filter((r) => r.berberId === berberId);
}

export function yedekBerberDurumGuncelle(berberId: number, randevuId: number, durum: "onaylandi" | "iptal"): void {
  const veri = yedekOku();
  const kayit = veri.randevular.find((r) => r.id === randevuId);
  if (!kayit || kayit.berberId !== berberId) throw new Error("randevu bulunamadı veya bu berbere ait değil");
  kayit.durum = durum;
  yedekYaz(veri);
}
