# İstem Günlüğü 02 — RandevuCep Dönüşümü

## İstem

“lat.md tamamen yanlış; PassoKlon yerine kendi fikrimizi anlatmalı. Kodu da bu hedeflere göre doğrula ve düzelt. Tüm kombinasyonları destekle: tek/çok hizmet, belirli/ilk müsait berber, sepetli/doğrudan onay.”

## Uygulama

- `Etkinlik`/`BiletKategorisi` yerine `Salon`, `Hizmet`, `Berber`, `RandevuTaslagi`, `Randevu`, `Kullanici`.
- `/etkinlik/[id]`, `/sepet`, `/biletlerim` kaldırıldı; `/salon/[id]`, `/randevu`, `/onay`, `/randevularim` eklendi.
- `bilet_olustur` → `randevu_olustur`; kod formatı `RNV-AAA-BBBBBBB`.
- `src/lib/native.ts` ile Tauri/tarayıcı ayrımı.
- `SalonKart`, `SalonDetay`, `RandevuSepeti`, `RandevuOnay`, `Randevularim` bileşenleri.
- `lat.md` bölümleri ve testler aynı anda güncellendi.

## Sonuç

- `lat check`, `bun run check`, 11 test, 12 sayfalık build ve `cargo check` geçti.
- PR #5 ile master’a alındı.
