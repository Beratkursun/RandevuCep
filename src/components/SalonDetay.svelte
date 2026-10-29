<script lang="ts">
  // Salon detayı — hizmet, berber ve saat seçimi; sepetli veya doğrudan randevu
  import { onMount } from "svelte";
  import { navigate } from "astro:transitions/client";
  import {
    saatler,
    tl,
    toplamSure as sureHesapla,
    toplamTutar as tutarHesapla,
  } from "$lib/data";
  import { randevuSepeti } from "$lib/randevu-sepeti.svelte";
  import { kapaliSaatler } from "$lib/native";
  import { salonFoto } from "$lib/data";
  import type { RandevuTaslagi, Salon } from "$lib/types";

  let { salon }: { salon: Salon } = $props();

  let seciliHizmetler = $state<string[]>([]);
  let seciliBerber = $state("ilk");
  let tarih = $state("");
  let saat = $state("10:00");
  let mesaj = $state("");
  let kapali = $state<string[]>([]);

  const bugun = new Date().toISOString().slice(0, 10);

  const seciliHizmetObjeleri = $derived.by(() => {
    const secili = salon.hizmetler.filter((h) => seciliHizmetler.includes(h.id));
    const kombin = secili.find((h) => h.ad.includes("+"));
    return kombin ? [kombin] : secili;
  });
  const tutar = $derived(tutarHesapla(seciliHizmetObjeleri));
  const sure = $derived(sureHesapla(seciliHizmetObjeleri));
  const gecerli = $derived(seciliHizmetObjeleri.length > 0 && tarih !== "" && saat !== "");

  async function kapaliYukle() {
    const berber = salon.berberler.find((b) => b.id === seciliBerber);
    if (!berber || !tarih) {
      kapali = [];
      return;
    }
    try {
      kapali = await kapaliSaatler(salon.ad, berber.ad, tarih);
      if (kapali.includes(saat)) {
        saat = saatler.find((s) => !kapali.includes(s)) ?? "";
      }
    } catch {
      kapali = [];
    }
  }

  onMount(() => {
    tarih = bugun;
    kapaliYukle();
  });

  function hizmetSec(id: string) {
    const hizmet = salon.hizmetler.find((h) => h.id === id);
    if (!hizmet) return;
    if (seciliHizmetler.includes(id)) {
      seciliHizmetler = seciliHizmetler.filter((x) => x !== id);
      return;
    }
    if (hizmet.ad.includes("+")) {
      seciliHizmetler = [id];
      return;
    }
    const kombin = salon.hizmetler.find((h) => h.ad.includes("+") && seciliHizmetler.includes(h.id));
    seciliHizmetler = kombin ? [id] : [...seciliHizmetler, id];
  }
  function taslakOlustur(): RandevuTaslagi {
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      salonId: salon.id,
      berberId: seciliBerber === "ilk" ? null : seciliBerber,
      hizmetler: seciliHizmetObjeleri,
      tarih,
      saat,
    };
  }

  function sepeteEkle() {
    if (!gecerli) return;
    const eklendi = randevuSepeti.ekle(taslakOlustur());
    if (eklendi) {
      navigate("/randevu/");
    } else {
      mesaj = "Bu randevu zaten sepetinizde.";
    }
  }

  function hemenAl() {
    if (!gecerli) return;
    randevuSepeti.dogrudanAyarla(taslakOlustur());
    navigate("/onay/");
  }
</script>

<div class="kapak">
  <img src={salonFoto(salon)} alt={`${salon.ad} — ${salon.semt}`} />
  <div class="perde"></div>
  <div class="kapak-icerik">
    <span>{salon.semt}</span>
    <h1>{salon.ad}</h1>
    <p>★ {salon.puan.toFixed(1)} · {salon.hizmetler.length} hizmet · {salon.berberler.length} berber</p>
  </div>
</div>

