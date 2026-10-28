<script lang="ts">
  import { onMount } from "svelte";
  import {
    durumEtiketi,
    ozetSayilari,
    type YonetimDurumu,
    type YonetimRandevusu,
    type YonetimSalonu,
  } from "$lib/yonetim";
  import {
    randevuKoduAl,
    yonetimBerberEkle,
    yonetimDurumGuncelle,
    yonetimHizmetEkle,
    yonetimRandevuKaydet,
    yonetimRandevulari,
    yonetimSalonEkle,
    yonetimSalonlari,
  } from "$lib/native";

  let randevular = $state<YonetimRandevusu[]>([]);
  let salonlar = $state<YonetimSalonu[]>([]);
  let yukleniyor = $state(true);
  let mesaj = $state("");
  let hata = $state("");

  let salonAd = $state("");
  let salonSehir = $state("");
  let salonAdres = $state("");
  let seciliSalon = $state(0);
  let hizmetAd = $state("");
  let hizmetSure = $state(30);
  let hizmetFiyat = $state(250);
  let berberAd = $state("");
  let isleniyor = $state(false);

  const ozet = $derived(ozetSayilari(randevular));

  async function yukle() {
    yukleniyor = true;
    try {
      salonlar = await yonetimSalonlari();
      randevular = await yonetimRandevulari();
      if (!seciliSalon && salonlar.length > 0) seciliSalon = salonlar[0].id;
    } catch (e) {
      hata = String(e);
    } finally {
      yukleniyor = false;
    }
  }

  async function calistir(is: () => Promise<void>, basari: string) {
    isleniyor = true;
    hata = "";
    mesaj = "";
    try {
      await is();
      mesaj = basari;
      await yukle();
    } catch (e) {
      hata = String(e);
    } finally {
      isleniyor = false;
    }
  }

  async function salonEkle(event: SubmitEvent) {
    event.preventDefault();
    if (!salonAd.trim() || !salonSehir.trim()) return;
    await calistir(async () => {
      await yonetimSalonEkle(salonAd, salonSehir, salonAdres);
      salonAd = "";
      salonSehir = "";
      salonAdres = "";
    }, "Salon eklendi.");
  }

  async function hizmetEkle(event: SubmitEvent) {
    event.preventDefault();
    if (!seciliSalon || !hizmetAd.trim()) return;
    await calistir(async () => {
      await yonetimHizmetEkle(seciliSalon, hizmetAd, hizmetSure, hizmetFiyat);
      hizmetAd = "";
    }, "Hizmet eklendi.");
  }

  async function berberEkle(event: SubmitEvent) {
    event.preventDefault();
    if (!seciliSalon || !berberAd.trim()) return;
    await calistir(async () => {
      await yonetimBerberEkle(seciliSalon, berberAd);
      berberAd = "";
    }, "Berber eklendi.");
  }

  async function ornekRandevu() {
    if (!seciliSalon) return;
    await calistir(async () => {
      const kod = await randevuKoduAl(seciliSalon);
      const bugun = new Date().toISOString().slice(0, 10);
      await yonetimRandevuKaydet({
        kod,
        salonId: seciliSalon,
        berberId: null,
        hizmet: hizmetAd.trim() || "Saç Kesimi",
        tarih: bugun,
        saat: "14:00",
        tutar: hizmetFiyat,
      });
    }, "Örnek randevu eklendi.");
  }

  async function durumDegistir(id: number, durum: YonetimDurumu) {
    await calistir(async () => {
      await yonetimDurumGuncelle(id, durum);
    }, `Randevu ${durumEtiketi(durum).toLowerCase()}.`);
  }

  onMount(yukle);
</script>

