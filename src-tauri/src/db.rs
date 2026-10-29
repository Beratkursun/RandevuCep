//! Yönetim panelinin SQLite katmanı: şema, sorgular ve Tauri komutları.
//! Veritabanı dosyası Tauri'nin uygulama veri klasöründe tutulur; testler
//! bellek içi bağlantıyla çalıştığı için diske dokunmaz.

use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::path::Path;
use std::sync::Mutex;
use tauri::State;

pub type Sonuc<T> = Result<T, String>;

/// Tauri durumu: tek yazma bağlantısı, kilit altında paylaşılır.
pub struct Veritabani(pub Mutex<Connection>);

pub const DURUMLAR: [&str; 3] = ["bekliyor", "onaylandi", "iptal"];

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SalonSatiri {
    pub id: i64,
    pub ad: String,
    pub sehir: String,
    pub adres: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HizmetSatiri {
    pub id: i64,
    pub salon_id: i64,
    pub ad: String,
    pub sure_dk: i64,
    pub fiyat: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BerberSatiri {
    pub id: i64,
    pub salon_id: i64,
    pub ad: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BerberOturumu {
    pub id: i64,
    pub ad: String,
    pub salon_id: i64,
    pub salon_ad: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct YeniRandevu {
    pub kod: String,
    pub salon_id: i64,
    pub berber_id: Option<i64>,
    pub hizmet: String,
    pub tarih: String,
    pub saat: String,
    pub tutar: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RandevuSatiri {
    pub id: i64,
    pub kod: String,
    pub salon_ad: String,
    pub berber_ad: String,
    pub hizmet: String,
    pub tarih: String,
    pub saat: String,
    pub durum: String,
    pub tutar: i64,
}

fn pin_hash(pin: &str) -> String {
    let mut ozet = Sha256::new();
    ozet.update(pin.trim().as_bytes());
    format!("{:x}", ozet.finalize())
}

fn pin_gecerli(pin: &str) -> bool {
    let p = pin.trim();
    p.len() == 4 && p.chars().all(|c| c.is_ascii_digit())
}

// @lat: [[yonetim#Veritabanı Şeması]]
pub fn hazirla(conn: &Connection) -> Sonuc<()> {
    conn.execute_batch(
        "PRAGMA foreign_keys = ON;
         CREATE TABLE IF NOT EXISTS salonlar (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             ad TEXT NOT NULL,
             sehir TEXT NOT NULL,
             adres TEXT NOT NULL DEFAULT ''
         );
         CREATE TABLE IF NOT EXISTS hizmetler (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             salon_id INTEGER NOT NULL REFERENCES salonlar(id) ON DELETE CASCADE,
             ad TEXT NOT NULL,
             sure_dk INTEGER NOT NULL,
             fiyat INTEGER NOT NULL
         );
         CREATE TABLE IF NOT EXISTS berberler (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             salon_id INTEGER NOT NULL REFERENCES salonlar(id) ON DELETE CASCADE,
             ad TEXT NOT NULL,
             pin_hash TEXT NOT NULL DEFAULT ''
         );
         CREATE TABLE IF NOT EXISTS kapali_slotlar (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             berber_id INTEGER NOT NULL REFERENCES berberler(id) ON DELETE CASCADE,
             tarih TEXT NOT NULL,
             saat TEXT NOT NULL,
             UNIQUE(berber_id, tarih, saat)
         );         CREATE TABLE IF NOT EXISTS randevular (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             kod TEXT NOT NULL UNIQUE,
             salon_id INTEGER NOT NULL REFERENCES salonlar(id),
             berber_id INTEGER REFERENCES berberler(id),
             hizmet TEXT NOT NULL,
             tarih TEXT NOT NULL,
             saat TEXT NOT NULL,
             tutar INTEGER NOT NULL DEFAULT 0,
             durum TEXT NOT NULL DEFAULT 'bekliyor',
             olusturma TEXT NOT NULL DEFAULT (datetime('now'))
         );",
    )
    .map_err(|e| e.to_string())?;

    // Eski veritabanlarında pin_hash kolonu yoksa eklenir.
    let pin_kolonu: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('berberler') WHERE name = 'pin_hash'",
            [],
            |r| r.get(0),
        )
        .map_err(|e| e.to_string())?;
    if pin_kolonu == 0 {
        conn.execute(
            "ALTER TABLE berberler ADD COLUMN pin_hash TEXT NOT NULL DEFAULT ''",
            [],
        )
        .map_err(|e| e.to_string())?;
    }
    Ok(())
}

pub fn baglan(yol: &Path) -> Sonuc<Connection> {
    let conn = Connection::open(yol).map_err(|e| e.to_string())?;
    hazirla(&conn)?;
    Ok(conn)
}

fn dogrula_durum(durum: &str) -> Sonuc<()> {
    if DURUMLAR.contains(&durum) {
        Ok(())
    } else {
        Err(format!("geçersiz durum: {durum}"))
    }
}

pub fn salon_ekle(conn: &Connection, ad: &str, sehir: &str, adres: &str) -> Sonuc<i64> {
    if ad.trim().is_empty() || sehir.trim().is_empty() {
        return Err("salon adı ve şehir zorunlu".to_string());
    }
    conn.execute(
        "INSERT INTO salonlar (ad, sehir, adres) VALUES (?1, ?2, ?3)",
        params![ad.trim(), sehir.trim(), adres.trim()],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

pub fn salon_listele(conn: &Connection) -> Sonuc<Vec<SalonSatiri>> {
    let mut stmt = conn
        .prepare("SELECT id, ad, sehir, adres FROM salonlar ORDER BY ad COLLATE NOCASE")
        .map_err(|e| e.to_string())?;
    let satirlar = stmt
        .query_map([], |r| {
            Ok(SalonSatiri {
                id: r.get(0)?,
                ad: r.get(1)?,
                sehir: r.get(2)?,
                adres: r.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(satirlar)
}

pub fn hizmet_ekle(
    conn: &Connection,
    salon_id: i64,
    ad: &str,
    sure_dk: i64,
    fiyat: i64,
) -> Sonuc<i64> {
    if ad.trim().is_empty() {
        return Err("hizmet adı zorunlu".to_string());
    }
    if sure_dk <= 0 || fiyat < 0 {
        return Err("süre pozitif, fiyat negatif olamaz".to_string());
    }
    conn.execute(
        "INSERT INTO hizmetler (salon_id, ad, sure_dk, fiyat) VALUES (?1, ?2, ?3, ?4)",
        params![salon_id, ad.trim(), sure_dk, fiyat],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

pub fn hizmet_listele(conn: &Connection, salon_id: i64) -> Sonuc<Vec<HizmetSatiri>> {
    let mut stmt = conn
        .prepare(
            "SELECT id, salon_id, ad, sure_dk, fiyat FROM hizmetler
             WHERE salon_id = ?1 ORDER BY ad COLLATE NOCASE",
        )
        .map_err(|e| e.to_string())?;
    let satirlar = stmt
        .query_map(params![salon_id], |r| {
            Ok(HizmetSatiri {
                id: r.get(0)?,
                salon_id: r.get(1)?,
                ad: r.get(2)?,
                sure_dk: r.get(3)?,
                fiyat: r.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(satirlar)
}

// @lat: [[yonetim#Berber Girişi]]
pub fn berber_ekle(conn: &Connection, salon_id: i64, ad: &str, pin: &str) -> Sonuc<i64> {
    if ad.trim().is_empty() {
        return Err("berber adı zorunlu".to_string());
    }
    if !pin_gecerli(pin) {
        return Err("PIN 4 haneli olmalı".to_string());
    }
    conn.execute(
        "INSERT INTO berberler (salon_id, ad, pin_hash) VALUES (?1, ?2, ?3)",
        params![salon_id, ad.trim(), pin_hash(pin)],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

pub fn berber_listele(conn: &Connection, salon_id: i64) -> Sonuc<Vec<BerberSatiri>> {
    let mut stmt = conn
        .prepare("SELECT id, salon_id, ad FROM berberler WHERE salon_id = ?1 ORDER BY ad COLLATE NOCASE")
        .map_err(|e| e.to_string())?;
    let satirlar = stmt
        .query_map(params![salon_id], |r| {
            Ok(BerberSatiri {
                id: r.get(0)?,
                salon_id: r.get(1)?,
                ad: r.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(satirlar)
}

/// Berberin kendi hesabıyla girişi: salon + ad + 4 haneli PIN.
// @lat: [[yonetim#Berber Girişi]]
pub fn berber_giris(conn: &Connection, salon_id: i64, ad: &str, pin: &str) -> Sonuc<BerberOturumu> {
    if !pin_gecerli(pin) {
        return Err("PIN 4 haneli olmalı".to_string());
    }
    let satir = conn
        .query_row(
            "SELECT b.id, b.ad, b.salon_id, s.ad, b.pin_hash
             FROM berberler b JOIN salonlar s ON s.id = b.salon_id
             WHERE b.salon_id = ?1 AND lower(b.ad) = lower(?2)",
            params![salon_id, ad.trim()],
            |r| {
                Ok((
                    r.get::<_, i64>(0)?,
                    r.get::<_, String>(1)?,
                    r.get::<_, i64>(2)?,
                    r.get::<_, String>(3)?,
                    r.get::<_, String>(4)?,
                ))
            },
        )
        .optional()
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "berber bulunamadı".to_string())?;

    if satir.4 != pin_hash(pin) {
        return Err("PIN hatalı".to_string());
    }
    Ok(BerberOturumu {
        id: satir.0,
        ad: satir.1,
        salon_id: satir.2,
        salon_ad: satir.3,
    })
}

pub fn randevu_kaydet(conn: &Connection, kayit: &YeniRandevu) -> Sonuc<i64> {
    if kayit.kod.trim().is_empty() || kayit.hizmet.trim().is_empty() {
        return Err("kod ve hizmet zorunlu".to_string());
    }
    conn.execute(
        "INSERT INTO randevular (kod, salon_id, berber_id, hizmet, tarih, saat, tutar)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            kayit.kod.trim(),
            kayit.salon_id,
            kayit.berber_id,
            kayit.hizmet.trim(),
            kayit.tarih,
            kayit.saat,
            kayit.tutar
        ],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

fn randevu_satirlari(conn: &Connection, filtre: Option<i64>) -> Sonuc<Vec<RandevuSatiri>> {
    let sql = "SELECT r.id, r.kod, s.ad, COALESCE(b.ad, 'İlk müsait berber'), r.hizmet,
                      r.tarih, r.saat, r.durum, r.tutar
               FROM randevular r
               JOIN salonlar s ON s.id = r.salon_id
               LEFT JOIN berberler b ON b.id = r.berber_id
               WHERE (?1 IS NULL OR r.berber_id = ?1)
               ORDER BY r.tarih DESC, r.saat DESC, r.id DESC";
    let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
    let satirlar = stmt
        .query_map(params![filtre], |r| {
            Ok(RandevuSatiri {
                id: r.get(0)?,
                kod: r.get(1)?,
                salon_ad: r.get(2)?,
                berber_ad: r.get(3)?,
                hizmet: r.get(4)?,
                tarih: r.get(5)?,
                saat: r.get(6)?,
                durum: r.get(7)?,
                tutar: r.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(satirlar)
}

pub fn randevu_listele(conn: &Connection) -> Sonuc<Vec<RandevuSatiri>> {
    randevu_satirlari(conn, None)
}

// @lat: [[yonetim#Berber Paneli]]
pub fn berber_randevulari(conn: &Connection, berber_id: i64) -> Sonuc<Vec<RandevuSatiri>> {
    randevu_satirlari(conn, Some(berber_id))
}

pub fn durum_guncelle(conn: &Connection, id: i64, durum: &str) -> Sonuc<()> {
    dogrula_durum(durum)?;
    let etkilenen = conn
        .execute("UPDATE randevular SET durum = ?1 WHERE id = ?2", params![durum, id])
        .map_err(|e| e.to_string())?;
    if etkilenen == 0 {
        return Err(format!("randevu bulunamadı: {id}"));
    }
    Ok(())
}

/// Berber yalnızca kendi randevusunu onaylayabilir veya iptal edebilir.
// @lat: [[yonetim#Berber Paneli]]
pub fn berber_durum_guncelle(
    conn: &Connection,
    berber_id: i64,
    randevu_id: i64,
    durum: &str,
) -> Sonuc<()> {
    if durum != "onaylandi" && durum != "iptal" {
        return Err("berber yalnızca onaylayabilir veya iptal edebilir".to_string());
    }
    let etkilenen = conn
        .execute(
            "UPDATE randevular SET durum = ?1 WHERE id = ?2 AND berber_id = ?3",
            params![durum, randevu_id, berber_id],
        )
        .map_err(|e| e.to_string())?;
    if etkilenen == 0 {
        return Err("randevu bulunamadı veya bu berbere ait değil".to_string());
    }
    Ok(())
}

fn saat_gecerli(saat: &str) -> bool {
    let parcalar: Vec<&str> = saat.split(':').collect();
    if parcalar.len() != 2 || parcalar[0].len() != 2 || parcalar[1].len() != 2 {
        return false;
    }
    match (parcalar[0].parse::<u32>(), parcalar[1].parse::<u32>()) {
        (Ok(s), Ok(d)) => s < 24 && d < 60,
        _ => false,
    }
}

// @lat: [[yonetim#Müsaitlik]]
pub fn kapali_slotlar(conn: &Connection, berber_id: i64, tarih: &str) -> Sonuc<Vec<String>> {
    let mut stmt = conn
        .prepare("SELECT saat FROM kapali_slotlar WHERE berber_id = ?1 AND tarih = ?2 ORDER BY saat")
        .map_err(|e| e.to_string())?;
    let satirlar = stmt
        .query_map(params![berber_id, tarih], |r| r.get::<_, String>(0))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(satirlar)
}

pub fn slot_kapat(conn: &Connection, berber_id: i64, tarih: &str, saat: &str) -> Sonuc<()> {
    if tarih.trim().is_empty() {
        return Err("geçersiz tarih".to_string());
    }
    if !saat_gecerli(saat) {
        return Err("geçersiz saat".to_string());
    }
    conn.execute(
        "INSERT OR IGNORE INTO kapali_slotlar (berber_id, tarih, saat) VALUES (?1, ?2, ?3)",
        params![berber_id, tarih.trim(), saat],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn slot_ac(conn: &Connection, berber_id: i64, tarih: &str, saat: &str) -> Sonuc<()> {
    let etkilenen = conn
        .execute(
            "DELETE FROM kapali_slotlar WHERE berber_id = ?1 AND tarih = ?2 AND saat = ?3",
            params![berber_id, tarih, saat],
        )
        .map_err(|e| e.to_string())?;
    if etkilenen == 0 {
        return Err("slot zaten açık".to_string());
    }
    Ok(())
}

fn kilit(vt: &Veritabani) -> Sonuc<std::sync::MutexGuard<'_, Connection>> {
    vt.0.lock()
        .map_err(|_| "veritabanı kilidi alınamadı".to_string())
}

// @lat: [[yonetim#Komutlar]]
#[tauri::command]
pub fn vt_salon_ekle(state: State<'_, Veritabani>, ad: String, sehir: String, adres: String) -> Sonuc<i64> {
    let c = kilit(&state)?;
    salon_ekle(&c, &ad, &sehir, &adres)
}

#[tauri::command]
pub fn vt_salon_listele(state: State<'_, Veritabani>) -> Sonuc<Vec<SalonSatiri>> {
    let c = kilit(&state)?;
    salon_listele(&c)
}

#[tauri::command]
pub fn vt_hizmet_ekle(
    state: State<'_, Veritabani>,
    salon_id: i64,
    ad: String,
    sure_dk: i64,
    fiyat: i64,
) -> Sonuc<i64> {
    let c = kilit(&state)?;
    hizmet_ekle(&c, salon_id, &ad, sure_dk, fiyat)
}

#[tauri::command]
pub fn vt_hizmet_listele(state: State<'_, Veritabani>, salon_id: i64) -> Sonuc<Vec<HizmetSatiri>> {
    let c = kilit(&state)?;
    hizmet_listele(&c, salon_id)
}

#[tauri::command]
pub fn vt_berber_ekle(
    state: State<'_, Veritabani>,
    salon_id: i64,
    ad: String,
    pin: String,
) -> Sonuc<i64> {
    let c = kilit(&state)?;
    berber_ekle(&c, salon_id, &ad, &pin)
}

#[tauri::command]
pub fn vt_berber_listele(state: State<'_, Veritabani>, salon_id: i64) -> Sonuc<Vec<BerberSatiri>> {
    let c = kilit(&state)?;
    berber_listele(&c, salon_id)
}

#[tauri::command]
pub fn vt_berber_giris(
    state: State<'_, Veritabani>,
    salon_id: i64,
    ad: String,
    pin: String,
) -> Sonuc<BerberOturumu> {
    let c = kilit(&state)?;
    berber_giris(&c, salon_id, &ad, &pin)
}

#[tauri::command]
pub fn vt_randevu_kaydet(state: State<'_, Veritabani>, kayit: YeniRandevu) -> Sonuc<i64> {
    let c = kilit(&state)?;
    randevu_kaydet(&c, &kayit)
}

#[tauri::command]
pub fn vt_randevu_listele(state: State<'_, Veritabani>) -> Sonuc<Vec<RandevuSatiri>> {
    let c = kilit(&state)?;
    randevu_listele(&c)
}

#[tauri::command]
pub fn vt_berber_randevulari(
    state: State<'_, Veritabani>,
    berber_id: i64,
) -> Sonuc<Vec<RandevuSatiri>> {
    let c = kilit(&state)?;
    berber_randevulari(&c, berber_id)
}

#[tauri::command]
pub fn vt_durum_guncelle(state: State<'_, Veritabani>, id: i64, durum: String) -> Sonuc<()> {
    let c = kilit(&state)?;
    durum_guncelle(&c, id, &durum)
}

#[tauri::command]
pub fn vt_berber_durum_guncelle(
    state: State<'_, Veritabani>,
    berber_id: i64,
    randevu_id: i64,
    durum: String,
) -> Sonuc<()> {
    let c = kilit(&state)?;
    berber_durum_guncelle(&c, berber_id, randevu_id, &durum)
}

#[tauri::command]
pub fn vt_kapali_slotlar(
    state: State<'_, Veritabani>,
    berber_id: i64,
    tarih: String,
) -> Sonuc<Vec<String>> {
    let c = kilit(&state)?;
    kapali_slotlar(&c, berber_id, &tarih)
}

#[tauri::command]
pub fn vt_slot_kapat(
    state: State<'_, Veritabani>,
    berber_id: i64,
    tarih: String,
    saat: String,
) -> Sonuc<()> {
    let c = kilit(&state)?;
    slot_kapat(&c, berber_id, &tarih, &saat)
}

#[tauri::command]
pub fn vt_slot_ac(
    state: State<'_, Veritabani>,
    berber_id: i64,
    tarih: String,
    saat: String,
) -> Sonuc<()> {
    let c = kilit(&state)?;
    slot_ac(&c, berber_id, &tarih, &saat)
}

#[cfg(test)]
mod testler {
    use super::*;

    fn bellek() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        hazirla(&conn).unwrap();
        conn
    }

    fn ornek_randevu(salon: i64, berber: Option<i64>, kod: &str) -> YeniRandevu {
        YeniRandevu {
            kod: kod.to_string(),
            salon_id: salon,
            berber_id: berber,
            hizmet: "Saç Kesimi".to_string(),
            tarih: "2026-11-02".to_string(),
            saat: "14:00".to_string(),
            tutar: 250,
        }
    }

    // @lat: [[testler#Yönetim#Şema dört tabloyu oluşturur]]
    #[test]
    fn sema_dort_tabloyu_olusturur() {
        let conn = bellek();
        let sayi: i64 = conn
            .query_row(
                "SELECT COUNT(*) FROM sqlite_master WHERE type='table'
                 AND name IN ('salonlar','hizmetler','berberler','randevular')",
                [],
                |r| r.get(0),
            )
            .unwrap();
        assert_eq!(sayi, 4);
    }

    // @lat: [[testler#Yönetim#Salon eklenir ve listelenir]]
    #[test]
    fn salon_eklenir_ve_listelenir() {
        let conn = bellek();
        let id = salon_ekle(&conn, "Moda Berber", "İstanbul", "Moda Cad. 5").unwrap();
        assert!(id > 0);
        let liste = salon_listele(&conn).unwrap();
        assert_eq!(liste.len(), 1);
        assert_eq!(liste[0].ad, "Moda Berber");
        assert!(salon_ekle(&conn, "  ", "İstanbul", "").is_err());
    }

    // @lat: [[testler#Yönetim#Randevu kaydedilir ve durumu güncellenir]]
    #[test]
    fn randevu_kaydedilir_ve_durumu_guncellenir() {
        let conn = bellek();
        let salon = salon_ekle(&conn, "Moda Berber", "İstanbul", "").unwrap();
        let berber = berber_ekle(&conn, salon, "Emre Usta", "1234").unwrap();
        randevu_kaydet(&conn, &ornek_randevu(salon, Some(berber), "RNV-001-AB12CD")).unwrap();

        let liste = randevu_listele(&conn).unwrap();
        assert_eq!(liste.len(), 1);
        assert_eq!(liste[0].durum, "bekliyor");
        assert_eq!(liste[0].berber_ad, "Emre Usta");

        durum_guncelle(&conn, liste[0].id, "onaylandi").unwrap();
        assert_eq!(randevu_listele(&conn).unwrap()[0].durum, "onaylandi");
    }

    // @lat: [[testler#Yönetim#Geçersiz durum reddedilir]]
    #[test]
    fn gecersiz_durum_reddedilir() {
        let conn = bellek();
        let salon = salon_ekle(&conn, "Moda Berber", "İstanbul", "").unwrap();
        let id = randevu_kaydet(&conn, &ornek_randevu(salon, None, "RNV-002-CD34EF")).unwrap();
        assert!(durum_guncelle(&conn, id, "belirsiz").is_err());
        assert_eq!(randevu_listele(&conn).unwrap()[0].durum, "bekliyor");
    }

    // @lat: [[testler#Berber#Slot kapatılır ve yeniden açılır]]
    #[test]
    fn slot_kapatilir_ve_acilir() {
        let conn = bellek();
        let salon = salon_ekle(&conn, "Moda Berber", "İstanbul", "").unwrap();
        let emre = berber_ekle(&conn, salon, "Emre Usta", "1234").unwrap();

        slot_kapat(&conn, emre, "2026-11-07", "14:00").unwrap();
        slot_kapat(&conn, emre, "2026-11-07", "14:00").unwrap();
        assert_eq!(kapali_slotlar(&conn, emre, "2026-11-07").unwrap(), vec!["14:00".to_string()]);

        slot_ac(&conn, emre, "2026-11-07", "14:00").unwrap();
        assert!(kapali_slotlar(&conn, emre, "2026-11-07").unwrap().is_empty());
        assert!(slot_ac(&conn, emre, "2026-11-07", "14:00").is_err());
    }

    // @lat: [[testler#Berber#Geçersiz slot reddedilir]]
    #[test]
    fn gecersiz_slot_reddedilir() {
        let conn = bellek();
        let salon = salon_ekle(&conn, "Moda Berber", "İstanbul", "").unwrap();
        let emre = berber_ekle(&conn, salon, "Emre Usta", "1234").unwrap();

        assert!(slot_kapat(&conn, emre, "2026-11-07", "25:00").is_err());
        assert!(slot_kapat(&conn, emre, "2026-11-07", "9:00").is_err());
        assert!(slot_kapat(&conn, emre, "", "14:00").is_err());
    }

    // @lat: [[testler#Berber#Doğru PIN ile giriş yapılır]]
    #[test]
    fn dogru_pin_ile_giris_yapilir() {
        let conn = bellek();
        let salon = salon_ekle(&conn, "Moda Berber", "İstanbul", "").unwrap();
        berber_ekle(&conn, salon, "Emre Usta", "1234").unwrap();

        let oturum = berber_giris(&conn, salon, "emre usta", "1234").unwrap();
        assert_eq!(oturum.ad, "Emre Usta");
        assert_eq!(oturum.salon_ad, "Moda Berber");

        assert!(berber_giris(&conn, salon, "Emre Usta", "9999").is_err());
        assert!(berber_giris(&conn, salon, "Emre Usta", "12").is_err());
        assert!(berber_ekle(&conn, salon, "Mert Usta", "abcd").is_err());
    }

    // @lat: [[testler#Berber#Berber yalnızca kendi randevusunu günceller]]
    #[test]
    fn berber_yalnizca_kendi_randevusunu_gunceller() {
        let conn = bellek();
        let salon = salon_ekle(&conn, "Moda Berber", "İstanbul", "").unwrap();
        let emre = berber_ekle(&conn, salon, "Emre Usta", "1234").unwrap();
        let mert = berber_ekle(&conn, salon, "Mert Usta", "5678").unwrap();
        let kendi = randevu_kaydet(&conn, &ornek_randevu(salon, Some(emre), "RNV-003-AA11BB")).unwrap();
        let baskasi = randevu_kaydet(&conn, &ornek_randevu(salon, Some(mert), "RNV-004-CC22DD")).unwrap();

        let liste = berber_randevulari(&conn, emre).unwrap();
        assert_eq!(liste.len(), 1);
        assert_eq!(liste[0].id, kendi);

        assert!(berber_durum_guncelle(&conn, emre, baskasi, "onaylandi").is_err());
        assert!(berber_durum_guncelle(&conn, emre, kendi, "bekliyor").is_err());
        berber_durum_guncelle(&conn, emre, kendi, "onaylandi").unwrap();
        assert_eq!(berber_randevulari(&conn, emre).unwrap()[0].durum, "onaylandi");
    }
}
