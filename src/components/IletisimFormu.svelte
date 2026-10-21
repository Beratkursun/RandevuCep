<script lang="ts">
  import { formMetinleri, type Dil } from "$lib/icerik";

  let { lang = "tr" }: { lang: Dil } = $props();

  let ad = $state("");
  let eposta = $state("");
  let konu = $state("");
  let mesaj = $state("");
  let gonderildi = $state(false);

  const m = $derived(formMetinleri[lang]);
  const gecerli = $derived(
    ad.trim().length > 1 &&
      eposta.includes("@") &&
      konu.trim().length > 1 &&
      mesaj.trim().length > 5,
  );

  function gonder(event: SubmitEvent) {
    event.preventDefault();
    if (!gecerli) return;
    gonderildi = true;
    ad = "";
    eposta = "";
    konu = "";
    mesaj = "";
  }
</script>

<form class="form" onsubmit={gonder}>
  <label>
    {m.ad}
    <input bind:value={ad} placeholder={m.ad} autocomplete="name" />
  </label>
  <label>
    {m.eposta}
    <input type="email" bind:value={eposta} placeholder="ornek@eposta.com" autocomplete="email" />
  </label>
  <label>
    {m.konu}
    <input bind:value={konu} placeholder={m.konu} />
  </label>
  <label>
    {m.mesaj}
    <textarea bind:value={mesaj} placeholder={m.mesaj} rows="5"></textarea>
  </label>
  <button class="btn" disabled={!gecerli}>{m.gonder}</button>
  {#if gonderildi}
    <p class="basari" aria-live="polite">{m.basarili}</p>
  {/if}
</form>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 18px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
  }

  input,
  textarea {
    padding: 12px;
    border: 1px solid var(--kenar);
    border-radius: 10px;
    background: var(--zemin);
    font-weight: 400;
    resize: vertical;
  }

  .basari {
    margin: 0;
    color: var(--renk-ana);
    font-weight: 600;
  }
</style>
