<script lang="ts">
  // Yeniden kullanılabilir salon kartı — kapak fotoğrafı, semt ve puan rozetleri
  import { baslangicFiyat, salonFoto, tl } from "$lib/data";
  import type { Salon } from "$lib/types";
  import Kart from "../../components/ui/Kart.svelte";

  let { salon }: { salon: Salon } = $props();
</script>

<Kart href={`/salon/${salon.id}/`} sinif="salon">
  <div class="gorsel">
    <img src={salonFoto(salon)} alt={`${salon.ad} — ${salon.semt}`} loading="lazy" />
    <div class="perde"></div>
    <span class="semt">{salon.semt}</span>
    <b class="puan">★ {salon.puan.toFixed(1)}</b>
  </div>
  <div class="bilgi">
    <h3>{salon.ad}</h3>
    <p class="meta">{salon.hizmetler.length} hizmet · {salon.berberler.length} berber</p>
    <p class="adres">{salon.adres}</p>
    <div class="alt">
      <strong>{tl(baslangicFiyat(salon))}'den başlayan</strong>
      <span class="cta">Randevu al →</span>
    </div>
  </div>
</Kart>

<style>
  :global(.salon) {
    display: block;
    overflow: hidden;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease;
  }

  :global(.salon:hover) {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.14);
  }

  .gorsel {
    position: relative;
    height: 150px;
    overflow: hidden;
    background: var(--zemin);
  }

  .gorsel img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }

  :global(.salon:hover) .gorsel img {
    transform: scale(1.05);
  }

  .perde {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(8, 12, 20, 0.05) 40%, rgba(8, 12, 20, 0.55));
  }

  .semt,
  .puan {
    position: absolute;
    top: 10px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(6px);
  }

  .semt {
    left: 10px;
    background: rgba(255, 255, 255, 0.92);
    color: #0f172a;
  }

  .puan {
    right: 10px;
    background: rgba(15, 23, 42, 0.78);
    color: #fff;
  }

  .bilgi {
    padding: 12px 14px 14px;
  }

  h3 {
    margin: 0 0 4px;
    font-size: 17px;
    letter-spacing: -0.2px;
  }

  p {
    margin: 2px 0;
    font-size: 13px;
    color: var(--yazi-soluk);
  }

  .adres {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .alt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 10px;
  }

  strong {
    font-size: 14px;
    color: var(--renk-ana);
  }

  .cta {
    font-size: 13px;
    font-weight: 700;
    color: var(--yazi);
    opacity: 0;
    transform: translateX(-4px);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  :global(.salon:hover) .cta {
    opacity: 1;
    transform: translateX(0);
  }
</style>
