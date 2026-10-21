# Proje Fikri: RandevuCep

- **Öğrenci Adı Soyadı:** Berat Kurşun
- **Öğrenci Numarası:** [Öğrenci Numaranız]
- **İlham Alınan Konsept:** Kuaför & Berber Randevu Sistemi (Görev 02, fikir 32)

## 1. Proje Özeti

RandevuCep, kullanıcıların yakınlarındaki berber ve kuaför salonlarını bulup hizmet, berber, tarih ve saat seçerek saniyeler içinde randevu almasını sağlayan bir mobil/masaüstü uygulamasıdır. Salonların telefonla randevu yönetme yükünü azaltır; kullanıcıya onay kodu, randevu özeti ve geçmiş randevularını tek ekranda sunar.

Uygulama gerçek bir ödeme veya canlı takvim servisine bağlanmaz; katalog ve müsait saatler örnek veriyle çalışır, randevu kodu Rust tarafında üretilir ve cihazda saklanır.

## 2. Temel 3 Ekran ve İşlev

1. **Ana Liste Ekranı (Keşfet):**
   - Salon kartlarında ad, semt, puan, hizmet özeti ve başlangıç fiyatı gösterilir.
   - Arama; salon adı, hizmet ve semt üzerinde çalışır.
   - Hizmet türü, semt, puan ve fiyat filtreleri bulunur.
   - Yükleme, boş sonuç ve hata durumları ayrı ayrı gösterilir.

2. **Detay ve Seçim Ekranı:**
   - Salonun adresi, çalışma saatleri, puanı ve hizmet listesi yer alır.
   - Kullanıcı berberini, hizmetini, tarihini ve saatini seçer.
   - Seçilen hizmetlerin toplam süresi ve tutarı canlı hesaplanır.
   - "Randevuya ekle" ile seçim randevu sepetine alınır.

3. **Kayıt / Kod Üretme Ekranı:**
   - Randevu özeti; salon, berber, hizmet, tarih, saat ve toplam tutar gösterilir.
   - Kullanıcı ad ve telefon bilgisini girer; onayladığında Rust `randevu_olustur` komutu çalışır.
   - Üretilen kod `RNV-AAA-BBBBBBB` biçiminde ekranda gösterilir ve `localStorage` içine kaydedilir.
   - Aynı akış sonunda kullanıcı "Randevularım" listesine yönlendirilir.

4. **Profil ve Ayarlar (yardımcı ekran):**
   - Kullanıcı adı, telefonu ve randevu geçmişi gösterilir.
   - Gece/gündüz teması değiştirilebilir; çıkışta kullanıcı bilgisi silinir.

## 3. Hedef Kitle

- Hızlı randevu almak isteyen 18–45 yaş arası şehirli kullanıcılar.
- Yoğun ders programı nedeniyle telefonla randevu almaya zaman ayıramayan üniversite öğrencileri.
- Çalışma saatleri içinde randevu planlaması yapan beyaz yakalı kullanıcılar.
- İkincil hedef: telefon trafiğini azaltmak ve randevularını dijitalden yönetmek isteyen salon işletmecileri.

## 4. Veri Modeli ve Kod Üretimi

- `Salon`: `id`, `ad`, `semt`, `adres`, `puan`, `renk`, `aciklama`, `calismaSaatleri`, `hizmetler`, `berberler`.
- `Berber`: `id`, `ad`, `uzmanlik`.
- `Hizmet`: `id`, `ad`, `kategori`, `sureDk`, `fiyat`.
- `RandevuTaslagi`: `id`, `salonId`, `berberId` (null ise ilk müsait), `hizmetler`, `tarih`, `saat`.
- `Kullanici`: `ad`, `telefon`.

Akış dört kombinasyonu destekler: tek veya çok hizmet, belirli veya ilk müsait berber, sepetli veya doğrudan onay.

Onaylanan randevu `Randevu` tipine dönüşür; `kod`, `salonAd`, `berberAd`, `toplamTutar`, `toplamSure` ve `durum` alanlarını taşır.

Rust tarafında üretilen kodun formatı `RNV-AAA-BBBBBBB` olacaktır:

- `RNV`: uygulama öneki.
- `AAA`: üç haneli salon kimliği (örn. `042`).
- `BBBBBBB`: sistem saatinden üretilen en fazla yedi haneli onaltılık son ek (örn. `1A2B3C4`).

Örnek kod: `RNV-042-1A2B3C4`. Kod her randevu onayında yeniden üretilir; aynı randevu için tekrar kullanılmaz.

## 5. Kapsam ve Sınırlar

- Katalog, berberler, hizmetler ve müsait saatler örnek veridir; gerçek salon API'si yoktur.
- Ödeme alınmaz; randevu onayı ve kod üretimi vardır.
- Kullanıcı oturumu gerçek kimlik doğrulaması değildir; ad ve telefon cihazda saklanır.
- Randevu kodları `localStorage` içinde tutulur; sunucuya gönderilmez.
- Uygulama Astro statik ön yüzü ve Tauri v2 kabuğu içinde çalışır; Rust yalnızca kod üretiminde devreye girer.
