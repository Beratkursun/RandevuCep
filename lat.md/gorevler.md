# Görev Durumu

Hafta 03 ve Hafta 04 görevlerinin mevcut durumunu, kanıtlarını ve sıradaki uygulama adımlarını izler; kaynaklar [[docs/tasks/week-3]] ve [[docs/k1/rapor/hoca-raporu.md]]'dir.

## Durum Özeti

RandevuCep dönüşümü 21.10.2026'da uygulandı: salon/berber/hizmet/randevu modeli, dört randevu kombinasyonu, Rust `randevu_olustur`, 11 test ve 12 sayfa hazır. Kalan işler marka/ikon, bilgi sayfaları, AGENTS indeksi ve teslim etiketleridir.

Doğrulama: `lat check`, `bun run test` ve `bun run build` geçmektedir; ayrıntılar aşağıdaki tablolarda.

## Uygulama Durumu

Uygulama artık PassoKlon etkinlik/bilet akışını değil RandevuCep randevu akışını uygular; eski `etkinlik`, `sepet` ve `biletlerim` sayfaları kaldırılmıştır.

- Rotalar: `/`, `/salon/[id]`, `/randevu`, `/onay`, `/randevularim`, `/profil`, `/hakkinda`.
- Veri: `Salon`, `Hizmet`, `Berber`, `RandevuTaslagi`, `Randevu`, `Kullanici` (bkz. [[veri-modeli]]).
- Kombinasyonlar: tek/çok hizmet, belirli/ilk müsait berber, sepetli/doğrudan onay (bkz. [[sepet]]).
- Rust: `randevu_olustur` + `src/lib/native.ts`; tarayıcıda `WEB-RNV-...` (bkz. [[randevular]]).
- Test: 3 dosya, 11 test (bkz. [[testler]]).

## Hafta 03 Batch 01

Fork ve PR altyapısı dışında Batch 01'in doküman ve marka çıktıları kısmen açıktır; tablo görev bazında kalan işi gösterir.

| Görev | Durum | Kalan iş | İlgili bölüm |
|---|---|---|---|
| 01 Fork ve işbirliği | Tamam | Rapor 10/10; yapılacak yok. | — |
| 01.2 Branch ve PR | Tamam | PR #1–#4 merge edildi; bu dönüşüm PR #5 olarak açılacak. | — |
| 02 Proje fikri | Kısmi | Doküman dolduruldu; öğrenci numarası ve Blackboard teslimi kullanıcıda. | [[veri-modeli]] |
| 03 README | Kısmi | Başlık ve açıklama RandevuCep'e çekildi; öğrenci numarası ve bazı badge linkleri açık. | [[mimari]] |
| 04 Ajan dosyaları | Kısmi | AGENTS haritası güncellendi; docs indeks tablosu ve kod kuralları hâlâ eksik. | — |
| 05 Markalama | Kısmi | Renk tokenları, header ve Tauri adı güncellendi; `docs/branding.md` dolduruldu; platform ikon setleri yok. | [[tema]] |
| 06 Bilgi sayfaları | Kısmi | `hakkinda.mdx` RandevuCep'e çekildi; `iletisim`, `kosullar`, `gizlilik` ve 4 dil/RTL yok. | [[navigasyon]], [[mimari]] |
| 07 Mimari ağaç | Kısmi | `docs/mimari-agac.md` yeni rotalarla güncellendi; responsive grid ve platform ikonları açık. | [[mimari]] |
| 08 İleri AGENTS | Açık | docs indeks tablosu ve tüm `docs/` bağlantıları yok. | — |
| 09 Batch 01 | Açık | `v0.1.0-batch-01` tag yok; 9/9 kontrol matrisi, ekran görüntüsü ve Blackboard ZIP kanıtı yok. | [[testler]] |

### Görev 03 ve 04 Ayrıntısı

README'nin öğrenci numarası ve rozet bağlantıları tamamlanmalı; `AGENTS.md` ise öğretmenin istediği doküman indeksi, teknoloji komutları ve Svelte 5 kod kurallarıyla genişletilmeli.

- `README.md` içindeki `[Öğrenci Numaranız]` doldurulmalı; `href="#"` rozetleri gerçek adreslere çevrilmeli.
- `AGENTS.md` içine `docs/klasor-mimarisi.md`, `docs/branding.md`, `docs/mimari-agac.md`, `docs/proje-fikri.md`, `docs/veri-modeli.md`, `docs/platform-destegi.md` ve `docs/tasks/` tablosu eklenmeli.
- `bun run dev`, `bun run tauri dev` ve `bun run build` komutları yazılmalı; Svelte 5 runes ve SSR güvenliği kuralı eklenmeli.
- `CLAUDE.md` ve `GEMINI.md` yalnızca `AGENTS.md`'ye link vermeye devam etmeli.

### Görev 05 Ayrıntısı

Marka tokenları `src/styles/app.css` ile `docs/branding.md` arasında birebir uyumlu; eksik olan platform ikon setleri ve varsa kontrast düzeltmeleridir.

- iOS ve Android ikon klasörleri `src-tauri/icons/` altında yok; 1024×1024 `app-icon.png` ile `bun run tauri icon` çalıştırılmalı.
- `public/favicon.png` ve `public/apple-touch-icon.png` RandevuCep işaretiyle değiştirilmeli.
- Altın vurgu (`--renk-vurgu`) yalnızca dekoratif kullanılmalı; küçük metinlerde ana renk veya koyu metin tercih edilmeli.

