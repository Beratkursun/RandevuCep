# Gece/Gündüz Teması

Tema kök elemanın `data-tema` özniteliğiyle uygulanır ve `localStorage["tema"]` içinde saklanır; renk değişkenleri `src/styles/app.css` içindeki `:root[data-tema="gece"]` bloğunda tanımlıdır.

## İlk Boyama

`Layout.astro` içindeki satır içi script, sayfa boyanmadan önce `localStorage["tema"]` değerini, yoksa `prefers-color-scheme` tercihini uygular; bu yüzden gece modunda açılışta beyaz parlama olmaz.

Kaynak: [[src/layouts/Layout.astro]].

## Değiştirme

Başlıktaki düğme `tema.degistir()` çağırır: mod gece ile gündüz arasında döner, `documentElement.dataset.tema` ve localStorage birlikte güncellenir.

Store başlangıç değerini okurken de aynı özniteliğe bakar, böylece ilk boyamada uygulanan tema ile state çelişmez.

Kaynak: [[src/lib/tema.svelte.ts#TemaYonetici#degistir]], [[src/components/AppHeader.svelte]].

## Stil Kaynağı

Canlı stil dosyası `src/styles/app.css`'tir ve `Layout.astro` yalnızca onu import eder. `src/app.css` aynı değişkenleri tanımlayan eski bir kopyadır ve hiçbir yerden import edilmez; stil değişikliği orada yapılırsa ekrana yansımaz.
