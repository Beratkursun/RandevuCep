<script lang="ts">
  import { onMount } from "svelte";
  import {
    durumEtiketi,
    type BerberOturumu,
    type YonetimRandevusu,
    type YonetimSalonu,
  } from "$lib/yonetim";
  import {
    berberCikis,
    berberDurumGuncelle,
    berberGiris,
    berberOturumu,
    berberRandevulari,
    yonetimSalonlari,
  } from "$lib/native";

  let salonlar = $state<YonetimSalonu[]>([]);
  let seciliSalon = $state(0);
  let ad = $state("");
  let pin = $state("");
  let oturum = $state<BerberOturumu | null>(null);
  let randevular = $state<YonetimRandevusu[]>([]);
  let yukleniyor = $state(true);
  let isleniyor = $state(false);
  let hata = $state("");

  function hataMetni(e: unknown): string {
    return e instanceof Error ? e.message : String(e);
  }

  async function randevulariGetir(berberId: number) {
    randevular = await berberRandevulari(berberId);
  }

  async function giris(event: SubmitEvent) {
    event.preventDefault();
    isleniyor = true;
    hata = "";
    try {
      oturum = await berberGiris(seciliSalon, ad, pin);
      await randevulariGetir(oturum.id);
      pin = "";
    } catch (e) {
      hata = hataMetni(e);
    } finally {
      isleniyor = false;
    }
  }

  async function durumDegistir(id: number, durum: "onaylandi" | "iptal") {
    if (!oturum) return;
    isleniyor = true;
    hata = "";
    try {
      await berberDurumGuncelle(oturum.id, id, durum);
      await randevulariGetir(oturum.id);
    } catch (e) {
      hata = hataMetni(e);
    } finally {
      isleniyor = false;
    }
  }

  function cikis() {
    berberCikis();
    oturum = null;
    randevular = [];
    ad = "";
    pin = "";
    hata = "";
  }

  onMount(async () => {
    try {
      salonlar = await yonetimSalonlari();
      if (salonlar.length > 0) seciliSalon = salonlar[0].id;
      oturum = berberOturumu();
      if (oturum) await randevulariGetir(oturum.id);
    } catch (e) {
      hata = hataMetni(e);
    } finally {
      yukleniyor = false;
    }
  });
</script>

<div class="sayfa">
  <h1>Berber Girişi</h1>

  {#if hata}<p class="uyari">{hata}</p>{/if}

  {#if yukleniyor}
    <p class="bos">Yükleniyor…</p>
  {:else if !oturum}
    <form class="kart giris" onsubmit={giris}>
      <p class="aciklama">Salonunuzu seçin, adınızı ve 4 haneli PIN'inizi girin. PIN'i salon yöneticisi verir.</p>
      <label>
        Salon
        <select bind:value={seciliSalon} required>
          {#each salonlar as s (s.id)}<option value={s.id}>{s.ad} — {s.sehir}</option>{/each}
        </select>
      </label>
      <label>
        Ad Soyad
        <input bind:value={ad} placeholder="Emre Usta" required />
      </label>
      <label>
        PIN
        <input bind:value={pin} inputmode="numeric" maxlength="4" placeholder="1234" required />
      </label>
      <button class="btn" disabled={isleniyor || salonlar.length === 0}>
        {isleniyor ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
      {#if salonlar.length === 0}<p class="bos">Henüz salon ve berber kaydı yok.</p>{/if}
    </form>
  {:else}
    <div class="oturum kart">
      <div>
        <strong>{oturum.ad}</strong>
        <p>{oturum.salonAd}</p>
      </div>
      <button class="btn ikincil" onclick={cikis}>Çıkış</button>
    </div>

    <h2>Randevularım</h2>
    {#if randevular.length === 0}
      <p class="bos">Size atanmış randevu yok. "İlk müsait berber" seçilen randevular yönetici panelinde görünür.</p>
    {:else}
      {#each randevular as r (r.id)}
        <div class="kart randevu">
          <div class="ust">
            <strong>{r.hizmet}</strong>
            <span class="rozet {r.durum}">{durumEtiketi(r.durum)}</span>
          </div>
          <p>{r.tarih} · {r.saat}</p>
          <p class="kod">{r.kod}</p>
          <div class="islem">
            <button onclick={() => durumDegistir(r.id, "onaylandi")} disabled={isleniyor || r.durum === "onaylandi"}>Onayla</button>
            <button onclick={() => durumDegistir(r.id, "iptal")} disabled={isleniyor || r.durum === "iptal"}>İptal et</button>
          </div>
        </div>
      {/each}
    {/if}
  {/if}
</div>

<style>
  h1 { margin: 0; font-size: 24px; }
  h2 { margin: 8px 0 0; font-size: 18px; }
  .giris { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .aciklama { margin: 0; color: var(--yazi-soluk); font-size: 14px; }
  label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 600; }
  input, select { padding: 10px; border: 1px solid var(--kenar); border-radius: 10px; background: var(--zemin); font-weight: 400; }
  .oturum { padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .oturum p { margin: 2px 0 0; color: var(--yazi-soluk); font-size: 14px; }
  .randevu { padding: 14px; display: flex; flex-direction: column; gap: 4px; }
  .randevu .ust { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .randevu p { margin: 0; font-size: 14px; color: var(--yazi-soluk); }
  .kod { font-family: monospace; }
  .islem { display: flex; gap: 8px; margin-top: 6px; }
  .islem button { border: 1px solid var(--kenar); background: var(--zemin); border-radius: 8px; padding: 6px 12px; font-size: 13px; }
  .rozet { padding: 2px 8px; border-radius: 999px; font-size: 12px; }
  .rozet.bekliyor { background: #fef3c7; color: #92400e; }
  .rozet.onaylandi { background: #d1fae5; color: #065f46; }
  .rozet.iptal { background: #fee2e2; color: #991b1b; }
  .bos { color: var(--yazi-soluk); font-size: 14px; }
  .uyari { margin: 0; padding: 10px 12px; border-radius: 10px; background: #fee2e2; color: #991b1b; font-size: 14px; }
</style>
