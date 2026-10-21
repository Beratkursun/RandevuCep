# Batch 01 İlerleme Denetimi

Tarih: 21.10.2026 · Kapsam: Hafta 03 (Görev 01–09) · Proje: RandevuCep

## 1. Kontrol Matrisi

| No | Alan | Kanıt | Durum |
|:---:|---|---|:---:|
| 1 | Fork ve işbirliği | `Beratkursun/hello-mobil` fork'u; eğitmen collaborator (rapor 10/10) | ✅ |
| 2 | Blackboard teslimi | Final ZIP `RandevuCep-final.zip` hazırlanacak; yükleme kullanıcıda | ⏳ |
| 3 | Proje fikri | [`docs/proje-fikri.md`](proje-fikri.md) dolu; 3 ekran, hedef kitle ve RNV formatı | ✅ |
| 4 | README | [`README.md`](../README.md) başlık, künye, rozetler ve TOC güncel | ✅ |
| 5 | Ajan kural dosyaları | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`; docs indeksi ve komutlar | ✅ |
| 6 | Markalama | [`docs/branding.md`](branding.md), `app.css`, header, Tauri adı, favicon ve platform ikonları | ✅ |
| 7 | Bilgi sayfaları | `/hakkinda`, `/iletisim`, `/kosullar`, `/gizlilik`; TR/EN/AR/FA ve RTL | ✅ |
| 8 | Mimari ağaç | [`docs/mimari-agac.md`](mimari-agac.md) sayfa ağacı, platform matrisi ve breakpoint'ler | ✅ |
| 9 | Derleme | `bun run build` → 27 sayfa, `Complete!` | ✅ |

## 2. Build Kanıtı

```text
$ bun run build
...
generating static routes
├─ /hakkinda/index.html
├─ /iletisim/index.html
├─ /kosullar/index.html
├─ /gizlilik/index.html
├─ /en/hakkinda/index.html
├─ /ar/hakkinda/index.html
├─ /fa/hakkinda/index.html
...
27 page(s) built in 1.18s
Complete!
```

Ekran görüntüsü: [`docs/ekran-01-kesfet.png`](ekran-01-kesfet.png) · tablet: [`ekran-04-kesfet-tablet.png`](ekran-04-kesfet-tablet.png) · masaüstü: [`ekran-05-kesfet-masaustu.png`](ekran-05-kesfet-masaustu.png) · Arapça RTL: [`ekran-03-hakkinda-ar.png`](ekran-03-hakkinda-ar.png)

## 3. Etiket

`v0.1.0-batch-01` etiketi master üzerinde oluşturulup push edilecektir.

## 4. Kalan

- Final ZIP'in Blackboard'a yüklenmesi (kullanıcı adımı).
- Varsa eğitmenin istediği ekran görüntüsü/teslim formatı.
