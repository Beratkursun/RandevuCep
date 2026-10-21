# Batch 02 İlerleme Denetimi

Tarih: 21.10.2026 · Kapsam: Hafta 04 (Görev 09.1–16) · Proje: RandevuCep

## 1. Kontrol Matrisi

| Görev | Konu | Kanıt | Durum |
|:---:|---|---|:---:|
| 09.1 | Master koruması | [`docs/pr-guvenligi.md`](pr-guvenligi.md); GitHub kural seti | ✅ |
| 10 | Çalışma yöntemi | [`docs/calisma-yontemi.md`](calisma-yontemi.md); istem günlükleri | ✅ |
| 11 | Veri sözleşmesi | `src/lib/types/`, [`docs/veri-modeli.md`](veri-modeli.md), `bun run check` | ✅ |
| 12 | Kart bileşeni | [`src/lib/components/SalonKart.svelte`](../src/lib/components/SalonKart.svelte) | ✅ |
| 13 | Liste ve üç durum | [`src/components/Kesfet.svelte`](../src/components/Kesfet.svelte) | ✅ |
| 15 | Rust komutu ve platform | `randevu_olustur`, [`src/lib/native.ts`](../src/lib/native.ts), [`docs/platform-destegi.md`](platform-destegi.md) | ✅ |
| 16 | Batch 02 denetimi | `minWidth: 360`, bu belge, `v0.2.0-batch-02` etiketi | ✅ |

## 2. Doğrulama Kanıtı

```text
$ lat check
All checks passed

$ bun run test
Test Files  3 passed (3)
Tests       11 passed (11)

$ bun run build
27 page(s) built in 1.18s
Complete!

$ cd src-tauri && cargo check
Finished `dev` profile [unoptimized + debuginfo] target(s)
```

## 3. Etiket

`v0.2.0-batch-02` etiketi master üzerinde oluşturuldu ve push edildi (`93daf19`).

## 4. Kalan

- `v0.1.0-batch-01` ve `v0.2.0-batch-02` etiketlerinin push edilmesi.
- Final ZIP'in Blackboard'a yüklenmesi (kullanıcı adımı).
