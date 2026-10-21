import type { Hizmet } from "./salon";

export type RandevuDurumu = "onaylandi" | "iptal";

export interface RandevuTaslagi {
  id: string;
  salonId: number;
  berberId: string | null;
  hizmetler: Hizmet[];
  tarih: string;
  saat: string;
}

export interface RandevuHizmeti {
  ad: string;
  fiyat: number;
  sureDk: number;
}

export interface Randevu {
  id: string;
  kod: string;
  salonId: number;
  berberId: string | null;
  salonAd: string;
  berberAd: string;
  hizmetler: RandevuHizmeti[];
  tarih: string;
  saat: string;
  toplamTutar: number;
  toplamSure: number;
  durum: RandevuDurumu;
}
