# Platform Kabuğu

Tek kod tabanı hem tarayıcıda hem Tauri v2 penceresinde çalışır; Rust yalnızca bilet kodu üretiminde devreye girer, kalan her şey önceden üretilmiş statik HTML'dir.

## Statik Ön Yüz ve Tauri Sarmalı

Astro `output: 'static'` ile derlenir ve Vite `127.0.0.1:1420` üzerinde `strictPort` ile servis edilir; Tauri tarafında giriş noktası Rust'taki `run` fonksiyonudur.

`$lib` takma adı `src/lib` klasörüne bakar; opener eklentisi ve `bilet_olustur` komutu `run` içinde kaydedilir.

Kaynaklar: [[astro.config.mjs]], [[src-tauri/src/main.rs#main]], [[src-tauri/src/lib.rs#run]].

## Sayfa Yönlendirme

Rotalar `src/pages` altındaki dosyalardan türetilir; `/etkinlik/[id]` `getStaticPaths` ile katalogdaki altı etkinlik için derleme anında üretilir, bu yüzden derleme 11 sayfa çıkarır.

Statik rotalar `/`, `/sepet`, `/biletlerim`, `/profil` ve MDX tabanlı `/hakkinda`. Sayfa geçişleri `<ClientRouter />` ile SPA akıcılığında yapılır; bileşenler yeniden yüklenmediği için aktif menü durumu `astro:page-load` olayından okunur (bkz. [[navigasyon#Aktif Sekme]]).

Kaynak: [[src/pages/etkinlik/[id].astro]], [[src/layouts/Layout.astro]].

## Çoklu Çatı

Ekranlar Svelte 5 runes ile yazılır. React 19 bugün yalnızca dekoratif `CanliRozet` bileşeninde kullanılır ve tıklama sayısını kendi state'inde tutar; MDX ise `/hakkinda` rehber sayfasında Astro yerleşimini ve React bileşenini birlikte gösterir.

Yeni bir ekran eklenirken taşıyıcı çatı Svelte'dir; React yalnızca hazır bir React bileşeni gerektiğinde devreye alınır.

Kaynak: [[src/components/react/CanliRozet.tsx#CanliRozet]], [[src/pages/hakkinda.mdx]].
