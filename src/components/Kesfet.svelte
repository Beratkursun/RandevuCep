<script lang="ts">
  // Ana sayfa (Keşfet) — salon arama, hizmet filtresi ve üç durum
  import { onMount } from "svelte";
  import SalonKart from "$lib/components/SalonKart.svelte";
  import { hizmetKategorileri, salonlar } from "$lib/data";
  import type { HizmetKategorisi } from "$lib/types";

  let arama = $state("");
  let secili = $state<HizmetKategorisi | "Tümü">("Tümü");
  let durum = $state<"yukleniyor" | "hazir" | "hata">("yukleniyor");
  let hata = $state("");

  const filtreler: (HizmetKategorisi | "Tümü")[] = ["Tümü", ...hizmetKategorileri];

  const liste = $derived(
    salonlar.filter((s) => {
      const kategoriUygun =
        secili === "Tümü" || s.hizmetler.some((h) => h.kategori === secili);
      const metin = `${s.ad} ${s.semt} ${s.hizmetler.map((h) => h.ad).join(" ")}`.toLocaleLowerCase(
        "tr",
      );
      return kategoriUygun && metin.includes(arama.toLocaleLowerCase("tr"));
    }),
  );

  function yukle() {
    durum = "yukleniyor";
    hata = "";
    try {
      if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("hata")) {
        throw new Error("Katalog servisine ulaşılamadı.");
      }
      if (!Array.isArray(salonlar)) throw new Error("Katalog okunamadı.");
      durum = "hazir";
    } catch (e) {
      hata = e instanceof Error ? e.message : "Katalog yüklenemedi.";
      durum = "hata";
    }
  }

  onMount(() => {
    const zaman = setTimeout(yukle, 250);
    return () => clearTimeout(zaman);
  });
</script>

<div class="sayfa">
  <div class="giris">
    <p class="ust-yazi">Berber ve kuaför randevusu</p>
    <h1>Yakınındaki salonu seç</h1>
    <input
      class="arama"
      type="search"
      placeholder="Salon, semt veya hizmet ara"
      bind:value={arama}
    />
  </div>

  <div class="cipler">
    {#each filtreler as k}
      <button class:aktif={secili === k} onclick={() => (secili = k)}>{k}</button>
    {/each}
  </div>

  {#if durum === "yukleniyor"}
    <div class="durum" aria-live="polite">Randevu saatleri yükleniyor…</div>
    {#each [1, 2, 3] as _}
      <div class="kart iskelet"></div>
    {/each}
  {:else if durum === "hata"}
    <div class="kart durum hata" aria-live="assertive">
      <b>Katalog yüklenemedi.</b>
      <p>{hata}</p>
      <button class="btn" onclick={yukle}>Tekrar dene</button>
    </div>
  {:else if liste.length === 0}
    <div class="kart durum" aria-live="polite">
      <b>Sonuç bulunamadı.</b>
      <p>Aramanı veya filtreleri değiştir.</p>
      <button
        class="btn"
        onclick={() => {
          arama = "";
          secili = "Tümü";
        }}>Filtreleri temizle</button>
    </div>
  {:else}
    <div class="liste">
    {#each liste as s (s.id)}
      <SalonKart salon={s} />
    {/each}
    </div>
  {/if}
</div>

<style>
  .giris h1 {
    margin: 2px 0 12px;
    font-size: 24px;
    letter-spacing: -0.4px;
  }

  .ust-yazi {
    margin: 0;
    color: var(--renk-ana);
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .arama {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid var(--kenar);
    border-radius: var(--radius);
    background: var(--kart);
  }

  .cipler {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .cipler button {
    flex-shrink: 0;
    padding: 8px 14px;
    border: 1px solid var(--kenar);
    border-radius: 999px;
    background: var(--kart);
    font-size: 13px;
    color: var(--yazi-soluk);
  }

  .cipler button.aktif {
    background: var(--renk-ana);
    border-color: var(--renk-ana);
    color: #fff;
    font-weight: 600;
  }

  .durum {
    padding: 24px 18px;
    text-align: center;
    color: var(--yazi-soluk);
  }

  .durum b {
    color: var(--yazi);
  }

  .hata {
    border-color: var(--renk-vurgu);
  }

  .iskelet {
    height: 210px;
    background: linear-gradient(90deg, var(--kart), var(--zemin), var(--kart));
    background-size: 200% 100%;
    animation: parla 1.2s infinite linear;
  }

  .liste {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .liste {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1200px) {
    .liste {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @keyframes parla {
    to {
      background-position: -200% 0;
    }
  }
</style>
