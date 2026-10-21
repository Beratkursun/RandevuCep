# Bilet Üretimi

Bilet kodu Rust tarafında üretilir (`PSK-AAA-BBBBBBB`); Tauri dışında çalışırken aynı sözleşme `WEB-...` biçimindeki JS yedeğiyle karşılanır.

## Rust Komutu

`bilet_olustur` etkinlik kimliğini `u32` olarak alır, sistem saatinden nanosaniye üretir ve `PSK-{:03}-{:07X}` biçiminde, en fazla 7 haneli onaltılık son ek ile kodu döner. Kod saklanmaz; her çağrı yeni bir kod üretir.

Kaynak: [[src-tauri/src/lib.rs#bilet_olustur]].

## Ortam Ayrımı

`isTauri()` doğruysa `invoke<string>("bilet_olustur", { etkinlikId })` çağrılır; Rust parametresi `etkinlik_id` (snake_case) olsa da JS tarafında `etkinlikId` yazılır. Tarayıcıda aynı işlevi `WEB-{id}-{base36 zaman}` üreten yedek karşılar.

Kaynak: [[src/lib/biletler.svelte.ts]], [[src-tauri/src/lib.rs#bilet_olustur]].

## Satın Alma Akışı

Sepetteki "Ödemeyi tamamla" düğmesi `satinAl(sepet.kalemler)` çağırır: her kalem için sırayla kod alınır, bilet listeye başa eklenir, sepet temizlenir ve `/biletlerim` sayfasına gidilir. `isleniyor` bayrağı işlem sürerken düğmeyi kilitler.

Kaynak: [[src/components/Sepet.svelte]], [[src/lib/biletler.svelte.ts#Biletlerim#satinAl]].

## Kalıcılık

Biletler `localStorage["biletlerim"]` altında JSON dizisi olarak saklanır; okuma hata verirse boş liste kabul edilir, yazma her satın almadan sonra tüm listeyi yeniden yazar. Bu yüzden biletler tarayıcı verisi silinene kadar kalır.

Kaynak: [[src/lib/biletler.svelte.ts#Biletlerim]].
