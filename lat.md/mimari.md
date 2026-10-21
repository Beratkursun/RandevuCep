# Platform Kabuğu

Tek kod tabanı tarayıcıda ve Tauri v2 penceresinde çalışır; Rust yalnızca randevu kodu üretiminde devreye girer, kalan her şey statik HTML'dir.

## Statik Ön Yüz ve Tauri Sarmalı

Astro `output: 'static'` ile derlenir ve Vite `127.0.0.1:1420` üzerinde `strictPort` ile servis edilir; Tauri giriş noktası Rust'taki `run` fonksiyonudur.

`$lib` takma adı `src/lib` klasörüne bakar; opener eklentisi ve `randevu_olustur` komutu `run` içinde kaydedilir.

Kaynaklar: [[astro.config.mjs]], [[src-tauri/src/main.rs#main]], [[src-tauri/src/lib.rs#run]].

## Sayfa Yönlendirme

Rotalar `src/pages` altındaki dosyalardan türetilir; `/salon/[id]` `getStaticPaths` ile katalogdaki altı salon için derleme anında üretilir ve derleme 12 sayfa çıkarır.

Statik rotalar `/`, `/randevu`, `/onay`, `/randevularim`, `/profil` ve MDX tabanlı `/hakkinda`. Sayfa geçişleri `<ClientRouter />` ile SPA akıcılığında yapılır; bileşenler yeniden yüklenmediği için aktif menü durumu `astro:page-load` olayından okunur (bkz. [[navigasyon#Aktif Sekme]]).

Kaynak: [[src/pages/salon/[id].astro]], [[src/layouts/Layout.astro]].

## Çoklu Çatı

Ekranlar Svelte 5 runes ile yazılır. React 19 bugün yalnızca dekoratif `CanliRozet` bileşeninde kullanılır; MDX ise `/hakkinda` rehber sayfasında Astro yerleşimini ve React bileşenini birlikte gösterir.

Yeni bir ekran eklenirken taşıyıcı çatı Svelte'dir; React yalnızca hazır bir React bileşeni gerektiğinde devreye alınır.

Kaynak: [[src/components/react/CanliRozet.tsx#CanliRozet]], [[src/pages/hakkinda.mdx]].
