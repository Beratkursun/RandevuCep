# Kullanıcı Oturumu

Profil ekranı gerçek kimlik doğrulama yapmaz: ad ve telefon yalnızca tarayıcıda doğrulanır, sunucuya istek gitmez ve iki değer de `localStorage` içine yazılır.

## Doğrulama

Giriş düğmesi, ad iki karakterden uzun ve telefon en az 10 rakam içerdiğinde etkinleşir; şifre alanı yoktur ve e-posta toplanmaz.

Kaynak: [[src/components/Profil.svelte]].

## Kalıcılık ve Çıkış

Ad `localStorage["kullanici"]`, telefon `localStorage["telefon"]` altında tutulur; çıkışta ikisi de silinir. Profil kartı randevu sayısını `randevular.liste.length` üzerinden gösterir, ayrı bir kullanıcı-randevu ilişkisi tutulmaz.

Kaynak: [[src/lib/randevular.svelte.ts#Randevular]].