<div class="sayfa">
  <header class="ust">
    <div>
      <h1>Yönetim</h1>
      <p>Randevuları onaylayın, salon ve hizmet kayıtlarını yönetin.</p>
    </div>
    <button class="btn ikincil" onclick={yukle} disabled={yukleniyor}>Yenile</button>
  </header>

  {#if hata}<p class="uyari hata">{hata}</p>{/if}
  {#if mesaj}<p class="uyari basari">{mesaj}</p>{/if}

  <section class="ozet">
    <div class="kart"><span>Bekleyen</span><b>{ozet.bekliyor}</b></div>
    <div class="kart"><span>Onaylı</span><b>{ozet.onaylandi}</b></div>
    <div class="kart"><span>İptal</span><b>{ozet.iptal}</b></div>
    <div class="kart"><span>Ciro</span><b>{ozet.ciro.toLocaleString("tr-TR")} ₺</b></div>
  </section>

  <section class="kart blok">
    <h2>Randevular</h2>
    {#if yukleniyor}
      <p class="bos">Yükleniyor…</p>
    {:else if randevular.length === 0}
      <p class="bos">Kayıtlı randevu yok. Aşağıdan örnek randevu ekleyebilirsiniz.</p>
    {:else}
      <div class="tablo-kap">
        <table>
          <thead>
            <tr><th>Kod</th><th>Salon</th><th>Berber</th><th>Hizmet</th><th>Tarih</th><th>Tutar</th><th>Durum</th><th></th></tr>
          </thead>
          <tbody>
            {#each randevular as r (r.id)}
              <tr>
                <td><code>{r.kod}</code></td>
                <td>{r.salonAd}</td>
                <td>{r.berberAd}</td>
                <td>{r.hizmet}</td>
                <td>{r.tarih} · {r.saat}</td>
                <td>{r.tutar.toLocaleString("tr-TR")} ₺</td>
                <td><span class="rozet {r.durum}">{durumEtiketi(r.durum)}</span></td>
                <td class="islem">
                  <button onclick={() => durumDegistir(r.id, "onaylandi")} disabled={isleniyor || r.durum === "onaylandi"}>Onayla</button>
                  <button onclick={() => durumDegistir(r.id, "iptal")} disabled={isleniyor || r.durum === "iptal"}>İptal</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>

  <form class="kart blok" onsubmit={salonEkle}>
    <h2>Salon ekle</h2>
    <div class="izgara">
      <label>Salon adı<input bind:value={salonAd} placeholder="Moda Berber" required /></label>
      <label>Şehir<input bind:value={salonSehir} placeholder="İstanbul" required /></label>
      <label>Adres<input bind:value={salonAdres} placeholder="Moda Cad. No: 5" /></label>
    </div>
    <button class="btn" disabled={isleniyor}>Salonu kaydet</button>
  </form>

  <section class="kart blok">
    <h2>Salon seçimi</h2>
    <select bind:value={seciliSalon}>
      {#each salonlar as s (s.id)}<option value={s.id}>{s.ad} — {s.sehir}</option>{/each}
    </select>
    {#if salonlar.length === 0}<p class="bos">Önce bir salon ekleyin.</p>{/if}
  </section>

  <div class="ikili">
    <form class="kart blok" onsubmit={hizmetEkle}>
      <h2>Hizmet ekle</h2>
      <label>Ad<input bind:value={hizmetAd} placeholder="Saç Kesimi" required /></label>
      <label>Süre (dk)<input type="number" min="5" step="5" bind:value={hizmetSure} /></label>
      <label>Fiyat (₺)<input type="number" min="0" step="10" bind:value={hizmetFiyat} /></label>
      <button class="btn" disabled={isleniyor || !seciliSalon}>Hizmeti kaydet</button>
    </form>

    <form class="kart blok" onsubmit={berberEkle}>
      <h2>Berber ekle</h2>
      <label>Ad<input bind:value={berberAd} placeholder="Emre Usta" required /></label>
      <button class="btn" disabled={isleniyor || !seciliSalon}>Berberi kaydet</button>
      <button type="button" class="btn ikincil" onclick={ornekRandevu} disabled={isleniyor || !seciliSalon}>
        Örnek randevu ekle
      </button>
    </form>
  </div>
</div>

<style>
  h1 { margin: 0; font-size: 24px; }
  h2 { margin: 0; font-size: 17px; }
  .ust { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .ust p { margin: 4px 0 0; color: var(--yazi-soluk); font-size: 14px; }
  .blok { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .ozet { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .ozet .kart { padding: 12px; display: flex; flex-direction: column; gap: 4px; }
  .ozet span { font-size: 12px; color: var(--yazi-soluk); }
  .ozet b { font-size: 20px; }
  .tablo-kap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--kenar); white-space: nowrap; }
  th { font-size: 12px; color: var(--yazi-soluk); text-transform: uppercase; }
  .islem { display: flex; gap: 6px; }
  .islem button { border: 1px solid var(--kenar); background: var(--zemin); border-radius: 8px; padding: 4px 8px; font-size: 12px; }
  .rozet { padding: 2px 8px; border-radius: 999px; font-size: 12px; }
  .rozet.bekliyor { background: #fef3c7; color: #92400e; }
  .rozet.onaylandi { background: #d1fae5; color: #065f46; }
  .rozet.iptal { background: #fee2e2; color: #991b1b; }
  .izgara { display: grid; gap: 10px; }
  label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 600; }
  input, select { padding: 10px; border: 1px solid var(--kenar); border-radius: 10px; background: var(--zemin); font-weight: 400; }
  .ikili { display: grid; gap: 12px; }
  .bos { color: var(--yazi-soluk); font-size: 14px; }
  .uyari { margin: 0; padding: 10px 12px; border-radius: 10px; font-size: 14px; }
  .uyari.hata { background: #fee2e2; color: #991b1b; }
  .uyari.basari { background: #d1fae5; color: #065f46; }
  @media (min-width: 720px) {
    .ozet { grid-template-columns: repeat(4, 1fr); }
    .ikili { grid-template-columns: 1fr 1fr; }
  }
</style>
