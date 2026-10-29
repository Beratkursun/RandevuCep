# Yönetim Paneli

Yönetim paneli ana projenin içindedir: randevuları SQLite üzerinden listeler, durumlarını günceller ve salon/hizmet/berber kayıtlarını yönetir.

## Veritabanı Şeması

Veritabanı, Tauri'nin uygulama veri klasöründeki `randevucep.db` dosyasıdır; şema açılışta `PRAGMA foreign_keys = ON` ve `CREATE TABLE IF NOT EXISTS` ile hazırlanır.

Dört tablo vardır: `salonlar`, `hizmetler`, `berberler`, `randevular`. Hizmet ve berber kayıtları salon silinince `CASCADE` ile temizlenir; randevu kodu `UNIQUE`'tir.

Kaynak: [[src-tauri/src/db.rs#hazirla]].

## Komutlar

Ön yüz Rust'a yalnızca `vt_` önekli komutlarla erişir; her komut tek bir SQLite işlemini sarar ve hatayı string olarak döner.

| Komut | İş |
|---|---|
| `vt_salon_ekle` / `vt_salon_listele` | Salon kaydı ve listesi |
| `vt_hizmet_ekle` / `vt_hizmet_listele` | Salona bağlı hizmetler |
| `vt_berber_ekle` / `vt_berber_listele` | Salona bağlı berberler |
| `vt_randevu_kaydet` / `vt_randevu_listele` | Randevu kaydı ve birleşik liste |
| `vt_durum_guncelle` | Randevu durumunu değiştirir |

Durum yalnızca `bekliyor`, `onaylandi`, `iptal` değerlerini alabilir; geçersiz değer hata döner. Randevu listesi salon ve berber tablolarıyla birleştirilir; berber seçilmemişse etiket "İlk müsait berber" olur.

Kaynak: [[src-tauri/src/db.rs#vt_randevu_listele]], [[src-tauri/src/db.rs#durum_guncelle]].

## Panel Akışı

`/yonetim` sayfası açılışta salonları ve randevuları `native.ts` üzerinden yükler; özet kartları bekleyen/onaylı/iptal sayılarıyla onaylı randevuların cirosunu gösterir.

Tablodaki "Onayla" ve "İptal" düğmeleri `vt_durum_guncelle` çağırır ve listeyi yeniler. Salon, hizmet ve berber formları ilgili `vt_` komutlarına yazar; "Örnek randevu ekle" düğmesi seçili salon için kod üretip kaydı oluşturur.

Kaynak: [[src/components/YonetimPaneli.svelte]], [[src/lib/native.ts#yonetimRandevulari]].

## Tarayıcı Yedeği

Tauri dışında (tarayıcı önizlemesi ve testler) aynı arayüz `localStorage["yonetim-verisi"]` altındaki yedekle karşılanır; salon, hizmet, berber ve randevu kayıtları burada tutulur.

Kaynak: [[src/lib/yonetim.ts#yedekOku]].
## Berber Girişi

Berberler `/berber` sayfasından salon, ad ve 4 haneli PIN ile giriş yapar; PIN veritabanında SHA-256 özetiyle saklanır, oturum `localStorage["berber-oturum"]` içinde tutulur.

Salon yöneticisi berberi eklerken PIN belirler; aynı salonda aynı ada sahip kayıt varsa giriş ad üzerinden eşleşir. Hatalı PIN veya 4 haneden farklı PIN reddedilir.

Kaynak: [[src-tauri/src/db.rs#berber_giris]], [[src/components/BerberPaneli.svelte]].

## Berber Paneli

Giriş sonrası berber yalnızca kendi randevularını görür; onaylayabilir veya iptal edebilir, başka berberin randevusunu değiştiremez.

Berberin durum güncellemesi `onaylandi` ve `iptal` ile sınırlıdır; `bekliyor` değeri reddedilir. Berber seçilmeden alınan ("İlk müsait berber") randevular yönetici panelinde kalır.

Kaynak: [[src-tauri/src/db.rs#berber_randevulari]], [[src-tauri/src/db.rs#berber_durum_guncelle]].
## Müsaitlik

Berber, seçtiği günün saatlerini kapatıp yeniden açabilir; kapalı slotlar `kapali_slotlar` tablosunda (berber, tarih, saat) benzersiz olarak tutulur.

Panel 09:00–19:00 arası saatleri ızgara olarak gösterir; kapalı saat kırmızı ve üstü çizili görünür. `vt_slot_kapat` aynı slotu ikinci kez kapatmayı hata saymaz, `vt_slot_ac` açık slotu açmayı reddeder; saat `HH:MM` biçiminde ve geçerli olmalıdır.

Müşteri randevu ekranı hâlâ statik katalogla çalıştığı için kapalı slotları henüz okumaz; kayıtlar berber panelinde ve SQLite API'sinde tutulur.

Kaynak: [[src-tauri/src/db.rs#slot_kapat]], [[src/components/BerberPaneli.svelte]].