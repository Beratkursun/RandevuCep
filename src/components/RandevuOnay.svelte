<script lang="ts">
  // Doğrudan randevu onayı — sepeti atlayan tek taslak akışı
  import { tl, toplamTutar } from "$lib/data";
  import { navigate } from "astro:transitions/client";
  import { randevuSepeti } from "$lib/randevu-sepeti.svelte";
  import { randevular } from "$lib/randevular.svelte";
  import RandevuOzet from "./RandevuOzet.svelte";

  const taslak = $derived(randevuSepeti.dogrudan);
  let isleniyor = $state(false);
  let hata = $state("");

  async function onayla() {
    if (!taslak) return;
    isleniyor = true;
    hata = "";
    try {
      await randevular.onayla([taslak]);
      randevuSepeti.dogrudanTemizle();
      navigate("/randevularim");
    } catch {
      hata = "Randevu onaylanamadı. Lütfen tekrar deneyin.";
    } finally {
      isleniyor = false;
    }
  }

  function sepeteEkle() {
    if (!taslak) return;
    randevuSepeti.ekle(taslak);
    randevuSepeti.dogrudanTemizle();
    navigate("/randevu");
  }
</script>

<div class="sayfa">
  <div>
    <p class="ust-yazi">Son adım</p>
    <h1>Randevuyu onayla</h1>
  </div>

  {#if taslak}
    <div class="kart icerik">
      <RandevuOzet {taslak} />
      <div class="toplam">
        <span>Toplam</span>
        <b>{tl(toplamTutar(taslak.hizmetler))}</b>
      </div>
    </div>

    {#if hata}
      <p class="hata" aria-live="assertive">{hata}</p>
    {/if}

    <button class="btn" onclick={onayla} disabled={isleniyor}>
      {isleniyor ? "Randevu oluşturuluyor…" : "Randevuyu onayla"}
    </button>
    <button class="btn ikincil" onclick={sepeteEkle} disabled={isleniyor}>
      Sepete ekle ve düzenle
    </button>
    <p class="not">Onaydan sonra RNV kodu üretilir ve Randevularım sayfasına eklenir.</p>
  {:else}
    <div class="kart bos">
      <p>Onaylanacak randevu bulunamadı.</p>
      <a href="/">Salonlara göz at →</a>
    </div>
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

  .icerik {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .toplam {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px dashed var(--kenar);
  }

  .toplam b {
    font-size: 20px;
  }

  .hata {
    margin: 0;
    color: #b91c1c;
    font-weight: 600;
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

  .ikincil {
    background: var(--kart);
    color: var(--yazi);
    border: 1px solid var(--kenar);
  }

  .not {
    margin: -8px 0 0;
    color: var(--yazi-soluk);
    font-size: 12px;
    text-align: center;
  }
</style>
