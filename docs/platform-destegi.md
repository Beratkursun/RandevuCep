# Platform Desteği

RandevuCep, Tauri v2 sayesinde tek kod tabanından masaüstü ve mobil platformlara derlenir. Bu belge hedef platformları, pencere ayarlarını ve Rust/JavaScript kod üretim sözleşmesini açıklar.

## 1. Hedef Platformlar

| Platform | İşletim Sistemleri | Hedef Çıktı | Durum |
|---|---|---|---|
| Masaüstü | macOS (Apple Silicon / Intel) | `.dmg`, `.app` | Tauri hedefi |
| Masaüstü | Windows 10/11 x64 | `.msi`, `.exe` | Tauri hedefi |
| Masaüstü | Linux (Ubuntu/Debian) | `.deb`, `.AppImage` | Tauri hedefi |
| Mobil | iOS (iPhone/iPad) | `.ipa` | Xcode ile |
| Mobil | Android (Telefon/Tablet) | `.apk`, `.aab` | Android Studio ile |

## 2. Pencere Ayarları

`src-tauri/tauri.conf.json` içinde pencere `420×820` açılır; `minWidth: 360` ve `minHeight: 640` ile mobil ölçülerin altına inmesi engellenir. Ürün adı `randevucep`, pencere başlığı `RandevuCep`'tir.

## 3. Rust Komutu

`src-tauri/src/lib.rs` içindeki `randevu_olustur` komutu salon kimliğini `u32` alır ve `RNV-AAA-BBBBBBB` biçiminde kod döner:

```rust
#[tauri::command]
fn randevu_olustur(salon_id: u32) -> String {
    let zaman = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    format!("RNV-{:03}-{:07X}", salon_id, zaman % 0xFFF_FFFF)
}
```

Komut `run` içinde `tauri::generate_handler![randevu_olustur]` ile kaydedilir.

## 4. Tarayıcı Yedeği

`src/lib/native.ts` içindeki `randevuKoduAl`, `isTauri()` doğruysa Rust komutunu `invoke` ile çağırır. Tarayıcıda veya testte Tauri yoksa `WEB-RNV-{üç haneli salonId}-{base36 zaman}` biçiminde bir yedek üretir; böylece arayüz Tauri olmadan da çalışır.

## 5. Derleme ve Çalıştırma

```bash
bun install
bun run dev          # Astro, 127.0.0.1:1420
bun run tauri dev    # Masaüstü kabuğu
bun run build        # Statik üretim
bun run test         # Vitest
bun run check        # svelte-check + lat check
```

Mobil derlemeler için ilgili platform SDK'sı (Xcode veya Android Studio) ve Tauri CLI gerekir. Platform ikon setleri `bun run tauri icon path/to/app-icon.png` ile üretilebilir.
