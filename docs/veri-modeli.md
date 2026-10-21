# RandevuCep Veri Modeli

Bu belge, RandevuCep'in randevu veri sözleşmesini tanımlar. Tipler `src/lib/types/` altında yaşar; `src/lib/data.ts` bu tiplere bağlı örnek katalog üretir.

## 1. Tipler

| Tip | Alanlar | Açıklama |
|---|---|---|
| `Salon` | `id`, `ad`, `semt`, `adres`, `puan`, `renk`, `aciklama`, `calismaSaatleri`, `hizmetler`, `berberler` | Bir berber/kuaför işletmesi. |
| `Hizmet` | `id`, `ad`, `kategori`, `sureDk`, `fiyat` | Salon içinde seçilebilen tek hizmet. |
| `Berber` | `id`, `ad`, `uzmanlik` | Salonda çalışan berber/kuaför. |
| `RandevuTaslagi` | `id`, `salonId`, `berberId`, `hizmetler`, `tarih`, `saat` | Onay bekleyen randevu; `berberId: null` ilk müsait berber demektir. |
| `Randevu` | `id`, `kod`, `salonId`, `berberId`, `salonAd`, `berberAd`, `hizmetler`, `tarih`, `saat`, `toplamTutar`, `toplamSure`, `durum` | Onaylanmış randevu; gösterim için salon/berber adı kopyalanır. |
| `Kullanici` | `ad`, `telefon` | Profil ekranındaki yerel kullanıcı bilgisi. |

## 2. İlişkiler

- Bir `Salon` birden fazla `Hizmet` ve `Berber` taşır.
- Bir `RandevuTaslagi` bir salon, bir berber (veya `null`) ve **bir veya daha fazla** hizmet taşır.
- Bir `Randevu`, onaylandığı anda taslaktaki hizmetlerin ad/fiyat/süre kopyasını saklar; böylece katalog sonradan değişse de geçmiş randevu bozulmaz.
- `Kullanici` ile `Randevu` arasında ayrı bir ilişki tablosu yoktur; randevular cihazdaki `localStorage` içinde tutulur.

## 3. Örnek Kayıt

```json
{
  "id": "t1",
  "salonId": 1,
  "berberId": null,
  "hizmetler": [
    { "id": "kesim", "ad": "Saç Kesimi", "kategori": "Saç", "sureDk": 30, "fiyat": 250 },
    { "id": "sakal", "ad": "Sakal Tıraşı", "kategori": "Sakal", "sureDk": 20, "fiyat": 150 }
  ],
  "tarih": "2026-10-22",
  "saat": "10:00"
}
```

Onay sonrası üretilen randevu:

```json
{
  "kod": "RNV-001-1A2B3C4",
  "salonAd": "Kadıköy Berber Atölyesi",
  "berberAd": "İlk müsait berber",
  "toplamTutar": 400,
  "toplamSure": 50,
  "durum": "onaylandi"
}
```

## 4. Kurallar

- `hizmetler` dizisi en az bir hizmet içermelidir; çok hizmetli randevu aynı taslakta toplanır.
- `berberId` `null` ise onayda "İlk müsait berber" etiketi kullanılır.
- Aynı salon, berber, tarih, saat ve hizmet listesi sepete ikinci kez eklenmez.
- Randevu kodu `RNV-AAA-BBBBBBB` biçimindedir; `AAA` salon kimliği, `BBBBBBB` sistem saatinden üretilen onaltılık son ektir.
- Randevular `localStorage["randevularim"]` altında JSON dizisi olarak saklanır; bozuk kayıt boş listeyle açılır.

## 5. Doğrulama

`bun run check` komutu `svelte-check` ile tip kontrolünü ve `lat check` ile bilgi grafiği bağlarını birlikte çalıştırır.
