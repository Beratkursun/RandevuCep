<script lang="ts">
  // Profil — basit (sahte) giriş; ad ve telefon cihazda tutulur
  import { randevular } from "$lib/randevular.svelte";

  let kullanici = $state(
    typeof localStorage !== "undefined" ? (localStorage.getItem("kullanici") ?? "") : "",
  );
  let telefonKayitli = $state(
    typeof localStorage !== "undefined" ? (localStorage.getItem("telefon") ?? "") : "",
  );
  let ad = $state("");
  let telefon = $state("");

  const gecerli = $derived(
    ad.trim().length > 1 && telefon.replace(/\D/g, "").length >= 10,
  );

  function girisYap(event: SubmitEvent) {
    event.preventDefault();
    kullanici = ad.trim();
    telefonKayitli = telefon.trim();
    localStorage.setItem("kullanici", kullanici);
    localStorage.setItem("telefon", telefonKayitli);
  }

  function cikisYap() {
    kullanici = "";
    telefonKayitli = "";
    localStorage.removeItem("kullanici");
    localStorage.removeItem("telefon");
  }
</script>

<div class="sayfa">
  <p class="berber-link"><a href="/berber/">Berber misiniz? Berber girişi →</a></p>
  {#if kullanici}
    <div class="kart profil">
      <div class="avatar">{kullanici[0].toLocaleUpperCase("tr")}</div>
      <h2>Merhaba, {kullanici}</h2>
      {#if telefonKayitli}
        <p>{telefonKayitli}</p>
      {/if}
      <p>{randevular.liste.length} randevunuz var</p>
    </div>
    <a class="btn" href="/randevularim/">Randevularıma git</a>
    <button class="btn ikincil" onclick={cikisYap}>Çıkış yap</button>
  {:else}
    <div>
      <p class="ust-yazi">Randevularını takip et</p>
      <h1>Giriş yap</h1>
    </div>
    <form class="kart form" onsubmit={girisYap}>
      <label>
        Ad Soyad
        <input bind:value={ad} placeholder="Ayşe Yılmaz" />
      </label>
      <label>
        Telefon
        <input type="tel" bind:value={telefon} placeholder="0555 000 00 00" />
      </label>
      <button class="btn" disabled={!gecerli}>Giriş yap</button>
      <p class="not">Bilgiler yalnızca bu cihazda saklanır; sunucuya gönderilmez.</p>
    </form>
  {/if}
</div>

<style>
  .berber-link { margin: 0; font-size: 13px; }
  .berber-link a { color: var(--renk-ana); font-weight: 600; }
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

  .profil {
    padding: 24px;
    text-align: center;
  }

  .profil h2 {
    margin: 12px 0 4px;
  }

  .profil p {
    margin: 0;
    color: var(--yazi-soluk);
  }

  .avatar {
    width: 72px;
    height: 72px;
    margin: 0 auto;
    border-radius: 50%;
    background: var(--renk-ana);
    color: #fff;
    font-size: 32px;
    font-weight: 700;
    line-height: 72px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
  }

  input {
    padding: 12px;
    border: 1px solid var(--kenar);
    border-radius: 10px;
    background: var(--zemin);
    font-weight: 400;
  }

  .ikincil {
    background: var(--kart);
    color: var(--yazi);
    border: 1px solid var(--kenar);
    margin-top: 8px;
  }

  .not {
    margin: 0;
    color: var(--yazi-soluk);
    font-size: 12px;
    text-align: center;
  }
</style>
