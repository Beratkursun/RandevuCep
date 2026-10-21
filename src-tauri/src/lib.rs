use std::time::{SystemTime, UNIX_EPOCH};

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
        .invoke_handler(tauri::generate_handler![randevu_olustur])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
