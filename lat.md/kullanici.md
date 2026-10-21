# Kullanıcı Oturumu

Profil ekranı gerçek kimlik doğrulama yapmaz: ad ve e-posta yalnızca tarayıcıda doğrulanır, sunucuya istek gitmez ve yalnızca ad `localStorage["kullanici"]` içine yazılır.

## Doğrulama

Giriş düğmesi, ad iki karakterden uzun ve e-posta `@` içerdiğinde etkinleşir; şifre alanı yoktur, e-posta hiçbir yere kaydedilmez.

Kaynak: [[src/components/Profil.svelte]].

## Kalıcılık ve Çıkış

Ad açılışta localStorage'dan okunur, çıkışta silinir. Profil kartı bilet sayısını `biletlerim.liste.length` üzerinden gösterir, ayrı bir kullanıcı-bilet ilişkisi tutulmaz.

Kaynak: [[src/lib/biletler.svelte.ts#Biletlerim]].