<div class="sayfa">
  <div class="kart bilgi">
    <p>📍 {salon.adres}</p>
    <p>🕘 {salon.calismaSaatleri}</p>
    <p class="aciklama">{salon.aciklama}</p>
  </div>

  <section>
    <h2>Hizmet seçin</h2>
    <p class="ipucu">Birden fazla hizmet seçebilirsiniz; kombin hizmetler (ör. Saç + Sakal) tek başına seçilir.</p>
    {#each salon.hizmetler as h (h.id)}
      <label class="kart secenek" class:secili={seciliHizmetler.includes(h.id)}>
        <input type="checkbox" checked={seciliHizmetler.includes(h.id)} onchange={() => hizmetSec(h.id)} />
        <span class="hizmet">
          <b>{h.ad}</b>
          <small>{h.kategori} · {h.sureDk} dk</small>
        </span>
        <strong>{tl(h.fiyat)}</strong>
      </label>
    {/each}
  </section>

  <section>
    <h2>Berber seçin</h2>
    <label class="kart secenek" class:secili={seciliBerber === "ilk"}>
      <input type="radio" value="ilk" bind:group={seciliBerber} onchange={() => kapaliYukle()} />
      <span class="hizmet">
        <b>İlk müsait berber</b>
        <small>Salon senin için uygun berberi seçer.</small>
      </span>
    </label>
    {#each salon.berberler as b (b.id)}
      <label class="kart secenek" class:secili={seciliBerber === b.id}>
        <input type="radio" value={b.id} bind:group={seciliBerber} onchange={() => kapaliYukle()} />
        <span class="hizmet">
          <b>{b.ad}</b>
          <small>{b.uzmanlik.join(" · ")}</small>
        </span>
      </label>
    {/each}
  </section>

  <section>
    <h2>Tarih ve saat</h2>
    <div class="tarih-saat">
      <label>
        Tarih
        <input type="date" min={bugun} bind:value={tarih} onchange={() => kapaliYukle()} />
      </label>
      <label>
        Saat
        <select bind:value={saat}>
          {#each saatler as s}
            <option value={s} disabled={kapali.includes(s)}>{s}{kapali.includes(s) ? " · dolu" : ""}</option>
          {/each}
        </select>
      </label>
    </div>
  </section>

  <div class="kart ozet">
    <div>
      <span>Toplam süre</span>
      <b>{sure} dk</b>
    </div>
    <div>
      <span>Toplam tutar</span>
      <b>{tl(tutar)}</b>
    </div>
  </div>

  {#if mesaj}
    <p class="mesaj" aria-live="polite">{mesaj}</p>
  {/if}

  <div class="eylemler">
    <button class="btn ikincil" onclick={sepeteEkle} disabled={!gecerli}>Sepete ekle</button>
    <button class="btn" onclick={hemenAl} disabled={!gecerli}>Hemen randevu al</button>
  </div>

  <div class="sabit-cta">
    <div><span>Toplam</span><b>{tl(tutar)}</b></div>
    <button class="btn" onclick={hemenAl} disabled={!gecerli}>Randevu al</button>
  </div>
</div>

<style>
  .kapak {
    padding: 44px 16px 20px;
    color: #fff;
  }

  .kapak span {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.85;
  }

  .kapak h1 {
    margin: 4px 0 2px;
    font-size: 24px;
  }

  .kapak p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }

  .bilgi {
    padding: 14px;
  }

  .bilgi p {
    margin: 4px 0;
  }

  .aciklama {
    color: var(--yazi-soluk);
    font-size: 14px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  h2 {
    margin: 0;
    font-size: 17px;
  }

  .ipucu {
    margin: -4px 0 2px;
    color: var(--yazi-soluk);
    font-size: 13px;
  }

  .secenek {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px;
    cursor: pointer;
  }

  .secenek.secili {
    border-color: var(--renk-ana);
    box-shadow: 0 0 0 1px var(--renk-ana);
  }

  .secenek input {
    accent-color: var(--renk-ana);
  }

  .hizmet {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .hizmet small {
    color: var(--yazi-soluk);
  }

  .tarih-saat {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .tarih-saat label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
  }

  .tarih-saat input,
  .tarih-saat select {
    padding: 12px;
    border: 1px solid var(--kenar);
    border-radius: 10px;
    background: var(--kart);
    font-weight: 400;
  }

  .ozet {
    display: flex;
    justify-content: space-between;
    padding: 14px;
  }

  .ozet div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ozet span {
    color: var(--yazi-soluk);
    font-size: 13px;
  }

  .ozet b {
    font-size: 18px;
  }

  .mesaj {
    margin: 0;
    color: var(--renk-ana);
    font-weight: 600;
  }

  .eylemler {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ikincil {
    background: var(--kart);
    color: var(--yazi);
    border: 1px solid var(--kenar);
  }
  .kapak {
    position: relative;
    min-height: 220px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
    color: #fff;
  }
  .kapak img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .kapak .perde {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(8, 12, 20, 0.1) 30%, rgba(8, 12, 20, 0.85));
  }
  .kapak-icerik {
    position: relative;
    padding: 64px 16px 18px;
  }
  .kapak-icerik span {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.9;
  }
  .kapak-icerik h1 {
    margin: 4px 0 0;
    font-size: 26px;
    letter-spacing: -0.4px;
  }
  .kapak-icerik p {
    margin: 4px 0 0;
    font-size: 14px;
    opacity: 0.9;
  }
  .sabit-cta {
    position: sticky;
    bottom: calc(64px + env(safe-area-inset-bottom));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--kenar);
    border-radius: 14px;
    background: var(--kart);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
    z-index: 12;
  }
  .sabit-cta span { display: block; font-size: 11px; color: var(--yazi-soluk); }
  .sabit-cta b { font-size: 16px; }
</style>
