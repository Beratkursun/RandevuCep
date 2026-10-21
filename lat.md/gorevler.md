# Görev Durumu

Hafta 03 ve Hafta 04 görevlerinin mevcut durumunu, kanıtlarını ve sıradaki uygulama adımlarını izler; kaynaklar [[docs/tasks/week-3]] ve [[docs/k1/rapor/hoca-raporu.md]]'dir.

## Durum Özeti

Rapor 21.10.2026 15:20 anlık görüntüsüdür; 16:24–16:35 arasında üç PR merge edilmiş ve test altyapısı eklenmiştir. Rapordaki "0 PR" ve "öğrenci commit'i yok" satırları artık geçersizdir; uygulama yine de PassoKlon şablonudur.

Doğrulama (21.10.2026): `lat check` geçti, `bun run test` 7/7 geçti, `bun run build` 11 sayfa üretti. Eksikler derleme değil; proje konsepti, marka, veri sözleşmesi ve teslim kanıtlarıdır.

## Hafta 03 Batch 01

Fork ve PR altyapısı dışında Batch 01'in ana çıktıları tamamlanmadı; tablo görev bazında kalan işi ve ilgili bilgi grafiği bölümünü gösterir.

| Görev | Durum | Kalan iş | İlgili bölüm |
|---|---|---|---|
| 01 Fork ve işbirliği | Tamam | Rapor 10/10; yapılacak yok. | — |
| 01.2 Branch ve PR | Tamam | PR #1–#3 merge edildi (21.10.2026); PR'lar altyapı ağırlıklı, proje özelliği PR'ı henüz yok. | — |
| 02 Proje fikri | Kısmi | Doküman dolduruldu; öğrenci numarası ve Blackboard teslimi kullanıcıda. | [[veri-modeli]] |
| 03 README | Kısmi | Öğrenci bilgileri placeholder; badge linkleri `#`; TOC'ta "Haftalık Görevler" anchor'ı yok; başlık ve açıklama hâlâ PassoKlon. | [[mimari]] |
| 04 Ajan dosyaları | Kısmi | `AGENTS.md` var; `CLAUDE.md` ve `GEMINI.md` ona link veriyor; fakat docs indeksi ve kod kuralları eksik. | — |
| 05 Markalama | Açık | `docs/branding.md` şablon; `src/styles/app.css` Passo kırmızısı; `AppHeader` "passoklon"; `tauri.conf.json` productName/title eski; platform ikonları yok. | [[tema]] |
| 06 Bilgi sayfaları | Açık | Yalnızca `hakkinda.mdx` var; `iletisim.astro`, `kosullar.mdx`, `gizlilik.mdx` ve 4 dil/RTL yok. | [[navigasyon]], [[mimari]] |
| 07 Mimari ağaç | Kısmi | `docs/mimari-agac.md` şablon; sayfa ağacı ve platform matrisi projeye uyarlanmalı. | [[mimari]] |
| 08 İleri AGENTS | Açık | docs indeks tablosu ve `docs/` bağlantıları yok. | — |
| 09 Batch 01 | Açık | `v0.1.0-batch-01` tag yok; 9/9 kontrol matrisi, ekran görüntüsü ve Blackboard ZIP kanıtı yok. | [[testler]] |

### Görev 02 Ayrıntısı

Proje fikri dokümanı, uygulamanın adını, üç temel ekranı, hedef kitleyi ve Rust kod formatını tanımlamalı; rapor berber/kuaför randevu fikrini, dal adları ise `RandevuCep` adını gösteriyor.

- Ana liste: salon/berber kartları, hizmet ve semt filtresi, arama.
- Detay/seçim: salon profili, berber, hizmet, tarih ve saat seçimi.
- Kayıt/kod: randevu özeti; Rust `randevu_olustur` ile `RNV-XXX-XXXXXXX` benzeri kod.
- Hedef kitle: hızlı randevu almak isteyen yerel kullanıcılar ve öğrenciler.
- Öğrenci numarası ve kesin proje adı `Karar Bekleyenler` bölümünde.

`docs/proje-fikri.md` 21.10.2026 itibarıyla dolduruldu; kalan iş öğrenci numarasını eklemek ve dokümanı Blackboard'a yüklemektir.

