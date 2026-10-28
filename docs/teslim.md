# Teslim

Teslim zincirinin mevcut durumu, sürüm etiketleri, doğrulama çıktıları ve Blackboard adımları.

## Durum

| Kalem | Değer |
|---|---|
| Repo | `Beratkursun/hello-mobil` |
| Etiketler | `v0.1.0-batch-01` (`9a832f1`), `v0.2.0-batch-02` (`4f626f1`) |
| ZIP | `RandevuCep-final.zip` (215 girdi, repo kökünde) |
| Blackboard | Yükleme kullanıcı adımı |

## Blackboard adımları

1. `RandevuCep-final.zip` dosyasını indir.
2. Blackboard → MYO063 Mobil Programlama (kurs kodu `2026–2027–1–11283–1`) → **Teslimler**.
3. İlgili teslim alanına ZIP'i yükle; açıklamaya repo adresini ve `v0.2.0-batch-02` etiketini yaz.
4. Yükleme onayını (isteğe bağlı) `docs/` altına ekran görüntüsü olarak kaydet.

## ZIP kapsamı

Kaynak kod (`src/`, `src-tauri/`), dokümantasyon (`docs/`, `lat.md/`), testler (`tests/`), yapılandırma dosyaları ve `README.md`. `node_modules/`, `dist/`, `.env` ve derleme çıktıları pakete girmez.

## Doğrulama

```text
$ lat check
All checks passed

$ bun run check
svelte-check found 0 errors and 1 warning
All checks passed

$ bun run test
Test Files  3 passed (3)
Tests       11 passed (11)

$ bun run build
27 page(s) built

$ cd src-tauri && cargo test
test result: ok. 2 passed; 0 failed
```

## Notlar

- `.env` ve `RandevuCep-final.zip` sürüm kontrolüne girmez; ZIP yalnızca Blackboard'a yüklenir.
- Etiketler `master` üzerindedir; `v0.2.0-batch-02` Batch 02 kapanışını işaretler.
