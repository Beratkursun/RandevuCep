---
lat:
  require-code-mention: true
---

# Testler

Davranış spec'leri; her yaprak bölüm bir Vitest veya Rust testine bağlıdır ve `bun run test` ile `cargo test` üzerinden doğrulanır.

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

## Rust

Rust `randevu_olustur` komutunun kod sözleşmesini doğrulayan `cargo test` spec'leri.

### Kod formatı salon kimliğini taşır

`randevu_olustur(42)` çıktısı `RNV-042-` önekiyle başlamalı; son ek boş olmamalı, en fazla 7 karakter olmalı ve yalnızca onaltılık karakterler içermelidir.

### Her çağrı yeni kod üretir

Aynı salon kimliğiyle art arda iki çağrı farklı kod döndürmelidir; kodun her onayda yeniden üretilmesi bu davranışa bağlıdır.

## Yönetim

Yönetim panelinin SQLite katmanı; cargo test ile bellek içi veritabanında doğrulanır.

### Şema dört tabloyu oluşturur

`hazirla` çalıştırıldığında `salonlar`, `hizmetler`, `berberler` ve `randevular` tabloları oluşmalıdır; eksik tablo panelin ilk açılışta çökmesine yol açar.

### Salon eklenir ve listelenir

`salon_ekle` boş adı reddetmeli, geçerli kaydı kimlikle döndürmeli; `salon_listele` eklenen salonu alanlarıyla birlikte getirmelidir.

### Randevu kaydedilir ve durumu güncellenir

`randevu_kaydet` kaydı `bekliyor` durumuyla yazmalı, liste salon ve berber adlarını birleştirmeli; `durum_guncelle` durumu `onaylandi` yapmalıdır.

### Geçersiz durum reddedilir

`durum_guncelle` yalnızca `bekliyor`, `onaylandi`, `iptal` değerlerini kabul etmeli; başka bir değerde hata dönmeli ve kayıt değişmemelidir.
### Durum etiketleri ve özet hesaplanır

`durumEtiketi` üç durumu Türkçeye çevirmeli, bilinmeyen değeri olduğu gibi bırakmalı; `ozetSayilari` bekleyen/onaylı/iptal sayılarını ve onaylı randevuların cirosunu toplamalıdır.

### Tarayıcı yedeği kaydı saklar

`yedekSalonEkle` ve `yedekRandevuEkle` kayıtları localStorage'a yazmalı, berber seçilmemişse "İlk müsait berber" etiketini üretmeli; `yedekDurumGuncelle` durumu değiştirmeli ve geçersiz durumu reddetmelidir.
## Berber

Berber girişi ve yetki sınırı; Rust komutları bellek içi veritabanında, tarayıcı yedeği Vitest ile doğrulanır.

### Doğru PIN ile giriş yapılır

`berber_giris` doğru PIN ile berberin adını ve salonunu döndürmeli; hatalı PIN, 4 haneden kısa PIN ve geçersiz PIN ile berber ekleme reddedilmelidir.

### Berber yalnızca kendi randevusunu günceller

`berber_randevulari` yalnızca o berbere atanmış randevuları listelemeli; `berber_durum_guncelle` başka berberin randevusunu ve `bekliyor` durumunu reddetmelidir.

### Tarayıcı yedeğinde berber girişi çalışır

Tauri dışında `yedekBerberGiris` salon + ad + PIN ile oturum üretmeli, yanlış PIN'de hata vermeli ve `yedekBerberRandevulari` yalnızca berberin kendi randevularını döndürmelidir.