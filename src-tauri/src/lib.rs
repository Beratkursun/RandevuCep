use std::time::{SystemTime, UNIX_EPOCH};
use tauri::Manager;

mod db;

// Adım 11: Rust komutu — ön yüz invoke("randevu_olustur", { salonId }) ile çağırır
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// @lat: [[randevular#Rust Komutu]]
#[tauri::command]
fn randevu_olustur(salon_id: u32) -> String {
    let zaman = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    format!("RNV-{:03}-{:07X}", salon_id, zaman % 0xFFF_FFFF)
}

// @lat: [[mimari#Platform Kabuğu]]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let klasor = app.path().app_data_dir()?;
            std::fs::create_dir_all(&klasor)?;
            let conn = db::baglan(&klasor.join("randevucep.db"))?;
            app.manage(db::Veritabani(std::sync::Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            randevu_olustur,
            db::vt_salon_ekle,
            db::vt_salon_listele,
            db::vt_hizmet_ekle,
            db::vt_hizmet_listele,
            db::vt_berber_ekle,
            db::vt_berber_listele,
            db::vt_randevu_kaydet,
            db::vt_randevu_listele,
            db::vt_durum_guncelle
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::randevu_olustur;

    // @lat: [[testler#Rust#Kod formatı salon kimliğini taşır]]
    #[test]
    fn kod_formati_salon_kimligini_tasir() {
        let kod = randevu_olustur(42);
        assert!(kod.starts_with("RNV-042-"));

        let son_ek = kod.strip_prefix("RNV-042-").unwrap();
        assert!(!son_ek.is_empty());
        assert!(son_ek.len() <= 7);
        assert!(son_ek.chars().all(|c| c.is_ascii_hexdigit()));
    }

    // @lat: [[testler#Rust#Her çağrı yeni kod üretir]]
    #[test]
    fn her_cagri_yeni_kod_uretir() {
        let ilk = randevu_olustur(7);
        std::thread::sleep(std::time::Duration::from_nanos(1));
        let ikinci = randevu_olustur(7);
        assert_ne!(ilk, ikinci);
    }
}
