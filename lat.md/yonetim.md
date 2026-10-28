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
