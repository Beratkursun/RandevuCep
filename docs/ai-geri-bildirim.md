# Yapay Zeka Aracı Geri Bildirimi

Bu projede kullanılan ajan aracının (AutoClaw) güçlü yönleri, zorlandığı noktalar ve öneriler; kısa bir değerlendirme.

## Ne için kullanıldı

- `lat.md/` bilgi grafiğinin kurulması, kod bağlarının (`@lat`) eklenmesi ve güncel tutulması.
- RandevuCep dönüşümü: etkinlik/bilet akışından salon–berber–hizmet–randevu akışına geçiş, tip sözleşmeleri ve UI bileşenleri.
- Vitest ve Rust testlerinin yazılması; PR açma, diff kontrolü ve merge adımlarının `gh` ile otomatikleştirilmesi.

## Güçlü yönler

- **Önce okuma:** Her değişiklikten önce ilgili dosyaları okuyup mevcut davranışı doğruladı; tahmine dayalı düzenleme yapmadı.
- **Kendini denetleme:** `lat check`, `bun run check`, `bun run test`, `bun run build` ve `cargo test` zincirini çalıştırıp sonucu ham çıktıyla raporladı.
- **Tutarlılık:** Aynı kuralı (renk tokenları, `@lat` bağları, dört dilli sayfa yapısı) onlarca dosyada tek seferde uyguladı.
- **Süreç disiplini:** `feature/` dalı → conventional commit → PR → diff kontrolü → merge akışını atlamadı.

## Zorlanılan noktalar

- **Windows satır sonları:** Git `autocrlf` AGENTS.md'yi CRLF'e çevirince lat'ın yönettiği blok hash'i tutmadı; `.gitattributes` ile çözüldü. Bu tür platform ayrıntılarını önceden sezmedi.
- **Tarayıcı oturumu:** İlk PR'ın GitHub arayüzünden elle açılması gerekti; `gh auth login` sonrası tekrar etmedi.
- **Görsel değerlendirme:** Ekran görüntüsü ve estetik kararlar için insan kontrolü gerekiyor; ajan yapıyı doğrulayabiliyor, görünümü değerlendiremiyor.

## Öneriler

- Depoya bir kez `gh auth login` ve `npm i -g lat.md` yapıldığında tekrar eden işler tamamen komutla yürüyor.
- `lat.md/` her PR'da güncellenirse sonraki oturumların bağlam maliyeti düşüyor.
- Testleri küçük ve davranış odaklı tutmak (3 dosya, 11 test) regresyonu hızlı yakalıyor.

## Genel değerlendirme

Tanımlı ve doğrulanabilir görevlerde (refactor, test, dokümantasyon, PR akışı) yüksek verim sağladı; belirsiz tasarım kararlarında yönlendirme gerektirdi. **10 üzerinden 8.**
