# Görev Durumu

Hafta 03 ve Hafta 04 görevlerinin mevcut durumunu, kanıtlarını ve kalan teslim adımlarını izler; kaynaklar [[docs/tasks/week-3]] ve [[docs/k1/rapor/hoca-raporu.md]]'dir.

## Durum Özeti

RandevuCep dönüşümü tamamlandı: 27 sayfa, 11 Vitest + 2 Rust testi, dört dilli bilgi sayfaları, platform ikonları ve GitHub ruleset'i hazır. Kalan tek zorunlu adım final ZIP'in Blackboard'a yüklenmesidir.

Doğrulama: `lat check`, `bun run check`, `bun run test`, `bun run build` ve `cargo check` geçmektedir; ayrıntılar [[docs/ilerleme-batch-01.md]] ve [[docs/ilerleme-batch-02.md]] içindedir.

## Uygulama Durumu

Uygulama artık PassoKlon etkinlik/bilet akışını değil RandevuCep randevu akışını uygular; eski `etkinlik`, `sepet` ve `biletlerim` sayfaları kaldırılmıştır.

- Rotalar: `/`, `/salon/[id]`, `/randevu`, `/onay`, `/randevularim`, `/profil` ve `/hakkinda`, `/iletisim`, `/kosullar`, `/gizlilik`; ayrıca `/en`, `/ar`, `/fa` bilgi varyantları.
- Veri: `Salon`, `Hizmet`, `Berber`, `RandevuTaslagi`, `Randevu`, `Kullanici` (bkz. [[veri-modeli]]).
- Kombinasyonlar: tek/çok hizmet, belirli/ilk müsait berber, sepetli/doğrudan onay (bkz. [[sepet]]).
- Rust: `randevu_olustur` + `src/lib/native.ts`; tarayıcıda `WEB-RNV-...` (bkz. [[randevular]]).
- Test: 3 dosya, 11 test (bkz. [[testler]]).

## Hafta 03 Batch 01

Batch 01'in tüm kod ve doküman çıktıları tamamlandı; yalnızca etiket ve Blackboard ZIP adımı kullanıcıda.

| Görev | Durum | Kanıt / kalan |
|---|---|---|
| 01 Fork ve işbirliği | Tamam | Rapor 10/10. |
| 01.2 Branch ve PR | Tamam | PR #1–#6 merge edildi; dal ve PR disiplini uygulandı. |
| 02 Proje fikri | Tamam | [[docs/proje-fikri.md]] dolu; öğrenci numarası `2620511110`; Blackboard yüklemesi kullanıcıda. |
| 03 README | Tamam | [[README.md]] başlık, künye, rozetler ve TOC güncel. |
| 04 Ajan dosyaları | Tamam | [[AGENTS.md]], `CLAUDE.md`, `GEMINI.md`; docs indeksi ve kod kuralları eklendi. |
| 05 Markalama | Tamam | [[docs/branding.md]], `app.css`, header, Tauri adı, favicon ve iOS/Android ikonları. |
| 06 Bilgi sayfaları | Tamam | Dört sayfa TR/EN/AR/FA; AR/FA `dir="rtl"`; `IletisimFormu` çalışır. |
| 07 Mimari ağaç | Tamam | [[docs/mimari-agac.md]] sayfa ağacı, platform matrisi ve breakpoint'ler. |
| 08 İleri AGENTS | Tamam | [[AGENTS.md]] içinde docs indeksi, komutlar ve Svelte 5/SSR kuralları. |
| 09 Batch 01 | Kısmi | Build, 9/9 matris, ekran görüntüleri ve `v0.1.0-batch-01` tag hazır; Blackboard ZIP yüklemesi kullanıcıda. |

## Hafta 04 Batch 02

Batch 02'nin tüm kalemleri tamamlandı; 16 için yalnızca etiket push'u kaldı.

| Görev | Durum | Kanıt |
|---|---|---|
| 09.1 Master koruması | Tamam | [[docs/pr-guvenligi.md]]; GitHub ruleset `master-koruma` (ID 25555472), PR zorunlu, force push ve silme kapalı. |
| 10 Çalışma yöntemi | Tamam | [[docs/calisma-yontemi.md]] ve [[docs/istem-gunlukleri/01-lat-analizi.md]] dahil üç istem günlüğü. |
| 11 Veri sözleşmesi | Tamam | `src/lib/types/`, [[docs/veri-modeli.md]], `bun run check`. |
| 12 Kart bileşeni | Tamam | [[src/components/ui/Kart.svelte]] genel kart; [[src/lib/components/SalonKart.svelte]] bunu kullanıyor. |
| 13 Liste ve üç durum | Tamam | [[src/components/ui/Yukleniyor.svelte]], [[src/components/ui/BosDurum.svelte]], [[src/components/ui/HataDurumu.svelte]]; [[src/components/Kesfet.svelte]] bunları kullanıyor. |
| 15 Rust komutu ve platform | Tamam | [[src-tauri/src/lib.rs#randevu_olustur]], [[src/lib/native.ts]], [[docs/platform-destegi.md]]; `cargo test` 2/2. |
| 16 Batch 02 denetimi | Tamam | `minWidth: 360`, [[docs/ilerleme-batch-02.md]], `v0.2.0-batch-02` tag. |

## Kalan İşler

Teslim zinciri tamamlandı; yalnızca kullanıcı ve uzak depo adımları kaldı.


1. Final ZIP'i (`RandevuCep-final.zip`) Blackboard'a yükle.
2. İsteğe bağlı: GitHub ayarlar sayfasının ekran görüntüsünü `docs/ekran-pr-guvenligi.png` yanına ekle.

## Karar Bekleyenler

Kod ve doküman tarafında açık karar kalmadı; yalnızca teslim adımları kullanıcıda.

- Blackboard'a yüklenecek final ZIP'in kapsamı ve yükleme zamanı.
- Marka paleti teal + altın olarak uygulandı; değişiklik istenirse `docs/branding.md` ve `app.css` birlikte güncellenir.
