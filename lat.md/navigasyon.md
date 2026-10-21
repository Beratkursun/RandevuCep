# Alt Menü

Beş sekmeli sabit alt menü her sayfada aynıdır; aktif sekme yol adından türetilir ve sepet sekmesi onay bekleyen randevu sayısını taşır.

## Sekmeler

Sıra ve ikonlar tek bir `menu` dizisinde tanımlıdır; yeni bir sekme eklemek için diziye kayıt eklemek yeterlidir.

Sırasıyla Keşfet `/`, Randevularım `/randevularim`, Sepet `/randevu`, Profil `/profil` ve Rehber `/hakkinda` yer alır. Menü tüm sayfalarda aynı bileşenden geldiği için başka yerde değişiklik gerekmez.

Kaynak: [[src/components/AppNav.svelte]].

## Aktif Sekme

`Layout` sunucu tarafında `currentPath` geçer; bileşen `onMount` sonrasında `window.location.pathname` değerini kullanır.

İstemci tarafı geçişlerde güncel kalmak için `astro:page-load` ve `popstate` olayları dinlenir. Kök dışındaki sekmeler `startsWith` ile eşleşir; kök yalnızca tam eşleşmede aktiftir, bu yüzden `/salon/3` Keşfet'i aktif yapmaz.

## Sepet Rozeti

`randevuSepeti.adet` sıfırdan büyükse sepet sekmesinde adet balonu görünür. Store global olduğu için ayrıca sayım tutulmaz.

Kaynak: [[src/lib/randevu-sepeti.svelte.ts#RandevuSepeti]].

## Yerleşim

Menü `position: fixed` ile alt kenara sabitlenir ve `env(safe-area-inset-bottom)` ile çentikli cihazlarda boşluk bırakır; içerik menünün altında kalmasın diye `main` öğesine aynı yükseklikte alt dolgu verilir.