### Görev 06 Ayrıntısı

Dört bilgi sayfası tamamlanmalı ve navigasyondan erişilebilir olmalı; sayfalar TR/EN/AR/FA dillerinde ve AR/FA için `dir="rtl"` ile derlenmeli.

- `hakkinda.mdx` proje amacı, geliştirici bilgisi ve teknoloji listesiyle güncellendi; `CanliRozet` korunmalı.
- `iletisim.astro` içinde doğrulama yapan ve gönderim sonrası temizlenen bir form olmalı.
- `kosullar.mdx` ve `gizlilik.mdx` hizmet şartları, KVKK ve localStorage bildirimini içermeli.
- Sayfalar `AppNav` veya profil üzerinden erişilebilir olmalı.

### Görev 07 ve 08 Ayrıntısı

`docs/mimari-agac.md` yeni rotalarla güncellendi; kalan iş responsive grid uygulaması ve `AGENTS.md` doküman indeksinin tamamlanmasıdır.

- Telefon, tablet ve masaüstü için `max-width` ve grid davranışı `app.css` içinde uygulanmalı.
- `AGENTS.md` tablosunda tüm `docs/*.md` dosyaları listelenmeli ve bağlantılar çalışmalı.
- `docs/klasor-mimarisi.md` ile yeni `src/lib/types/` ve `src/lib/native.ts` yapısı çelişmemeli.

### Görev 09 Ayrıntısı

Batch 01 kapanışı için `bun run build` kanıtı, 9/9 kontrol matrisi, `v0.1.0-batch-01` tag'i ve Blackboard'a yüklenecek final ZIP gerekir; tag şu an yerelde ve uzakta yok.

## Hafta 04 Batch 02

Batch 02'nin veri, kart, liste ve Rust kalemleri tamamlandı; master koruması, çalışma yöntemi ve Batch 02 denetimi açık kaldı. Son tarih 20.10.2026 23:59 itibarıyla geçmiştir.

| Görev | Durum | Kalan iş |
|---|---|---|
| 09.1 Master koruması | Açık | Kural seti, PR güvenliği belgesi ve kanıt görseli yok; `gh` PATH'te olmadığı için canlı doğrulanamadı. |
| 10 Çalışma yöntemi | Açık | Şartname ve prompt/istem günlükleri yok. |
| 11 Veri sözleşmesi | Tamam | `src/lib/types/` dolu; `docs/veri-modeli.md` ve `bun run check` betiği var. |
| 12 Kart bileşeni | Tamam | `src/lib/components/SalonKart.svelte` salon kartı olarak eklendi. |
| 13 Liste ve üç durum | Tamam | `Kesfet.svelte` yükleme, boş ve hata durumlarını gösteriyor. |
| 15 Rust komutu ve platform | Tamam | `randevu_olustur`, `src/lib/native.ts` ve `docs/platform-destegi.md` hazır. |
| 16 Batch 02 denetimi | Kısmi | `minWidth` eklendi; `docs/ilerleme-batch-02.md` ve `v0.2.0-batch-02` tag yok. |

### Kalan Batch 02 Ayrıntısı

Kalan üç kalem teslim ve denetim ağırlıklıdır; uygulama davranışı tamamlandığı için bunlar sırayla kapatılabilir.

- `09.1`: GitHub'da `master` için PR zorunlu kural seti kurulmalı; `docs/pr-guvenligi.md` ve ekran görüntüsü eklenmeli.
- `10`: `docs/calisma-yontemi.md` içinde AI ile çalışma şartnamesi ve prompt günlükleri tutulmalı.
- `16`: `docs/ilerleme-batch-02.md` yazılmalı ve `v0.2.0-batch-02` tag'i oluşturulmalı.

## Uygulama Sırası

Kalan işler doküman ve teslim ağırlıklı olduğu için önce puan getiren belgeler, sonra etiket ve ZIP kapatılmalı; her adım ayrı `feature/` dalı ve PR ile ilerlemeli.

1. `README.md` öğrenci numarası ve rozetleri; `AGENTS.md` doküman indeksi.
2. Platform ikonları ve `public/` marka varlıkları.
3. `iletisim`, `kosullar`, `gizlilik` sayfaları ve 4 dil/RTL.
4. Responsive grid ve `docs/klasor-mimarisi.md` kontrolü.
5. `09.1` master koruması, `10` çalışma yöntemi ve `16` ilerleme belgesi.
6. `v0.1.0-batch-01` ve `v0.2.0-batch-02` tag'leri; final ZIP ve Blackboard.
7. Son doğrulama: `bun run check`, `bun run test`, `bun run build`.

## Karar Bekleyenler

Uygulama davranışı tamamlandı; yalnızca kullanıcıdan gelmesi gereken birkaç bilgi ve onay kaldı.

- Öğrenci numarası: `README.md`, `docs/proje-fikri.md` ve Blackboard için.
- Marka paleti: teal (`#0f766e`) + altın (`#d4a017`) onayı; değişecekse `docs/branding.md` ve `app.css` birlikte güncellenmeli.
- Platform ikonları: 1024×1024 `app-icon.png` kaynağı; yoksa basit bir geometrik işaret üretilebilir.
- 4 dil/RTL kapsamı: TR/EN/AR/FA çevirileri için metin onayı.
