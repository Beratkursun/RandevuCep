---
lat:
  require-code-mention: true
---

# Testler

Davranış spec'leri; her yaprak bölüm `tests/` altındaki tek bir Vitest testine bağlıdır ve `bun run test` ile doğrulanır.

## Sepet

Sepet store'unun birleştirme, türetme ve silme davranışı.

### Aynı kategoride adet birleşir

Aynı etkinlik ve aynı bilet kategorisi ikinci kez eklendiğinde sepet yeni satır açmamalı, mevcut kalemin adedini artırmalıdır; aksi hâlde kullanıcı aynı bileti iki ayrı satırda görür.

### Farklı kategoriler ayrı satır olur

Aynı etkinliğin farklı bilet kategorileri (örneğin Yan Tribün ve Kale Arkası) birleşmemeli, ayrı kalem olarak durmalıdır.

### Toplam ve adet türetilir

`adet` bilet sayılarının toplamını, `toplam` ise adet × kategori fiyatı toplamını vermelidir; ödeme ekranındaki tutar doğrudan bu değerden okunur.

### Kalem silinir ve sepet temizlenir

`sil` yalnızca verilen indeksteki kalemi kaldırmalı, `temizle` tüm kalemleri boşaltıp toplamı sıfıra indirmelidir; ödeme sonrası sepetin boş kalması buna bağlıdır.

## Biletler

Satın alma akışının tarayıcı tarafındaki sözleşmesi; Rust komutu bu testlerde çalışmaz.

### Satın alma bilet kodu üretir ve kalıcılaştırır

Tauri olmayan ortamda `satinAl` her kalem için `WEB-` ile başlayan bir kod üretmeli, bileti listeye yazmalı ve `localStorage["biletlerim"]` altına kaydetmelidir; sayfa yenilendiğinde biletlerin geri gelmesi buna bağlıdır.

## Veri

Katalog erişimi ve biçimlendirme yardımcıları.

### Etkinlik kimlikle bulunur

`etkinlikBul` var olan kimlikte ilgili kaydı, olmayan kimlikte `undefined` döndürmelidir; detay sayfası ve sepet kalemleri bu fonksiyona güvenir.

### Fiyat ve tarih tr-TR biçimlenir

`tl` tutarı Türk lirası olarak binlik ayraçla, `tarihYaz` ise Türkçe ay adı ve iki haneli saatle yazmalıdır; tüm ekranlar bu iki yardımcıyı kullandığı için biçim tek yerden korunur.