### Görev 03 Ayrıntısı

README'nin öğrenci künyesi, proje adı ve rozet bağlantıları düzeltilmeli; kurulum komutları gerçekten çalışan `bun install`, `bun run dev`, `bun run tauri dev` ve `bun run build` akışını göstermeli.

- `[Adınız Soyadınız]`, `[Öğrenci Numaranız]` ve `[@kullanici-adiniz]` placeholder'ları doldurulmalı.
- `href="#"` olan rozetler gerçek bağlantılara çevrilmeli.
- TOC'taki "Haftalık Görevler" anchor'ı olmayan başlığa gidiyor; başlık eklenmeli veya bağlantı `docs/tasks/` yoluna çevrilmeli.
- Proje adı ve açıklaması seçilen randevu konseptiyle uyumlu olmalı.

### Görev 04 ve 08 Ayrıntısı

`AGENTS.md` bugün lat talimatı ağırlıklı; öğretmenin istediği doküman indeksi, teknoloji komutları ve Svelte 5 kod kuralları eklenmeli. `CLAUDE.md` ve `GEMINI.md` yalnızca `AGENTS.md`'ye link vermeye devam etmeli.

- `docs/klasor-mimarisi.md`, `docs/branding.md`, `docs/mimari-agac.md`, `docs/proje-fikri.md` ve `docs/tasks/` bağlantıları tek tabloda toplanmalı.
- `bun run dev`, `bun run tauri dev` ve `bun run build` komutları yazılmalı.
- Svelte 5 runes ve SSR güvenliği kuralları eklenmeli; dokümanlar kopyalanmamalı, link verilmeli.

### Görev 05 Ayrıntısı

Marka kimliği `docs/branding.md` içinde token tablosuyla tanımlanmalı ve aynı tokenlar `src/styles/app.css` içinde `:root` ile `[data-tema="gece"]` altında birebir yer almalı.

- `AppHeader.svelte` logosu ve `tauri.conf.json` productName/title alanları yeni adla güncellenmeli.
- `public/favicon.png`, `public/apple-touch-icon.png` ve `src-tauri/icons/` altındaki platform setleri üretilmeli.
- iOS ve Android ikon klasörleri henüz yok; `bun run tauri icon` ile üretilmeli.
- Kontrast oranları WCAG AA (≥ 4.5:1) olacak şekilde tabloda ölçülmeli.

### Görev 06 Ayrıntısı

Dört bilgi sayfası tamamlanmalı ve navigasyondan erişilebilir olmalı; sayfalar TR/EN/AR/FA dillerinde ve AR/FA için `dir="rtl"` ile derlenmeli.

- `hakkinda.mdx` proje amacı, geliştirici bilgisi ve teknoloji listesiyle yeniden yazılmalı; `CanliRozet` etkileşimli bileşen olarak kalmalı.
- `iletisim.astro` içinde doğrulama yapan ve gönderim sonrası temizlenen bir form olmalı.
- `kosullar.mdx` ve `gizlilik.mdx` hizmet şartları, KVKK ve localStorage bildirimini içermeli.
- Sayfalar `AppNav` veya profil üzerinden erişilebilir olmalı.

### Görev 07 Ayrıntısı

`docs/mimari-agac.md` yalnızca ana klasörleri ve kök dosyaları listelemeli; sayfa ağacı randevu akışına göre `/`, `/salon/[id]`, `/randevu`, `/randevularim` ve `/profil` rotalarını göstermeli.

- Platform matrisi macOS, Windows, Linux, iOS ve Android çıktılarını korumalı.
- Telefon, tablet ve masaüstü breakpoint'leri ile `max-width`/grid davranışı yazılmalı.
- `docs/klasor-mimarisi.md` ile çelişki olmamalı.

### Görev 09 Ayrıntısı

Batch 01 kapanışı için `bun run build` kanıtı, 9/9 kontrol matrisi, `v0.1.0-batch-01` tag'i ve Blackboard'a yüklenecek final ZIP gerekir; tag şu an yerelde ve uzakta yok.

## Hafta 04 Batch 02

