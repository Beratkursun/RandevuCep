import { invoke, isTauri } from "@tauri-apps/api/core";
import {
  yedekBerberEkle,
  yedekDurumGuncelle,
  yedekHizmetEkle,
  yedekOku,
  yedekRandevuEkle,
  yedekSalonEkle,
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

export async function yonetimBerberEkle(salonId: number, ad: string): Promise<number> {
  if (tauriMi()) return invoke<number>("vt_berber_ekle", { salonId, ad });
  return yedekBerberEkle(salonId, ad).id;
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
