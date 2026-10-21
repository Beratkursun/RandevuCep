# RandevuCep — Mimari Ağaç ve Kapsam

Bu belge, RandevuCep'in sayfa ağacını, ana klasörlerini, hedef platformlarını ve responsive davranışını tanımlar. Klasör ayrıntıları için `docs/klasor-mimarisi.md` tek kaynaktır.

## 1. Sayfa ve Özellik Ağacı

```
RandevuCep
├── / (Keşfet)
│   ├── Salon arama ve hizmet filtresi
│   └── Yükleme / boş / hata durumları
│
├── /salon/[id] (Salon Detayı)
│   ├── Salon bilgisi, hizmet listesi ve berberler
│   ├── Tek veya çok hizmet seçimi
│   ├── Belirli berber veya "İlk müsait berber"
│   └── Tarih/saat seçimi; sepete ekle veya hemen randevu al
│
├── /randevu (Randevu Sepeti)
│   ├── Birden fazla randevu taslağı
│   └── Toplu onay ve RNV kodu üretimi
│
├── /onay (Doğrudan Onay)
│   ├── Sepeti atlayan tek taslak
│   └── Onayla veya sepete ekle
│
├── /randevularim (Randevularım)
│   ├── Onaylanan randevular
│   └── RNV kodu, berber, hizmet, tarih ve tutar
│
├── /profil (Kullanıcı & Tema)
│   ├── Ad ve telefon
│   └── Randevu sayısı, gece/gündüz modu
│
└── Bilgi Sayfaları
    ├── /hakkinda (MDX)
    ├── /iletisim (Astro + Svelte form)
    ├── /kosullar (MDX)
    ├── /gizlilik (MDX)
    └── /en, /ar, /fa varyantları (AR/FA RTL)
```

## 2. Ana Klasörler

| Klasör / Dosya | Sorumluluk |
|---|---|
| `package.json` | Bağımlılıklar ve `dev`, `build`, `test`, `check`, `tauri` komutları. |
| `astro.config.mjs` | Astro entegrasyonları, `$lib` alias'ı ve 1420 portu. |
| `src-tauri/` | Rust çekirdeği, `randevu_olustur` komutu ve pencere ayarları. |
| `src/layouts/` | Ortak sayfa iskeleti (`Layout.astro`) ve dil/yön props'ları. |
| `src/pages/` | Dosya tabanlı rotalar ve `[lang]/[sayfa].astro` bilgi varyantları. |
| `src/components/` | Svelte ekranları, `BilgiSayfasi`, `DilSecici` ve `IletisimFormu`. |
| `src/lib/` | Tipler, mock katalog, store'lar, `native.ts` ve `icerik.ts`. |
| `src/lib/types/` | `Salon`, `Hizmet`, `Berber`, `RandevuTaslagi`, `Randevu`, `Kullanici`. |
| `src/styles/` | Global renk tokenları (`app.css`). |
| `docs/` | Görevler, marka, veri modeli ve platform belgeleri. |

## 3. Hedef Platform Matrisi

| Platform | İşletim Sistemleri | Paket Formatı |
|---|---|---|
| Masaüstü | macOS (Apple Silicon / Intel) | `.dmg`, `.app` |
| Masaüstü | Windows 10/11 | `.msi`, `.exe` |
| Masaüstü | Linux (Ubuntu/Debian) | `.deb`, `.AppImage` |
| Mobil | iOS (iPhone/iPad) | `.ipa` |
| Mobil | Android (Telefon/Tablet) | `.apk`, `.aab` |

## 4. Responsive Breakpoints

- **Telefon (360–430px):** Tek sütun; alt menü sabit; kartlar tam genişlik.
- **Tablet (768–1024px):** `Kesfet` iki sütunlu ızgara; alt menü korunur.
- **Masaüstü (1200px+):** Üç sütunlu ızgara; içerik `max-width: 1200px` ile ortalanır.
- Pencere minimumu `360×640`; alt menü `env(safe-area-inset-bottom)` ile çentikli cihazlara uyum sağlar.

## 5. Randevu Kombinasyonları

Uygulama dört ekseni birlikte destekler:

1. Tek hizmet veya çok hizmet.
2. Belirli berber veya "İlk müsait berber".
3. Sepetli toplu onay veya doğrudan onay.
4. Tek randevu veya birden fazla randevu taslağı.

Kod tarafında bu esneklik `RandevuTaslagi.hizmetler` dizisi, `berberId: string | null` alanı ve `randevuSepeti.dogrudan` store'u ile karşılanır.

## 6. Bilgi Sayfaları ve Diller

- `src/lib/icerik.ts` TR/EN/AR/FA metinlerini tek yerde tutar.
- `src/components/BilgiSayfasi.astro` içeriği ve `IletisimFormu`'nu render eder.
- `src/pages/[lang]/[sayfa].astro` EN/AR/FA için 12 statik sayfa üretir.
- AR/FA sayfalarında `<html dir="rtl">` uygulanır; dil seçici aynı sayfanın diğer dillerine bağlanır.
