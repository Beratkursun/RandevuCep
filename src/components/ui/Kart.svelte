<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    href?: string;
    sinif?: string;
    baslik?: string;
    altBaslik?: string;
    children?: Snippet;
  }

  let { href, sinif = "", baslik, altBaslik, children }: Props = $props();
</script>

{#if href}
  <a {href} class="kart {sinif}">
    {#if baslik}<strong>{baslik}</strong>{/if}
    {#if altBaslik}<small>{altBaslik}</small>{/if}
    {@render children?.()}
  </a>
{:else}
  <div class="kart {sinif}">
    {#if baslik}<strong>{baslik}</strong>{/if}
    {#if altBaslik}<small>{altBaslik}</small>{/if}
    {@render children?.()}
  </div>
{/if}
