<script lang="ts">
  // Randevularım — onaylanan randevuları RNV kodu ve detaylarıyla listeler
  import { tarihYaz, tl } from "$lib/data";
  import { randevular } from "$lib/randevular.svelte";
</script>

<div class="sayfa">
  <div>
    <p class="ust-yazi">Onaylanan</p>
    <h1>Randevularım</h1>
  </div>

  {#each randevular.liste as r (r.id)}
    <div class="kart randevu">
      <div class="ust">
        <div>
          <strong>{r.salonAd}</strong>
          <p>{tarihYaz(r.tarih, r.saat)}</p>
        </div>
        <span class="durum">Onaylandı</span>
      </div>

      <div class="detay">
        <p><b>Berber:</b> {r.berberAd}</p>
        <p><b>Hizmet:</b> {r.hizmetler.map((h) => h.ad).join(" + ")}</p>
        <p><b>Süre:</b> {r.toplamSure} dk</p>
      </div>

      <div class="kod">
        <span>Randevu kodu</span>
        <code>{r.kod}</code>
      </div>

      <div class="alt">
        <span>Toplam</span>
        <b>{tl(r.toplamTutar)}</b>
      </div>
    </div>
  {:else}
    <div class="kart bos">
      <p>Henüz randevunuz yok.</p>
      <a href="/">Bir salon seçin →</a>
    </div>
  {/each}
</div>

<style>
  h1 {
    margin: 2px 0 0;
    font-size: 22px;
  }

  .ust-yazi {
    margin: 0;
    color: var(--renk-ana);
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .randevu {
    overflow: hidden;
  }

  .ust {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 14px;
    border-left: 6px solid var(--renk-ana);
  }

  .ust strong {
    font-size: 16px;
  }

  .ust p {
    margin: 3px 0 0;
    color: var(--yazi-soluk);
    font-size: 13px;
  }

  .durum {
    align-self: flex-start;
    padding: 3px 9px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--renk-ana) 14%, transparent);
    color: var(--renk-ana);
    font-size: 12px;
    font-weight: 700;
  }

  .detay {
    padding: 10px 14px 0;
  }

  .detay p {
    margin: 3px 0;
    color: var(--yazi-soluk);
    font-size: 13px;
  }

  .detay b {
    color: var(--yazi);
  }

  .kod {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    padding: 12px 14px;
    border-top: 2px dashed var(--kenar);
    font-size: 13px;
    color: var(--yazi-soluk);
  }

  code {
    font-size: 16px;
    font-weight: 700;
    color: var(--yazi);
    letter-spacing: 1px;
  }

  .alt {
    display: flex;
    justify-content: space-between;
    padding: 0 14px 14px;
    font-size: 14px;
  }

  .alt span {
    color: var(--yazi-soluk);
  }

  .bos {
    padding: 32px 16px;
    text-align: center;
    color: var(--yazi-soluk);
  }

  .bos a {
    color: var(--renk-ana);
    font-weight: 600;
  }
</style>
