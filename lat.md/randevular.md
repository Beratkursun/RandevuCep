# Randevu Üretimi

Randevu kodu Rust tarafında `RNV-AAA-BBBBBBB` biçiminde üretilir; Tauri dışında aynı sözleşme `WEB-RNV-...` biçimindeki JS yedeğiyle karşılanır.

## Rust Komutu

`randevu_olustur` salon kimliğini `u32` olarak alır, sistem saatinden nanosaniye üretir ve `RNV-{:03}-{:07X}` biçiminde, en fazla 7 haneli onaltılık son ek ile kodu döner. Kod saklanmaz; her çağrı yeni bir kod üretir.

Kaynak: [[src-tauri/src/lib.rs#randevu_olustur]].

## Ortam Ayrımı

`native.ts` içindeki `randevuKoduAl`, Tauri içinde `invoke<string>("randevu_olustur", { salonId })` çağırır; tarayıcıda `WEB-RNV-{üç haneli salonId}-{base36 zaman}` yedeğini üretir.

Rust parametresi `salon_id` (snake_case) olsa da JS tarafında `salonId` yazılır.

Kaynak: [[src/lib/native.ts]], [[src-tauri/src/lib.rs#randevu_olustur]].

## Onay Akışı

Sepetteki "Randevuları onayla" düğmesi `onayla(taslaklar)` çağırır: her taslak için kod alınır, randevu listeye eklenir, `localStorage["randevularim"]` güncellenir ve `/randevularim` açılır.

`isleniyor` bayrağı işlem sürerken düğmeyi kilitler.

Kaynak: [[src/components/RandevuSepeti.svelte]], [[src/lib/randevular.svelte.ts#Randevular#onayla]].

## Kalıcılık

Randevular `localStorage["randevularim"]` altında JSON dizisi olarak saklanır; okuma hata verirse veya kayıt dizi değilse boş liste kabul edilir, yazma her onaydan sonra tüm listeyi yeniden yazar.

Kaynak: [[src/lib/randevular.svelte.ts#Randevular]].
