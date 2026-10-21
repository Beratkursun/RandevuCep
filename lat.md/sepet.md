# Sepet Durumu

Sepet modül düzeyinde tek bir Svelte 5 store'udur; tüm sayfalar aynı örneği paylaşır ve içerik kasıtlı olarak kalıcı değildir — sayfa yenilenince boşalır.

## Birleştirme Kuralı

`ekle` aynı etkinlik kimliğine ve aynı bilet adına sahip bir kalem bulursa yeni satır açmaz, mevcut kalemin adedini artırır; farklı kategori her zaman ayrı satır olur.

Kaynak: [[src/lib/sepet.svelte.ts#Sepet#ekle]].

## Türetilmiş Değerler

`adet` bilet sayılarının toplamı, `toplam` ise adet × kategori fiyatı toplamıdır; ikisi de `$derived` olduğu için kalem değişince kendiliğinden güncellenir ve ayrıca hesaplanmaz.

Kaynak: [[src/lib/sepet.svelte.ts#Sepet]].

## Kalem Silme ve Temizleme

`sil` indeksle tek kalemi diziden çıkarır, `temizle` sepeti tamamen boşaltır; ödeme tamamlandığında çağrılan da `temizle`dir (bkz. [[biletler#Satın Alma Akışı]]).

Kaynak: [[src/lib/sepet.svelte.ts#Sepet#sil]].
