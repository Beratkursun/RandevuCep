// Adım 4: Veri modeli — şimdilik sabit (mock) veri, ileride bir API'den gelebilir

// @lat: [[veri-modeli#Veri Tipleri]]
export type Kategori = "Futbol" | "Basketbol" | "Konser" | "Tiyatro";

export interface BiletKategorisi {
  ad: string;
  fiyat: number;
}

export interface Etkinlik {
  id: number;
  baslik: string;
  kategori: Kategori;
  tarih: string; // ISO formatında: "2026-10-18T19:00"
  mekan: string;
  sehir: string;
  renk: string; // afiş görseli yerine CSS gradyanı
  aciklama: string;
  biletler: BiletKategorisi[];
}

export const kategoriler: Kategori[] = ["Futbol", "Basketbol", "Konser", "Tiyatro"];

// @lat: [[veri-modeli#Katalog ve Arama]]
export const etkinlikler: Etkinlik[] = [
  {
    id: 1,
    baslik: "Boğaziçi SK – Anadolu FK",
    kategori: "Futbol",
    tarih: "2026-10-18T19:00",
    mekan: "Kuzey Stadyumu",
    sehir: "İstanbul",
    renk: "linear-gradient(135deg, #e4002b, #7a0016)",
    aciklama: "Ligin 9. haftasında zirve mücadelesi. Kapılar maçtan 2 saat önce açılır.",
    biletler: [
      { ad: "Kale Arkası", fiyat: 450 },
      { ad: "Yan Tribün", fiyat: 900 },
      { ad: "Maraton", fiyat: 1500 },
    ],
  },
  {
    id: 2,
    baslik: "Ege Yıldızları – Başkent Basket",
    kategori: "Basketbol",
    tarih: "2026-10-22T20:30",
    mekan: "Kordon Spor Salonu",
    sehir: "İzmir",
    renk: "linear-gradient(135deg, #f97316, #9a3412)",
    aciklama: "Normal sezon karşılaşması. Salona giriş için biletinizi telefonunuzda gösterin.",
    biletler: [
      { ad: "Üst Kat", fiyat: 300 },
      { ad: "Alt Kat", fiyat: 650 },
      { ad: "Parke Kenarı", fiyat: 2200 },
    ],
  },
  {
    id: 3,
    baslik: "Gece Yarısı Orkestrası",
    kategori: "Konser",
    tarih: "2026-11-02T21:00",
    mekan: "Açıkhava Sahnesi",
    sehir: "İstanbul",
    renk: "linear-gradient(135deg, #7c3aed, #1e1b4b)",
    aciklama: "Yeni albüm turnesinin İstanbul durağı. 18 yaş sınırı vardır.",
    biletler: [
      { ad: "Ayakta", fiyat: 750 },
      { ad: "Tribün", fiyat: 1100 },
    ],
  },
  {
    id: 4,
    baslik: "Hamlet",
    kategori: "Tiyatro",
    tarih: "2026-10-25T20:00",
    mekan: "Şehir Tiyatrosu Büyük Sahne",
    sehir: "Ankara",
    renk: "linear-gradient(135deg, #0f766e, #134e4a)",
    aciklama: "Shakespeare'in klasik eseri, iki perde. Oyun süresi 2 saat 40 dakikadır.",
    biletler: [
      { ad: "Balkon", fiyat: 250 },
      { ad: "Salon", fiyat: 400 },
    ],
  },
  {
    id: 5,
    baslik: "Karadeniz Gücü – Boğaziçi SK",
    kategori: "Futbol",
    tarih: "2026-11-08T16:00",
    mekan: "Sahil Arena",
    sehir: "Trabzon",
    renk: "linear-gradient(135deg, #1d4ed8, #7f1d1d)",
    aciklama: "Deplasman tribünü biletleri yalnızca misafir taraftarlara satılır.",
    biletler: [
      { ad: "Kale Arkası", fiyat: 350 },
      { ad: "Kapalı Tribün", fiyat: 800 },
    ],
  },
  {
    id: 6,
    baslik: "Caz Günleri",
    kategori: "Konser",
    tarih: "2026-11-14T20:00",
    mekan: "Kültür Merkezi",
    sehir: "İzmir",
    renk: "linear-gradient(135deg, #ca8a04, #422006)",
    aciklama: "Üç farklı caz grubu aynı gecede sahnede.",
    biletler: [
      { ad: "Genel Giriş", fiyat: 500 },
      { ad: "Masa", fiyat: 1200 },
    ],
  },
];

export function etkinlikBul(id: number): Etkinlik | undefined {
  return etkinlikler.find((e) => e.id === id);
}

// Yardımcılar: para ve tarih biçimlendirme
// @lat: [[veri-modeli#Biçimlendirme]]
export const tl = (tutar: number) =>
  tutar.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export const tarihYaz = (iso: string) =>
  new Date(iso).toLocaleString("tr-TR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
