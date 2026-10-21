<script lang="ts">
  // Randevu sepeti — taslakları listeler, toplamı gösterir ve onaylar
  import { tl } from "$lib/data";
  import { navigate } from "astro:transitions/client";
  import { randevuSepeti } from "$lib/randevu-sepeti.svelte";
  import { randevular } from "$lib/randevular.svelte";
  import RandevuOzet from "./RandevuOzet.svelte";

  let isleniyor = $state(false);
  let hata = $state("");

  async function onayla() {
    if (randevuSepeti.taslaklar.length === 0) return;
    isleniyor = true;
    hata = "";
    try {
      await randevular.onayla(randevuSepeti.taslaklar);
      randevuSepeti.temizle();
      navigate("/randevularim");
    } catch {
      hata = "Randevular onaylanamadı. Lütfen tekrar deneyin.";
    } finally {
      isleniyor = false;
    }
  }
</script>

<div class="sayfa">
  <div>
    <p class="ust-yazi">Onay bekleyen</p>
    <h1>Randevu sepeti</h1>
  </div>

  {#each randevuSepeti.taslaklar as taslak, i (taslak.id)}
    <div class="kart kalem">
      <RandevuOzet {taslak} />
      <button class="sil" onclick={() => randevuSepeti.sil(i)} aria-label="Randevuyu kaldır">
        Kaldır
      </button>
    </div>
  {:else}
    <div class="kart bos">
      <p>Sepetinizde randevu yok.</p>
      <a href="/">Salonlara göz at →</a>
    </div>
  {/each}

  {#if randevuSepeti.taslaklar.length > 0}
    <div class="kart toplam">
      <div>
        <span>{randevuSepeti.adet} randevu</span>
        <small>{randevuSepeti.toplamSure} dk toplam süre</small>
      </div>
      <b>{tl(randevuSepeti.toplamTutar)}</b>
    </div>

    {#if hata}
      <p class="hata" aria-live="assertive">{hata}</p>
    {/if}

    <button class="btn" onclick={onayla} disabled={isleniyor}>
      {isleniyor ? "Randevular oluşturuluyor…" : "Randevuları onayla"}
    </button>
    <p class="not">Onaydan sonra her randevu için RNV kodu üretilir.</p>
  {/if}
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

  .kalem {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sil {
    align-self: flex-end;
    border: 0;
    background: none;
    color: var(--yazi-soluk);
    font-size: 13px;
    text-decoration: underline;
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

  .toplam {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
  }

  .toplam div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .toplam span {
    font-weight: 600;
  }

  .toplam small {
    color: var(--yazi-soluk);
  }

  .toplam b {
    font-size: 20px;
  }

  .hata {
    margin: 0;
    color: #b91c1c;
    font-weight: 600;
  }

  .not {
    margin: -8px 0 0;
    color: var(--yazi-soluk);
    font-size: 12px;
    text-align: center;
  }
</style>
