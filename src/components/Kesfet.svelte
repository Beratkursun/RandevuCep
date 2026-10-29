<script lang="ts">
  // Ana sayfa (Keşfet) — salon arama, hizmet filtresi ve üç durum
  import { onMount } from "svelte";
  import SalonKart from "$lib/components/SalonKart.svelte";
  import { hizmetKategorileri, salonlar } from "$lib/data";
  import type { HizmetKategorisi } from "$lib/types";
    import BosDurum from "./ui/BosDurum.svelte";
  import HataDurumu from "./ui/HataDurumu.svelte";

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
    <div class="liste" aria-busy="true">
      {#each [1, 2, 3] as i (i)}
        <div class="kart iskelet">
          <div class="iskelet-gorsel"></div>
          <div class="iskelet-satir genis"></div>
          <div class="iskelet-satir"></div>
        </div>
      {/each}
    </div>
  {:else if durum === "hata"}
    <HataDurumu baslik="Katalog yüklenemedi." mesaj={hata} onTekrar={yukle} />
  {:else if liste.length === 0}
    <BosDurum
      baslik="Sonuç bulunamadı."
      mesaj="Aramanı veya filtreleri değiştir."
      eylemEtiketi="Filtreleri temizle"
      onEylem={() => {
        arama = "";
        secili = "Tümü";
      }}
    />
  {:else}
    <p class="sonuc">{liste.length} salon</p>
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
  .sonuc {
    margin: 0;
    font-size: 13px;
    color: var(--yazi-soluk);
  }

  .iskelet {
    padding: 0 0 14px;
    overflow: hidden;
  }

  .iskelet-gorsel {
    height: 150px;
    background: linear-gradient(90deg, #e9edf2 25%, #f6f8fa 37%, #e9edf2 63%);
    background-size: 400% 100%;
    animation: parilti 1.3s ease infinite;
  }

  .iskelet-satir {
    height: 12px;
    margin: 12px 14px 0;
    border-radius: 6px;
    background: #eef1f5;
    width: 55%;
  }

  .iskelet-satir.genis {
    width: 75%;
    height: 16px;
  }

  @keyframes parilti {
    0% { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }
</style>