Batch 02'nin yedi kalemi de açık; son tarih 20.10.2026 23:59 itibarıyla geçmiştir. Raporda 14 numaralı satır yok, bu yüzden kapsam raporun listelediği kalemlerdir.

| Görev | Durum | Kalan iş |
|---|---|---|
| 09.1 Master koruması | Açık | Kural seti, PR güvenliği belgesi ve kanıt görseli yok; `gh` PATH'te olmadığı için canlı doğrulanamadı. |
| 10 Çalışma yöntemi | Açık | Şartname ve prompt/istem günlükleri yok. |
| 11 Veri sözleşmesi | Açık | `src/lib/types/` yok; `docs/veri-modeli.md` yok; `package.json` içinde `check` betiği yok. |
| 12 Kart bileşeni | Açık | Randevu kartı yok; yalnızca şablonun `src/lib/components/EtkinlikKart.svelte` dosyası var. |
| 13 Liste ve üç durum | Açık | `Kesfet.svelte` yalnızca boş durumu gösteriyor; yükleme ve hata durumu yok. |
| 15 Rust komutu ve platform | Kısmi | `bilet_olustur` var; `src/lib/native.ts` ve `docs/platform-destegi.md` yok. |
| 16 Batch 02 denetimi | Açık | `minWidth` yok; `docs/ilerleme-batch-02.md` yok; `v0.2.0-batch-02` tag yok. |

### Veri Sözleşmesi Ayrıntısı

Randevu verisi için `Salon`, `Berber`, `Hizmet`, `Randevu` ve `Kullanici` tipleri `src/lib/types/` altında ayrı dosyalarda tanımlanmalı; `data.ts` bu tiplere bağlı örnek katalog üretmeli.

- `check` betiği tip kontrolü ve `lat check`i birlikte çalıştırmalı.
- `docs/veri-modeli.md` alanları, ilişkileri ve örnek kaydı göstermeli.
- Rust komutu `randevu_olustur` olarak yeniden adlandırılmalı; dönüş formatı `RNV-XXX-XXXXXXX` olmalı.
- Tauri dışı yedek `WEB-RNV-...` biçiminde kalmalı.

### Üç Durum Ayrıntısı

Liste ekranı yükleme, boş ve hata durumlarını ayrı ayrı göstermeli; şu anda yalnızca boş durum var.

- Yükleme: iskelet kartlar veya "Randevular yükleniyor" metni.
- Boş: arama/filtre sonucu yoksa açıklayıcı mesaj ve filtre temizleme.
- Hata: veri okunamazsa yeniden deneme düğmesi.
- Liste ve kart bileşeni randevu verisine bağlı olmalı; etkinlik kartı yeniden kullanılmamalı.

## Uygulama Sırası

Açık işler birbirine bağımlı olduğu için sıra konseptten teslim kanıtına doğru ilerlemeli; her adım ayrı `feature/` dalı ve PR ile kapanmalı.

1. `docs/proje-fikri.md` ve proje adı; arkasından README başlığı.
2. `src/lib/types/`, `docs/veri-modeli.md`, `check` betiği ve `data.ts` dönüşümü.
3. `docs/branding.md`, `src/styles/app.css`, `AppHeader` ve `tauri.conf.json`.
4. Randevu kartı, liste ve üç durum; detay/sepet/onay akışı.
5. `randevu_olustur`, `src/lib/native.ts` ve `docs/platform-destegi.md`.
6. Bilgi sayfaları, 4 dil/RTL ve navigasyon.
7. README, AGENTS, mimari ağaç ve görev durumu güncellemesi.
8. Batch 01/02 tag'leri, 09.1 branch protection, 10 çalışma yöntemi, 16 denetim ve ZIP.

## Karar Bekleyenler

Uygulamaya başlamadan önce yalnızca kullanıcıdan gelmesi gereken üç bilgi var; diğerleri mevcut rapor ve dal adlarından türetilebilir.

- Öğrenci numarası: README ve `docs/proje-fikri.md` için.
- Kesin proje adı: dal adları `RandevuCep` diyor; onaylanmalı.
- Rust kod öneki: `RNV` öneriliyor; `PSK` korunacaksa belirtilmeli.
