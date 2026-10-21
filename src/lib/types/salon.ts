// @lat: [[veri-modeli#Veri Tipleri]]
export type HizmetKategorisi = "Saç" | "Sakal" | "Bakım" | "Boyama";

export interface Hizmet {
  id: string;
  ad: string;
  kategori: HizmetKategorisi;
  sureDk: number;
  fiyat: number;
}

export interface Berber {
  id: string;
  ad: string;
  uzmanlik: HizmetKategorisi[];
}

export interface Salon {
  id: number;
  ad: string;
  semt: string;
  adres: string;
  puan: number;
  renk: string;
  aciklama: string;
  calismaSaatleri: string;
  hizmetler: Hizmet[];
  berberler: Berber[];
}
