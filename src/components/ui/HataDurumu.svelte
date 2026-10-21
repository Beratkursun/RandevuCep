<script lang="ts">
  interface Props {
    baslik?: string;
    mesaj?: string;
    tekrarEtiketi?: string;
    onTekrar?: () => void;
  }

  let {
    baslik = "Bir hata oluştu",
    mesaj = "Lütfen tekrar deneyin.",
    tekrarEtiketi = "Tekrar dene",
    onTekrar,
  }: Props = $props();
</script>

<div class="kart durum hata" aria-live="assertive">
  <b>{baslik}</b>
  <p>{mesaj}</p>
  {#if onTekrar}
    <button class="btn" onclick={onTekrar}>{tekrarEtiketi}</button>
  {/if}
</div>
