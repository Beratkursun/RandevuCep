//! Dükkan sahibi ve çalışan hesapları: kayıt, giriş ve sahip özeti.
//! Şifreler rastgele tuz + SHA-256 ile saklanır; düz metin tutulmaz.

use crate::db::{Sonuc, Veritabani};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::State;

pub const ROLLER: [&str; 2] = ["sahip", "calisan"];

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HesapOturumu {
    pub id: i64,
    pub ad: String,
    pub rol: String,
    pub salon_id: i64,
    pub salon_ad: String,
    pub berber_id: Option<i64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CalisanOzeti {
    pub ad: String,
    pub berber_id: Option<i64>,
    pub randevu_sayisi: i64,
    pub onayli: i64,
    pub ciro: i64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct YeniHesap {
    pub salon_id: i64,
    pub ad: String,
    pub sifre: String,
    pub rol: String,
}

fn tuz() -> String {
    let n = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    format!("{n:x}")
}

fn ozet(tuz: &str, sifre: &str) -> String {
    let mut h = Sha256::new();
    h.update(tuz.as_bytes());
    h.update(b":");
    h.update(sifre.as_bytes());
    format!("{:x}", h.finalize())
}

fn sifre_gecerli(sifre: &str) -> bool {
    sifre.chars().count() >= 4
}

// @lat: [[yonetim#Hesaplar]]
pub fn hazirla(conn: &Connection) -> Sonuc<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS hesaplar (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             salon_id INTEGER NOT NULL REFERENCES salonlar(id) ON DELETE CASCADE,
             ad TEXT NOT NULL,
             rol TEXT NOT NULL DEFAULT 'calisan',
             sifre_hash TEXT NOT NULL,
             berber_id INTEGER REFERENCES berberler(id),
             olusturma TEXT NOT NULL DEFAULT (datetime('now')),
             UNIQUE(salon_id, ad)
         );",
    )
    .map_err(|e| e.to_string())
}

fn salon_adi(conn: &Connection, salon_id: i64) -> Sonuc<String> {
    conn.query_row("SELECT ad FROM salonlar WHERE id = ?1", params![salon_id], |r| r.get(0))
        .map_err(|_| "salon bulunamadı".to_string())
}

fn berber_bul_veya_ekle(conn: &Connection, salon_id: i64, ad: &str) -> Sonuc<i64> {
    let mevcut: Option<i64> = conn
        .query_row(
            "SELECT id FROM berberler WHERE salon_id = ?1 AND lower(ad) = lower(?2)",
            params![salon_id, ad],
            |r| r.get(0),
        )
        .optional()
        .map_err(|e| e.to_string())?;
    if let Some(id) = mevcut {
        return Ok(id);
    }
    conn.execute(
        "INSERT INTO berberler (salon_id, ad, pin_hash) VALUES (?1, ?2, '')",
        params![salon_id, ad],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

// @lat: [[yonetim#Hesaplar]]
pub fn kayit(
    conn: &Connection,
    salon_id: i64,
    ad: &str,
    sifre: &str,
    rol: &str,
) -> Sonuc<HesapOturumu> {
    let ad = ad.trim();
    if ad.is_empty() {
        return Err("ad zorunlu".to_string());
    }
    if !sifre_gecerli(sifre) {
        return Err("şifre en az 4 karakter olmalı".to_string());
    }
    if !ROLLER.contains(&rol) {
        return Err("geçersiz rol".to_string());
    }
    let salon = salon_adi(conn, salon_id)?;

    let berber_id = if rol == "calisan" {
        Some(berber_bul_veya_ekle(conn, salon_id, ad)?)
    } else {
        None
    };
    let t = tuz();
    let hash = format!("{t}${}", ozet(&t, sifre));

    conn.execute(
        "INSERT INTO hesaplar (salon_id, ad, rol, sifre_hash, berber_id) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![salon_id, ad, rol, hash, berber_id],
    )
    .map_err(|e| {
        if e.to_string().contains("UNIQUE") {
            "bu isimde bir hesap zaten var".to_string()
        } else {
            e.to_string()
        }
    })?;

    Ok(HesapOturumu {
        id: conn.last_insert_rowid(),
        ad: ad.to_string(),
        rol: rol.to_string(),
        salon_id,
        salon_ad: salon,
        berber_id,
    })
}

// @lat: [[yonetim#Hesaplar]]
pub fn giris(conn: &Connection, salon_id: i64, ad: &str, sifre: &str) -> Sonuc<HesapOturumu> {
    let satir: Option<(i64, String, String, String, Option<i64>)> = conn
        .query_row(
            "SELECT id, ad, rol, sifre_hash, berber_id FROM hesaplar
             WHERE salon_id = ?1 AND lower(ad) = lower(?2)",
            params![salon_id, ad.trim()],
            |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?, r.get(4)?)),
        )
        .optional()
        .map_err(|e| e.to_string())?;

    let (id, ad, rol, hash, berber_id) = satir.ok_or_else(|| "hesap bulunamadı".to_string())?;
    let (t, beklenen) = hash.split_once('$').ok_or_else(|| "şifre kaydı bozuk".to_string())?;
    if ozet(t, sifre) != beklenen {
        return Err("şifre hatalı".to_string());
    }

    Ok(HesapOturumu {
        id,
        ad,
        rol,
        salon_id,
        salon_ad: salon_adi(conn, salon_id)?,
        berber_id,
    })
}

