---
lat:
  require-code-mention: true
---

# Testler

Davranış spec'leri; her yaprak bölüm `tests/` altındaki tek bir Vitest testine bağlıdır ve `bun run test` ile doğrulanır.

## Sepet

Randevu sepeti store'unun taslak ekleme, türetme, silme ve doğrudan randevu davranışını doğrular.

### Aynı taslak ikinci kez eklenmez

Aynı salon, berber, tarih, saat ve hizmet listesine sahip taslak ikinci kez eklenmemeli; aksi hâlde kullanıcı aynı randevuyu iki kez onaylayabilir.

### Farklı hizmetler ayrı taslak olur

Aynı salon ve saatte farklı hizmet listeleri seçildiğinde bunlar ayrı taslaklar olarak durmalı; böylece çok hizmetli ve tek hizmetli randevular birbirine karışmaz.

### Toplam tutar ve süre türetilir

`adet` taslak sayısını, `toplamTutar` hizmet fiyatlarının toplamını, `toplamSure` ise toplam süreyi vermelidir; sepet özeti doğrudan bu değerlerden okunur.

### Taslak silinir ve sepet temizlenir

`sil` yalnızca verilen indeksteki taslağı kaldırmalı, `temizle` tüm taslakları boşaltıp toplamı sıfıra indirmelidir; onay sonrası sepetin boş kalması buna bağlıdır.

### Doğrudan taslak ayrı tutulur

`dogrudanAyarla` ile atanan tek taslak sepet listesine eklenmemeli ve `dogrudanTemizle` ile ayrıca boşaltılabilmelidir; "Hemen randevu al" akışı buna dayanır.

## Randevular

Onay akışının tarayıcı tarafındaki sözleşmesi; Rust komutu bu testlerde çalışmaz.

### Onay kodu üretir ve kalıcılaştırır

Tauri olmayan ortamda `onayla` her taslak için `WEB-RNV-` ile başlayan bir kod üretmeli, randevuyu listeye yazmalı ve `localStorage["randevularim"]` altına kaydetmelidir; sayfa yenilendiğinde randevuların geri gelmesi buna bağlıdır.

### İlk müsait berber boş kimlikle saklanır

`berberId` null olan taslak onaylandığında randevu `berberId: null` ve "İlk müsait berber" etiketiyle saklanmalıdır; kullanıcı belirli bir berber seçmeden de randevu alabilmelidir.

### Bozuk kayıt boş listeyle açılır

`localStorage["randevularim"]` geçersiz JSON veya dizi olmayan bir değer içeriyorsa store boş listeyle açılmalıdır; bozuk bir kayıt uygulamayı kilitlememelidir.

## Veri

Salon kataloğu, hizmet arama ve biçimlendirme yardımcıları.

### Salon kimlikle bulunur

`salonBul` var olan kimlikte ilgili salonu, olmayan kimlikte `undefined` döndürmelidir; `hizmetBul` ise salon içindeki hizmeti bulmalıdır.

### Fiyat ve tarih tr-TR biçimlenir

`tl` tutarı Türk lirası olarak binlik ayraçla, `tarihYaz` ise Türkçe ay adı ve isteğe bağlı saati yazmalıdır; tüm ekranlar bu iki yardımcıyı kullandığı için biçim tek yerden korunur.

### Çok hizmetli toplamlar hesaplanır

`toplamSure` ve `toplamTutar` birden fazla hizmetin süre ve fiyatlarını doğru toplamalı, `baslangicFiyat` salonun en düşük hizmet fiyatını vermelidir; kart ve sepet özetleri bu değerlere güvenir.
