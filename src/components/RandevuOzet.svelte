<script lang="ts">
  // Randevu taslağının okunabilir özeti; sepet ve onay ekranlarında ortak
  import {
    berberBul,
    salonBul,
    tarihYaz,
    tl,
    toplamSure,
    toplamTutar,
  } from "$lib/data";
  import type { RandevuTaslagi } from "$lib/types";

  let { taslak }: { taslak: RandevuTaslagi } = $props();

  const salon = $derived(salonBul(taslak.salonId));
  const berber = $derived(salon ? berberBul(salon, taslak.berberId) : undefined);
  const tutar = $derived(toplamTutar(taslak.hizmetler));
  const sure = $derived(toplamSure(taslak.hizmetler));
</script>

<div class="ozet">
  <div class="ust">
    <b>{salon?.ad ?? "Salon"}</b>
    <span>{salon?.semt ?? ""}</span>
  </div>
  <p class="berber">{berber?.ad ?? "İlk müsait berber"}</p>

  <ul>
    {#each taslak.hizmetler as h (h.id)}
      <li>
        <span>{h.ad} · {h.sureDk} dk</span>
        <b>{tl(h.fiyat)}</b>
      </li>
    {/each}
  </ul>

  <div class="alt">
    <span>{tarihYaz(taslak.tarih, taslak.saat)} · {sure} dk</span>
    <b>{tl(tutar)}</b>
  </div>
</div>

<style>
  .ozet {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ust {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
  }

  .ust b {
    font-size: 16px;
  }

  .ust span {
    color: var(--yazi-soluk);
    font-size: 13px;
  }

  .berber {
    margin: 0;
    color: var(--yazi-soluk);
    font-size: 13px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  li {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 14px;
  }

  li span {
    color: var(--yazi-soluk);
  }

  .alt {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding-top: 8px;
    border-top: 1px dashed var(--kenar);
    font-size: 14px;
  }

  .alt span {
    color: var(--yazi-soluk);
  }
</style>
