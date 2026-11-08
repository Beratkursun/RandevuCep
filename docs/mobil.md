# Mobil Kurulum (Android / iOS)

RandevuCep, Tauri v2 sayesinde aynı kod tabanından Android ve iOS uygulaması olarak derlenebilir. Bu belge hangi makinede neyin gerektiğini ve telefona kurulum adımlarını anlatır.

## 1. Ön koşullar

| Platform | Gerekli işletim sistemi | Araçlar |
|---|---|---|
| **Android** | Windows, macOS veya Linux | JDK 17, Android Studio (SDK + NDK), Rust mobil hedefleri |
| **iOS** | **Yalnızca macOS** | Xcode 15+, CocoaPods, Rust iOS hedefleri, Apple Developer hesabı (cihaza kurmak için) |

> Windows'ta iOS uygulaması derlenemez. iOS için bir Mac, macOS çalıştıran CI (GitHub Actions `macos-latest`, Codemagic) veya kiralık Mac hizmeti gerekir.

## 2. Android

### 2.1 Araçları kur (bir kez)

1. **JDK 17** — [Microsoft OpenJDK 17](https://learn.microsoft.com/java/openjdk/download) veya `winget install Microsoft.OpenJDK.17`.
2. **Android Studio** — SDK Manager'dan şunları yükle:
   - Android SDK Platform 35
   - Android SDK Build-Tools 35
   - Android SDK Platform-Tools
   - **NDK (Side by side) 27.x**
   - Android Emulator (isteğe bağlı)
3. Ortam değişkenleri:
   ```powershell
   setx ANDROID_HOME "$env:LOCALAPPDATA\Android\Sdk"
   setx JAVA_HOME "C:\Program Files\Microsoft\jdk-17.0.x-hotspot"
   ```
   Yeni terminal açıp doğrula: `echo $env:ANDROID_HOME`, `java -version`.
4. Rust hedefleri:
   ```bash
   rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
   ```

### 2.2 Projeyi mobil için hazırla (bir kez)

```bash
bun run tauri android init
```

Bu komut `src-tauri/gen/android/` altında Android Studio projesini ve ikonları üretir.

### 2.3 Geliştirme / telefonda çalıştırma

```bash
# USB hata ayıklama açık bir telefonda veya emülatörde
bun run android
```

### 2.4 APK üret ve telefona kur

```bash
bun run android:build
```

Çıktı:
```
src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk
```

Kurulum:
```bash
adb install -r "src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk"
```
veya APK'yı telefona kopyalayıp dosya yöneticisinden aç ("Bilinmeyen kaynaklara izin ver" gerekir).

**İmzalama:** Release APK'nın Play Store dışında kurulabilmesi için imzalanması gerekir. `src-tauri/gen/android/keystore.properties` oluşturup `storeFile`, `storePassword`, `keyAlias`, `keyPassword` tanımla; aksi hâlde `tauri android build` debug anahtarıyla imzalar (yerel kurulum için yeterlidir).

## 3. iOS

### 3.1 Araçları kur (Mac'te)

1. Xcode 15+ (App Store) ve Command Line Tools.
2. `xcode-select --install`, ardından `brew install cocoapods`.
3. Rust hedefleri:
   ```bash
   rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
   ```

### 3.2 Projeyi hazırla

```bash
bun run tauri ios init
```

### 3.3 Çalıştırma ve derleme

```bash
bun run ios          # simülatör veya bağlı iPhone
bun run ios:build    # imzalı .ipa üretimi
```

Xcode'da `src-tauri/gen/apple/randevucep.xcodeproj` dosyasını açıp **Signing & Capabilities → Team** seçerek Apple Developer hesabını bağla. Cihaza kurmak için geliştirici sertifikası ve provisioning profile gerekir; TestFlight ile dağıtım yapılabilir.

## 4. Mobilde veri katmanı

- SQLite (`rusqlite`) mobilde de çalışır; veritabanı dosyası uygulamanın kendi veri klasöründe tutulur (`app_data_dir`).
- Tauri dışında (tarayıcı) aynı arayüz `localStorage` yedeğiyle çalışır.
- Berber girişi ve yönetim paneli mobilde de aynı şekilde kullanılır; ekranlar 360 px genişlikten itibaren düzgün görünecek şekilde tasarlandı.

## 5. Sık karşılaşılan sorunlar

| Belirti | Çözüm |
|---|---|
| `NDK not found` | Android Studio → SDK Tools → NDK 27.x kur, `ANDROID_HOME` doğru mu bak |
| `Unsupported class file major version` | JDK 17 kullan (JDK 21+ bazı sürümlerde sorun çıkarır) |
| `device not found` | `adb devices` ile cihazı gör; USB hata ayıklama ve "Dosya aktarımı" modu açık olsun |
| iOS `Signing for ... requires a development team` | Xcode → Signing & Capabilities → Team seç |
| Boş beyaz ekran | `bun run build` sonrası tekrar dene; `devUrl` yerine `frontendDist` kullanıldığından emin ol |
