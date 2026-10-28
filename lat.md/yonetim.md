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