# Çalışma Yöntemi ve İstem Günlükleri

Bu belge, RandevuCep geliştirirken kullanılan AI destekli çalışma yöntemini ve istem günlüklerinin indeksini tanımlar. Amaç, her değişikliğin lat.md, test ve PR kanıtıyla izlenebilmesidir.

## 1. Akış

1. **Bağlam:** `lat.md/lat.md` indeksi ve ilgili bölüm okunur; hedef netleşmeden kod değiştirilmez.
2. **Plan:** Açık iş `lat.md/gorevler.md` içine yazılır; gerekiyorsa kullanıcıdan onay alınır.
3. **Dal:** `feature/<kisa-ad>` açılır; `master` korumalıdır.
4. **Uygulama:** Kod, tip, test ve `lat.md` aynı değişiklikte güncellenir.
5. **Doğrulama:** `lat check`, `bun run check`, `bun run test`, `bun run build`; Rust için `cargo check`.
6. **PR:** Diff kontrol edilir, açıklamada yapılan iş ve AI görevi yazılır, merge edilir.
7. **Kayıt:** İstem günlüğü ve `lat.md/gorevler.md` güncellenir.

## 2. AI Kullanım Kuralları

- AI, `lat.md` ve `docs/` belgelerini tek doğru kaynak kabul eder; belgeleri kopyalayıp çoğaltmaz.
- Üretilen kod, kabul ölçütleri ve testlerle doğrulanmadan “tamam” sayılmaz.
- Renk, rota ve veri modeli kararları `docs/branding.md`, `docs/mimari-agac.md` ve `docs/veri-modeli.md` ile çelişemez.
- Kullanıcıdan gelen düzeltmeler önce ilgili belgeye, sonra koda yansıtılır.

## 3. İstem Günlükleri

| Tarih | Günlük | Konu |
|---|---|---|
| 21.10.2026 | [`istem-gunlukleri/01-lat-analizi.md`](istem-gunlukleri/01-lat-analizi.md) | lat.md ve eğitmen raporunun incelenmesi, açık görevlerin çıkarılması |
| 21.10.2026 | [`istem-gunlukleri/02-randevucep-donusumu.md`](istem-gunlukleri/02-randevucep-donusumu.md) | PassoKlon’dan RandevuCep’e tam dönüşüm |
| 21.10.2026 | [`istem-gunlukleri/03-kalan-gorevler.md`](istem-gunlukleri/03-kalan-gorevler.md) | Kısmi görevlerin tamamlanması: README, marka, 4 dil, responsive, tag |

## 4. Doğrulama Komutları

```bash
lat check
bun run check
bun run test
bun run build
cd src-tauri && cargo check
```
