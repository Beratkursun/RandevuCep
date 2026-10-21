# RandevuCep — Marka ve Tasarım Kılavuzu

Bu kılavuz, RandevuCep'in renk tokenlarını, tipografisini ve logo konseptini tanımlar. Kod tarafındaki tek kaynak `src/styles/app.css` dosyasıdır; buradaki değerler oradan sapmamalıdır.

## 1. Marka Renk Paleti

| Token | Açık Mod | Koyu Mod | Kullanım Yeri | Kontrast |
|---|---|---|---|---|
| `--renk-ana` | `#0f766e` | `#14b8a6` | Butonlar, aktif sekme, bağlantılar | Beyaz metinle 5.47:1 (AA) |
| `--renk-koyu` | `#0f172a` | `#0f172a` | Üst bar ve koyu alanlar | Açık metinle 17.06:1 (AAA) |
| `--renk-vurgu` | `#d4a017` | `#fbbf24` | Logo vurgusu, küçük rozetler | Dekoratif; beyaz üstünde 2.38:1, metin için kullanılmaz |
| `--zemin` | `#f8fafc` | `#0b1120` | Sayfa arka planı | Ana metinle 17.06:1 (AAA) |
| `--kart` | `#ffffff` | `#111827` | Kart ve form yüzeyi | Ana metinle 16.96:1 (AAA) |
| `--yazi` | `#0f172a` | `#f8fafc` | Başlık ve gövde metni | Zemine göre 17.06:1 (AAA) |
| `--yazi-soluk` | `#64748b` | `#94a3b8` | Tarih, semt, ikincil açıklama | Zemine göre 4.55:1 (AA) |
| `--kenar` | `#e2e8f0` | `#334155` | Kart ve input sınırları | Dekoratif |

> Not: `--renk-vurgu` altın tonu yalnızca logo ve dekoratif vurgularda kullanılır; küçük metinlerde AA eşiğini karşılamaz.

## 2. Tipografi ve Köşe Yuvarlaklığı

- **Yazı Tipi:** System UI (`-apple-system, "Segoe UI", Roboto, sans-serif`)
- **Köşe Yuvarlaklığı (`--radius`):** `14px`
- **Başlık Ağırlığı:** 700–800
- **Gövde Metni:** 14–16px, `--yazi`

## 3. Logo ve İkon Konsepti

- **Sembol:** Makas ve tarak izini andıran sade bir işaret; mobil ölçüde tek renk çalışacak kadar yalın.
- **Logo Metni:** `Randevu` koyu, `Cep` vurgu rengiyle.
- **Slogan:** “Randevun cebinde.”
- **Uygulama İkonu:** `src-tauri/icons/` altındaki set; kaynak `app-icon.png` 1024×1024 ve şeffaf arka planlı olmalı.
- **Web Varlıkları:** `public/favicon.png` ve `public/apple-touch-icon.png`.

## 4. Kullanım Kuralları

- Renkler yalnızca CSS değişkenleriyle kullanılır; bileşen içinde ad-hoc hex yazılmaz.
- Gece modu `:root[data-tema="gece"]` altında tanımlanır; ayrı bir tema dosyası açılmaz.
- Yeni bir bileşen eklenirken önce bu tablodaki tokenlar kontrol edilir.
- Logo ve ikon dosyaları `docs/` içine kopyalanmaz; `public/` ve `src-tauri/icons/` altında tutulur.
