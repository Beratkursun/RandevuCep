# Alt Menü

Beş sekmeli sabit alt menü her sayfada aynıdır; aktif sekme yol adından türetilir ve sepet sekmesi canlı adet rozeti taşır.

## Sekmeler

Sıra ve ikonlar tek bir `menu` dizisinde tanımlıdır; yeni bir sekme eklemek için diziye kayıt eklemek yeterlidir.

Sırasıyla Keşfet `/`, Biletlerim `/biletlerim`, Sepet `/sepet`, Profil `/profil` ve Rehber `/hakkinda` yer alır. Menü tüm sayfalarda aynı bileşenden geldiği için başka yerde değişiklik gerekmez.

Kaynak: [[src/components/AppNav.svelte]].

## Aktif Sekme

`Layout` sunucu tarafında `currentPath` geçer; bileşen `onMount` sonrasında `window.location.pathname` değerini kullanır.

İstemci tarafı geçişlerde güncel kalmak için `astro:page-load` ve `popstate` olayları dinlenir. Kök dışındaki sekmeler `startsWith` ile eşleşir; kök yalnızca tam eşleşmede aktiftir, bu yüzden `/etkinlik/3` Keşfet'i aktif yapmaz.

## Sepet Rozeti

`sepet.adet` sıfırdan büyükse sepet sekmesinde adet balonu görünür. Sepet store'u global olduğu için ayrıca sayım tutulmaz.

## Yerleşim

Menü `position: fixed` ile alt kenara sabitlenir ve `env(safe-area-inset-bottom)` ile çentikli cihazlarda boşluk bırakır; içerik menünün altında kalmasın diye `main` öğesine aynı yükseklikte alt dolgu verilir.
