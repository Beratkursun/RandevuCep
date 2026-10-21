# Randevu Sepeti

Sepet, onaylanmamış randevu taslaklarını tutan tek bir Svelte 5 store'udur; her taslak bir salon, berber, hizmet listesi ve saat taşır.

## Taslak Ekleme

`ekle` aynı salon, berber, tarih, saat ve hizmet listesine sahip bir taslağı ikinci kez kabul etmez; farklı hizmet listesi veya saat yeni taslak olarak eklenir.

Kaynak: [[src/lib/randevu-sepeti.svelte.ts#RandevuSepeti#ekle]].

## Türetilmiş Değerler

`adet` taslak sayısını, `toplamTutar` taslaklardaki hizmet fiyatlarının toplamını, `toplamSure` ise toplam süreyi verir; üçü de `$derived` olduğu için sepet değişince kendiliğinden güncellenir.

Kaynak: [[src/lib/randevu-sepeti.svelte.ts#RandevuSepeti]].

## Silme ve Temizleme

`sil` indeksle tek taslağı kaldırır, `temizle` sepeti tamamen boşaltır; onaydan sonra çağrılan da `temizle`dir (bkz. [[randevular#Onay Akışı]]).

Kaynak: [[src/lib/randevu-sepeti.svelte.ts#RandevuSepeti#sil]].

## Doğrudan Randevu

`dogrudan` alanı sepetten bağımsız tek bir taslağı tutar; `dogrudanAyarla` ile doldurulur, `dogrudanTemizle` ile boşaltılır. `/onay` sayfası bu alanı okur, sepet ise `taslaklar` dizisini kullanır.

Kaynak: [[src/lib/randevu-sepeti.svelte.ts#RandevuSepeti#dogrudanAyarla]], [[src/components/RandevuOnay.svelte]].
