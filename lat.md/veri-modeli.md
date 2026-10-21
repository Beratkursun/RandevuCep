# Salon Kataloğu

Katalog `src/lib/data.ts` içinde sabit tanımlıdır; tipler `src/lib/types/` altında ayrı dosyalarda yaşar ve ekranlar doğrudan mock veriye değil bu sözleşmeye bağlıdır.

## Veri Tipleri

`Salon`; `id`, `ad`, `semt`, `adres`, `puan`, `renk`, `aciklama`, `calismaSaatleri`, `hizmetler` ve `berberler` taşır. `Hizmet`; `id`, `ad`, `kategori`, `sureDk` ve `fiyat` alanlarından, `Berber` ise `id`, `ad` ve `uzmanlik` dizisinden oluşur.

`RandevuTaslagi` bir salon, `berberId` (null ise ilk müsait), bir veya daha fazla `Hizmet`, `tarih` ve `saat` taşır; `Randevu` onay sonrası kodu ve toplamları saklar. `Kullanici` ad ve telefondan oluşur.

Kaynak: [[src/lib/types/salon.ts#Salon]], [[src/lib/types/randevu.ts#RandevuTaslagi]], [[src/lib/types/kullanici.ts#Kullanici]].

## Katalog ve Arama

Altı salon sabit tanımlıdır (`salonlar`) ve `salonBul` kimlikle tek kayıt döner; `hizmetBul` salon içindeki hizmeti, `berberBul` ise berberi bulur.

Keşfet ekranı hizmet kategorisi çipleriyle ve salon adı, semt veya hizmet adı üzerinde `tr-TR` küçük harfe çevirerek filtreler; eşleşme yoksa boş durum metni gösterilir.

Kaynak: [[src/lib/data.ts#salonlar]], [[src/lib/data.ts#salonBul]], [[src/components/Kesfet.svelte]].

## Biçimlendirme

Tüm fiyat ve tarih gösterimi `tl` ve `tarihYaz` yardımcılarından geçer; `tl` tutarı TRY olarak ondalıksız, `tarihYaz` ise gün adı, ay ve isteğe bağlı saati tr-TR biçiminde yazar.

Kaynak: [[src/lib/data.ts#tl]], [[src/lib/data.ts#tarihYaz]], [[src/lib/data.ts#toplamTutar]].