// @lat: [[yonetim#Hesaplar]]
pub fn calisanlar(conn: &Connection, salon_id: i64) -> Sonuc<Vec<CalisanOzeti>> {
    let mut stmt = conn
        .prepare(
            "SELECT h.ad, h.berber_id,
                    (SELECT COUNT(*) FROM randevular r WHERE r.berber_id = h.berber_id),
                    (SELECT COUNT(*) FROM randevular r WHERE r.berber_id = h.berber_id AND r.durum = 'onaylandi'),
                    (SELECT COALESCE(SUM(r.tutar), 0) FROM randevular r
                       WHERE r.berber_id = h.berber_id AND r.durum = 'onaylandi')
             FROM hesaplar h
             WHERE h.salon_id = ?1 AND h.rol = 'calisan'
             ORDER BY h.ad COLLATE NOCASE",
        )
        .map_err(|e| e.to_string())?;
    let liste = stmt
        .query_map(params![salon_id], |r| {
            Ok(CalisanOzeti {
                ad: r.get(0)?,
                berber_id: r.get(1)?,
                randevu_sayisi: r.get(2)?,
                onayli: r.get(3)?,
                ciro: r.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(liste)
}

fn kilit(vt: &Veritabani) -> Sonuc<std::sync::MutexGuard<'_, Connection>> {
    vt.0.lock()
        .map_err(|_| "veritabanı kilidi alınamadı".to_string())
}

#[tauri::command]
pub fn vt_hesap_kayit(
    state: State<'_, Veritabani>,
    kayit: YeniHesap,
) -> Sonuc<HesapOturumu> {
    let c = kilit(&state)?;
    kayit_db(&c, &kayit)
}

fn kayit_db(conn: &Connection, k: &YeniHesap) -> Sonuc<HesapOturumu> {
    kayit(conn, k.salon_id, &k.ad, &k.sifre, &k.rol)
}

#[tauri::command]
pub fn vt_hesap_giris(
    state: State<'_, Veritabani>,
    salon_id: i64,
    ad: String,
    sifre: String,
) -> Sonuc<HesapOturumu> {
    let c = kilit(&state)?;
    giris(&c, salon_id, &ad, &sifre)
}

#[tauri::command]
pub fn vt_isletme_calisanlari(
    state: State<'_, Veritabani>,
    salon_id: i64,
) -> Sonuc<Vec<CalisanOzeti>> {
    let c = kilit(&state)?;
    calisanlar(&c, salon_id)
}

#[cfg(test)]
mod testler {
    use super::*;
    use crate::db::hazirla as db_hazirla;

    fn bellek() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        db_hazirla(&conn).unwrap();
        hazirla(&conn).unwrap();
        conn
    }

    fn salon(conn: &Connection) -> i64 {
        conn.execute(
            "INSERT INTO salonlar (ad, sehir, adres) VALUES ('Moda Berber', 'İstanbul', '')",
            [],
        )
        .unwrap();
        conn.last_insert_rowid()
    }

    // @lat: [[testler#Hesaplar#Kayıt ve giriş çalışır]]
    #[test]
    fn kayit_ve_giris_calisir() {
        let conn = bellek();
        let s = salon(&conn);
        let h = kayit(&conn, s, "Emre Usta", "1234", "calisan").unwrap();
        assert_eq!(h.rol, "calisan");
        assert!(h.berber_id.is_some());

        assert!(giris(&conn, s, "emre usta", "1234").is_ok());
        assert!(giris(&conn, s, "Emre Usta", "9999").is_err());
        assert!(kayit(&conn, s, "Emre Usta", "1234", "calisan").is_err());
        assert!(kayit(&conn, s, "Ali", "12", "calisan").is_err());
    }

    // @lat: [[testler#Hesaplar#Sahip çalışan özetini görür]]
    #[test]
    fn sahip_calisan_ozetini_gorur() {
        let conn = bellek();
        let s = salon(&conn);
        let sahip = kayit(&conn, s, "Dükkan Sahibi", "1234", "sahip").unwrap();
        assert_eq!(sahip.rol, "sahip");
        kayit(&conn, s, "Emre Usta", "1234", "calisan").unwrap();

        let mut liste = calisanlar(&conn, s).unwrap();
        assert_eq!(liste.len(), 1);
        assert_eq!(liste[0].ad, "Emre Usta");
        assert_eq!(liste[0].randevu_sayisi, 0);
        assert_eq!(liste[0].ciro, 0);

        let berber = liste[0].berber_id.unwrap();
        conn.execute(
            "INSERT INTO randevular (kod, salon_id, berber_id, hizmet, tarih, saat, tutar, durum)
             VALUES ('RNV-001-A', ?1, ?2, 'Saç', '2026-11-10', '10:00', 300, 'onaylandi')",
            params![s, berber],
        )
        .unwrap();

        liste = calisanlar(&conn, s).unwrap();
        assert_eq!(liste[0].onayli, 1);
        assert_eq!(liste[0].ciro, 300);
    }
}
