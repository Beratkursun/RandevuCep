<script lang="ts">
  interface Props {
    mesaj?: string;
    satir?: number;
  }

  let { mesaj = "Yükleniyor…", satir = 3 }: Props = $props();
</script>

<div class="durum" aria-live="polite" aria-busy="true">
  <p>{mesaj}</p>
  <div class="iskeletler">
    {#each Array.from({ length: satir }) as _, i (i)}
      <div class="iskelet"></div>
    {/each}
  </div>
</div>
