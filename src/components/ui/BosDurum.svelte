<script lang="ts">
  interface Props {
    baslik?: string;
    mesaj?: string;
    eylemEtiketi?: string;
    eylemHref?: string;
    onEylem?: () => void;
  }

  let {
    baslik = "Kayıt bulunamadı",
    mesaj = "Aramanı veya filtreleri değiştirip tekrar deneyin.",
    eylemEtiketi,
    eylemHref,
    onEylem,
  }: Props = $props();
</script>

<div class="kart durum" aria-live="polite">
  <b>{baslik}</b>
  <p>{mesaj}</p>
  {#if eylemEtiketi}
    {#if eylemHref}
      <a class="btn" href={eylemHref}>{eylemEtiketi}</a>
    {:else if onEylem}
      <button class="btn" onclick={onEylem}>{eylemEtiketi}</button>
    {/if}
  {/if}
</div>
