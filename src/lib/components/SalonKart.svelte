<script lang="ts">
  // Yeniden kullanılabilir salon kartı — dışarıdan "salon" prop'u alır
  import { baslangicFiyat, tl } from "$lib/data";
  import type { Salon } from "$lib/types";
  import Kart from "../../components/ui/Kart.svelte";

  let { salon }: { salon: Salon } = $props();
</script>

<Kart href={`/salon/${salon.id}`} sinif="salon">
  <div class="gorsel" style:background={salon.renk}>
    <span>{salon.semt}</span>
    <b>★ {salon.puan.toFixed(1)}</b>
  </div>
  <div class="bilgi">
    <h3>{salon.ad}</h3>
    <p>{salon.hizmetler.length} hizmet · {salon.berberler.length} berber</p>
    <p class="adres">{salon.adres}</p>
    <strong>{tl(baslangicFiyat(salon))}'den başlayan fiyatlarla</strong>
  </div>
</Kart>

<style>
  :global(.salon) {
    display: block;
    overflow: hidden;
  }

  .gorsel {
    height: 118px;
    padding: 12px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    color: #fff;
  }

  .gorsel span {
    padding: 4px 10px;
    border-radius: 999px;
    background: #ffffffdd;
    color: #0f172a;
    font-size: 12px;
    font-weight: 600;
  }

  .gorsel b {
    padding: 4px 8px;
    border-radius: 999px;
    background: #0f172acc;
    font-size: 12px;
  }

  .bilgi {
    padding: 12px 14px 14px;
  }

  h3 {
    margin: 0 0 6px;
    font-size: 17px;
  }

  p {
    margin: 2px 0;
    font-size: 14px;
    color: var(--yazi-soluk);
  }

  .adres {
    font-size: 13px;
  }

  strong {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    color: var(--renk-ana);
  }
</style>
