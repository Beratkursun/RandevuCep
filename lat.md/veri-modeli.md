# Etkinlik Kataloğu

Katalog `src/lib/data.ts` içinde sabit tanımlıdır; ekranlar veri kaynağına değil `Etkinlik` tipine ve iki biçimlendirme yardımcısına bağlıdır.

## Veri Tipleri

Bir etkinlik `id`, `baslik`, `kategori`, ISO `tarih`, `mekan`, `sehir`, `renk`, `aciklama` ve `biletler` dizisi taşır; her bilet kategorisi `ad` ve `fiyat` alanlarından oluşur. `Kategori` dört değerle sınırlıdır: Futbol, Basketbol, Konser, Tiyatro.

`renk` alanı afiş görseli yerine kullanılan CSS gradyanıdır; projede etkinlik görseli yoktur.

Kaynak: [[src/lib/data.ts#Etkinlik]], [[src/lib/data.ts#BiletKategorisi]].

## Katalog ve Arama

Altı etkinlik sabit tanımlıdır (`etkinlikler`) ve `etkinlikBul` kimlikle tek kayıt döner. Keşfet ekranı kategori çipleriyle ve başlık üzerinde `tr-TR` küçük harfe çevirerek filtreler; eşleşme yoksa boş durum metni gösterilir.

Yeni bir etkinlik eklemek için tek yapılacak `etkinlikler` dizisine kayıt eklemektir; `/etkinlik/[id]` sayfası derlemede kendiliğinden üretilir.

## Biçimlendirme

Tüm fiyat ve tarih gösterimi iki yardımcıdan geçer: `tl` tutarı TRY olarak ondalıksız yazar, `tarihYaz` tr-TR kısa gün adı, uzun ay ve iki haneli saat üretir. Ekranlarda ham `toLocaleString` çağrısı yoktur.

Kaynak: [[src/lib/data.ts#tl]], [[src/lib/data.ts#tarihYaz]], [[src/components/Kesfet.svelte]].
