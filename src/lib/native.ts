import { invoke, isTauri } from "@tauri-apps/api/core";
import {
  oturumOku,
  oturumSil,
  oturumYaz,
  yedekBerberDurumGuncelle,
  yedekBerberEkle,
  yedekBerberGiris,
  yedekBerberRandevulari,
  yedekDurumGuncelle,
  yedekHizmetEkle,
  yedekOku,
  yedekRandevuEkle,
  yedekSalonEkle,
  type BerberOturumu,
  type YeniRandevuKaydi,
  type YonetimBerberi,
  type YonetimDurumu,
  type YonetimHizmeti,
  type YonetimRandevusu,
  type YonetimSalonu,
} from "./yonetim";

// @lat: [[randevular#Ortam Ayrımı]]
export function tauriMi(): boolean {
  return typeof window !== "undefined" && isTauri();
}

export async function randevuKoduAl(salonId: number): Promise<string> {
  if (tauriMi()) {
    return invoke<string>("randevu_olustur", { salonId });
  }
  return `WEB-RNV-${String(salonId).padStart(3, "0")}-${Date.now().toString(36).toUpperCase()}`;
}

// @lat: [[yonetim#Komutlar]]
export async function yonetimSalonlari(): Promise<YonetimSalonu[]> {
  if (tauriMi()) return invoke<YonetimSalonu[]>("vt_salon_listele");
  return yedekOku().salonlar;
}

export async function yonetimSalonEkle(ad: string, sehir: string, adres: string): Promise<number> {
  if (tauriMi()) return invoke<number>("vt_salon_ekle", { ad, sehir, adres });
  return yedekSalonEkle(ad, sehir, adres).id;
}

export async function yonetimHizmetleri(salonId: number): Promise<YonetimHizmeti[]> {
  if (tauriMi()) return invoke<YonetimHizmeti[]>("vt_hizmet_listele", { salonId });
  return yedekOku().hizmetler.filter((h) => h.salonId === salonId);
}

export async function yonetimHizmetEkle(
  salonId: number,
  ad: string,
  sureDk: number,
  fiyat: number,
): Promise<number> {
  if (tauriMi()) return invoke<number>("vt_hizmet_ekle", { salonId, ad, sureDk, fiyat });
  return yedekHizmetEkle(salonId, ad, sureDk, fiyat).id;
}

export async function yonetimBerberleri(salonId: number): Promise<YonetimBerberi[]> {
  if (tauriMi()) return invoke<YonetimBerberi[]>("vt_berber_listele", { salonId });
  return yedekOku().berberler.filter((b) => b.salonId === salonId);
}

export async function yonetimBerberEkle(salonId: number, ad: string, pin: string): Promise<number> {
  if (tauriMi()) return invoke<number>("vt_berber_ekle", { salonId, ad, pin });
  return yedekBerberEkle(salonId, ad, pin).id;
}

export async function yonetimRandevulari(): Promise<YonetimRandevusu[]> {
  if (tauriMi()) return invoke<YonetimRandevusu[]>("vt_randevu_listele");
  return yedekOku().randevular;
}

export async function yonetimRandevuKaydet(kayit: YeniRandevuKaydi): Promise<number> {
  if (tauriMi()) return invoke<number>("vt_randevu_kaydet", { kayit });
  return yedekRandevuEkle(kayit).id;
}

export async function yonetimDurumGuncelle(id: number, durum: YonetimDurumu): Promise<void> {
  if (tauriMi()) {
    await invoke<void>("vt_durum_guncelle", { id, durum });
    return;
  }
  yedekDurumGuncelle(id, durum);
}

// @lat: [[yonetim#Berber Girişi]]
export async function berberGiris(salonId: number, ad: string, pin: string): Promise<BerberOturumu> {
  if (tauriMi()) {
    const oturum = await invoke<BerberOturumu>("vt_berber_giris", { salonId, ad, pin });
    oturumYaz(oturum);
    return oturum;
  }
  const oturum = yedekBerberGiris(salonId, ad, pin);
  oturumYaz(oturum);
  return oturum;
}

export function berberCikis(): void {
  oturumSil();
}

export function berberOturumu(): BerberOturumu | null {
  return oturumOku();
}

// @lat: [[yonetim#Berber Paneli]]
export async function berberRandevulari(berberId: number): Promise<YonetimRandevusu[]> {
  if (tauriMi()) return invoke<YonetimRandevusu[]>("vt_berber_randevulari", { berberId });
  return yedekBerberRandevulari(berberId);
}

export async function berberDurumGuncelle(
  berberId: number,
  randevuId: number,
  durum: "onaylandi" | "iptal",
): Promise<void> {
  if (tauriMi()) {
    await invoke<void>("vt_berber_durum_guncelle", { berberId, randevuId, durum });
    return;
  }
  yedekBerberDurumGuncelle(berberId, randevuId, durum);
}
