import type { Berber, Hizmet, HizmetKategorisi, Salon } from "./types";

export const hizmetKategorileri: HizmetKategorisi[] = ["Saç", "Sakal", "Bakım", "Boyama"];

export const saatler = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

// @lat: [[veri-modeli#Katalog ve Arama]]
export const salonlar: Salon[] = [
  {
    id: 1,
    ad: "Kadıköy Berber Atölyesi",
    semt: "Kadıköy",
    adres: "Caferağa Mah. Moda Cad. No: 18",
    puan: 4.8,
    renk: "linear-gradient(135deg, #0f766e, #134e4a)",
    aciklama: "Mahallenin klasik berberi; randevulu çalışır, çay ikramı hazırdır.",
    calismaSaatleri: "09:00 - 20:00",
    hizmetler: [
      { id: "kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 30, fiyat: 250 },
      { id: "sakal", ad: "Sakal Tıraşı", kategori: "Sakal", sureDk: 20, fiyat: 150 },
      { id: "kombo", ad: "Saç + Sakal", kategori: "Saç", sureDk: 45, fiyat: 350 },
      { id: "cilt", ad: "Cilt Bakımı", kategori: "Bakım", sureDk: 30, fiyat: 300 },
    ],
    berberler: [
      { id: "emre", ad: "Emre Usta", uzmanlik: ["Saç", "Sakal"] },
      { id: "mert", ad: "Mert Usta", uzmanlik: ["Saç", "Sakal", "Bakım"] },
    ],
  },
  {
    id: 2,
    ad: "Nişantaşı Kuaför Studio",
    semt: "Şişli",
    adres: "Teşvikiye Mah. Nişantaşı Cad. No: 42",
    puan: 4.9,
    renk: "linear-gradient(135deg, #7c3aed, #312e81)",
    aciklama: "Saç tasarımı ve renklendirme odaklı butik kuaför.",
    calismaSaatleri: "10:00 - 21:00",
    hizmetler: [
      { id: "kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 40, fiyat: 450 },
      { id: "boyama", ad: "Saç Boyama", kategori: "Boyama", sureDk: 90, fiyat: 900 },
      { id: "fon", ad: "Fön", kategori: "Saç", sureDk: 30, fiyat: 250 },
      { id: "bakim", ad: "Saç Bakımı", kategori: "Bakım", sureDk: 45, fiyat: 600 },
    ],
    berberler: [
      { id: "selin", ad: "Selin", uzmanlik: ["Saç", "Boyama"] },
      { id: "ayse", ad: "Ayşe", uzmanlik: ["Saç", "Bakım", "Boyama"] },
    ],
  },
  {
    id: 3,
    ad: "Beşiktaş Barber Club",
    semt: "Beşiktaş",
    adres: "Sinanpaşa Mah. Çarşı Cad. No: 7",
    puan: 4.7,
    renk: "linear-gradient(135deg, #b45309, #78350f)",
    aciklama: "Hızlı ve net tıraş sevenler için çarşı içinde modern barber.",
    calismaSaatleri: "09:00 - 20:00",
    hizmetler: [
      { id: "kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 30, fiyat: 300 },
      { id: "sakal", ad: "Sakal Tıraşı", kategori: "Sakal", sureDk: 20, fiyat: 180 },
      { id: "kombo", ad: "Saç + Sakal", kategori: "Saç", sureDk: 45, fiyat: 420 },
    ],
    berberler: [
      { id: "can", ad: "Can", uzmanlik: ["Saç", "Sakal"] },
      { id: "burak", ad: "Burak", uzmanlik: ["Saç", "Sakal"] },
    ],
  },
  {
    id: 4,
    ad: "Moda Güzellik Salonu",
    semt: "Kadıköy",
    adres: "Caferağa Mah. Moda Cad. No: 63",
    puan: 4.6,
    renk: "linear-gradient(135deg, #be185d, #831843)",
    aciklama: "El ve cilt bakımına odaklanan sakin bir güzellik salonu.",
    calismaSaatleri: "10:00 - 19:00",
    hizmetler: [
      { id: "manikur", ad: "Manikür", kategori: "Bakım", sureDk: 30, fiyat: 200 },
      { id: "pedikur", ad: "Pedikür", kategori: "Bakım", sureDk: 40, fiyat: 250 },
      { id: "kas", ad: "Kaş Tasarımı", kategori: "Bakım", sureDk: 15, fiyat: 150 },
      { id: "cilt", ad: "Cilt Bakımı", kategori: "Bakım", sureDk: 40, fiyat: 350 },
    ],
    berberler: [
      { id: "derya", ad: "Derya", uzmanlik: ["Bakım"] },
      { id: "ece", ad: "Ece", uzmanlik: ["Bakım"] },
    ],
  },
  {
    id: 5,
    ad: "Levent Erkek Kuaförü",
    semt: "Beşiktaş",
    adres: "Levent Mah. Büyükdere Cad. No: 112",
    puan: 4.5,
    renk: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
    aciklama: "İş çıkışı hızlı randevu almak isteyenler için pratik kuaför.",
    calismaSaatleri: "09:00 - 20:00",
    hizmetler: [
      { id: "kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 30, fiyat: 280 },
      { id: "sakal", ad: "Sakal Tıraşı", kategori: "Sakal", sureDk: 20, fiyat: 160 },
      { id: "kombo", ad: "Saç + Sakal", kategori: "Saç", sureDk: 45, fiyat: 390 },
    ],
    berberler: [
      { id: "hakan", ad: "Hakan", uzmanlik: ["Saç", "Sakal"] },
      { id: "serkan", ad: "Serkan", uzmanlik: ["Saç", "Sakal"] },
    ],
  },
  {
    id: 6,
    ad: "Bostancı Hair & Care",
    semt: "Kadıköy",
    adres: "Bostancı Mah. Bağdat Cad. No: 210",
    puan: 4.4,
    renk: "linear-gradient(135deg, #0d9488, #115e59)",
    aciklama: "Saç ve bakım hizmetlerini uygun fiyatla sunan mahalle salonu.",
    calismaSaatleri: "09:00 - 19:00",
    hizmetler: [
      { id: "kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 30, fiyat: 220 },
      { id: "fon", ad: "Fön", kategori: "Saç", sureDk: 25, fiyat: 180 },
      { id: "boyama", ad: "Saç Boyama", kategori: "Boyama", sureDk: 80, fiyat: 750 },
    ],
    berberler: [
      { id: "nihal", ad: "Nihal", uzmanlik: ["Saç", "Boyama"] },
      { id: "cem", ad: "Cem", uzmanlik: ["Saç", "Bakım"] },
    ],
  },
];

export function salonBul(id: number): Salon | undefined {
  return salonlar.find((s) => s.id === id);
}

export function hizmetBul(salon: Salon, hizmetId: string): Hizmet | undefined {
  return salon.hizmetler.find((h) => h.id === hizmetId);
}

export function berberBul(salon: Salon, berberId: string | null): Berber | undefined {
  if (!berberId) return undefined;
  return salon.berberler.find((b) => b.id === berberId);
}

export function toplamSure(hizmetler: Hizmet[]): number {
  return hizmetler.reduce((t, h) => t + h.sureDk, 0);
}

export function toplamTutar(hizmetler: Hizmet[]): number {
  return hizmetler.reduce((t, h) => t + h.fiyat, 0);
}

export function baslangicFiyat(salon: Salon): number {
  return Math.min(...salon.hizmetler.map((h) => h.fiyat));
}

// @lat: [[veri-modeli#Biçimlendirme]]
export const tl = (tutar: number) =>
  tutar.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export const tarihYaz = (tarih: string, saat?: string) => {
  if (!tarih) return "";
  const iso = saat ? `${tarih}T${saat}` : `${tarih}T12:00`;
  const metin = new Date(iso).toLocaleDateString("tr-TR", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
  return saat ? `${metin} · ${saat}` : metin;
};

const FOTOLAR = ["/salonlar/klasik.jpg", "/salonlar/modern.jpg", "/salonlar/luks.jpg"];

/** Salon kartlarında kullanılan kapak fotoğrafı; id'ye göre döner. */
export const salonFoto = (salon: Salon) => FOTOLAR[salon.id % FOTOLAR.length];

const ekSalonlar: Salon[] = [
  {
    id: 7,
    ad: "Beşiktaş Berber Kulübü",
    semt: "Beşiktaş",
    adres: "Sinanpaşa Mah. Çarşı Cad. No: 21",
    puan: 4.7,
    renk: "linear-gradient(135deg, #0ea5e9, #0c4a6e)",
    aciklama: "Çarşının ortasında, hızlı ve klasik tıraş sevenler için.",
    calismaSaatleri: "09:00 - 21:00",
    hizmetler: [
      { id: "b7-kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 30, fiyat: 300 },
      { id: "b7-sakal", ad: "Sakal Tıraşı", kategori: "Sakal", sureDk: 20, fiyat: 180 },
      { id: "b7-kombo", ad: "Saç + Sakal", kategori: "Saç", sureDk: 45, fiyat: 420 },
    ],
    berberler: [
      { id: "b7-kaan", ad: "Kaan Usta", uzmanlik: ["Saç", "Sakal"] },
      { id: "b7-ali", ad: "Ali Usta", uzmanlik: ["Saç"] },
    ],
  },
  {
    id: 8,
    ad: "Nişantaşı Grooming",
    semt: "Şişli",
    adres: "Teşvikiye Mah. Ihlamur Yolu No: 8",
    puan: 4.9,
    renk: "linear-gradient(135deg, #7c3aed, #312e81)",
    aciklama: "Kişiye özel bakım, sıcak havlu ve premium ürünler.",
    calismaSaatleri: "10:00 - 20:00",
    hizmetler: [
      { id: "b8-kesim", ad: "Signature Kesim", kategori: "Saç", sureDk: 45, fiyat: 650 },
      { id: "b8-bakim", ad: "Cilt Bakımı", kategori: "Bakım", sureDk: 30, fiyat: 500 },
      { id: "b8-boyama", ad: "Saç Boyama", kategori: "Boyama", sureDk: 60, fiyat: 900 },
    ],
    berberler: [
      { id: "b8-cem", ad: "Cem Usta", uzmanlik: ["Saç", "Bakım", "Boyama"] },
      { id: "b8-deniz", ad: "Deniz Usta", uzmanlik: ["Saç", "Sakal"] },
    ],
  },
  {
    id: 9,
    ad: "Cihangir Barber House",
    semt: "Beyoğlu",
    adres: "Cihangir Mah. Sıraselviler Cad. No: 44",
    puan: 4.6,
    renk: "linear-gradient(135deg, #f59e0b, #7c2d12)",
    aciklama: "Müzik, kahve ve ustura tıraşı; mahallenin buluşma noktası.",
    calismaSaatleri: "09:30 - 22:00",
    hizmetler: [
      { id: "b9-ustura", ad: "Ustura Tıraşı", kategori: "Sakal", sureDk: 30, fiyat: 250 },
      { id: "b9-kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 30, fiyat: 280 },
      { id: "b9-kombo", ad: "Saç + Sakal", kategori: "Saç", sureDk: 50, fiyat: 430 },
    ],
    berberler: [
      { id: "b9-eren", ad: "Eren Usta", uzmanlik: ["Saç", "Sakal"] },
      { id: "b9-murat", ad: "Murat Usta", uzmanlik: ["Sakal"] },
    ],
  },
  {
    id: 10,
    ad: "Bakırköy Usta Eller",
    semt: "Bakırköy",
    adres: "Zuhuratbaba Mah. İncirli Cad. No: 12",
    puan: 4.5,
    renk: "linear-gradient(135deg, #10b981, #064e3b)",
    aciklama: "Aile işletmesi; üç kuşaktır aynı ustalıkla tıraş.",
    calismaSaatleri: "08:30 - 20:30",
    hizmetler: [
      { id: "b10-kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 30, fiyat: 220 },
      { id: "b10-sakal", ad: "Sakal Tıraşı", kategori: "Sakal", sureDk: 20, fiyat: 130 },
      { id: "b10-cocuk", ad: "Çocuk Kesimi", kategori: "Saç", sureDk: 25, fiyat: 180 },
    ],
    berberler: [
      { id: "b10-hasan", ad: "Hasan Usta", uzmanlik: ["Saç", "Sakal"] },
      { id: "b10-yusuf", ad: "Yusuf Usta", uzmanlik: ["Saç"] },
    ],
  },
  {
    id: 11,
    ad: "Üsküdar Tıraş Odası",
    semt: "Üsküdar",
    adres: "Mimar Sinan Mah. Hakimiyet Cad. No: 3",
    puan: 4.8,
    renk: "linear-gradient(135deg, #ef4444, #7f1d1d)",
    aciklama: "Boğaz manzaralı, sakin ve titiz bir tıraş deneyimi.",
    calismaSaatleri: "09:00 - 20:00",
    hizmetler: [
      { id: "b11-kesim", ad: "Saç Kesimi", kategori: "Saç", sureDk: 35, fiyat: 320 },
      { id: "b11-bakim", ad: "Cilt Bakımı", kategori: "Bakım", sureDk: 30, fiyat: 380 },
      { id: "b11-kombo", ad: "Saç + Sakal", kategori: "Saç", sureDk: 50, fiyat: 470 },
    ],
    berberler: [
      { id: "b11-omer", ad: "Ömer Usta", uzmanlik: ["Saç", "Bakım"] },
      { id: "b11-tolga", ad: "Tolga Usta", uzmanlik: ["Saç", "Sakal"] },
    ],
  },
  {
    id: 12,
    ad: "Ataşehir Modern Cut",
    semt: "Ataşehir",
    adres: "Barbaros Mah. Mimar Sinan Cad. No: 55",
    puan: 4.4,
    renk: "linear-gradient(135deg, #6366f1, #1e1b4b)",
    aciklama: "Randevuyla çalışan, hızlı ve modern bir stüdyo.",
    calismaSaatleri: "10:00 - 21:00",
    hizmetler: [
      { id: "b12-kesim", ad: "Modern Kesim", kategori: "Saç", sureDk: 40, fiyat: 400 },
      { id: "b12-fade", ad: "Fade Kesim", kategori: "Saç", sureDk: 45, fiyat: 450 },
      { id: "b12-boyama", ad: "Saç Boyama", kategori: "Boyama", sureDk: 60, fiyat: 800 },
    ],
    berberler: [
      { id: "b12-baris", ad: "Barış Usta", uzmanlik: ["Saç", "Boyama"] },
      { id: "b12-selim", ad: "Selim Usta", uzmanlik: ["Saç"] },
    ],
  },
];

salonlar.push(...ekSalonlar);