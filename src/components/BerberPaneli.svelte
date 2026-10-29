<script lang="ts">
  import { onMount } from "svelte";
  import { saatler, tl } from "$lib/data";
  import {
    bosSaatler,
    durumEtiketi,
    kazancOzeti,
    sonYediGun,
    tariheGoreSirala,
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
    kapaliSlotlar,
    slotAc,
    slotKapat,
    yonetimSalonlari,
  } from "$lib/native";

  type Sekme = "ozet" | "randevular" | "musaitlik" | "kazanc";

  let salonlar = $state<YonetimSalonu[]>([]);
  let seciliSalon = $state(0);
  let ad = $state("");
  let pin = $state("");
  let oturum = $state<BerberOturumu | null>(null);
  let randevular = $state<YonetimRandevusu[]>([]);
  let kapali = $state<string[]>([]);
  let yukleniyor = $state(true);
  let isleniyor = $state(false);
  let hata = $state("");
  let sekme = $state<Sekme>("ozet");
  let tarih = $state(new Date().toISOString().slice(0, 10));
  let filtre = $state<"bugun" | "yaklasan" | "tumu">("bugun");

  const bugun = new Date().toISOString().slice(0, 10);

  const ozet = $derived(kazancOzeti(randevular, bugun));
  const bekleyen = $derived(randevular.filter((r) => r.durum === "bekliyor").length);
  const onayli = $derived(randevular.filter((r) => r.durum === "onaylandi").length);
  const bugunku = $derived(tariheGoreSirala(randevular.filter((r) => r.tarih === bugun)));
  const sirali = $derived(tariheGoreSirala(randevular));
  const sonraki = $derived(sirali.find((r) => r.tarih >= bugun && r.durum !== "iptal"));
  const bos = $derived(bosSaatler(kapali, saatler));
  const enYuksek = $derived(Math.max(1, ...ozet.gunluk.map((g) => g.tutar)));
  const basHarfler = $derived(
    oturum
      ? oturum.ad.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toLocaleUpperCase("tr")
      : "",
  );
  const haftaRandevu = $derived(
    randevular.filter((r) => r.tarih >= sonYediGun(bugun)[0] && r.tarih <= bugun && r.durum !== "iptal").length,
  );
  const doluluk = $derived(Math.min(100, Math.round((haftaRandevu / (7 * saatler.length)) * 100)));

  const gosterilecek = $derived(
    filtre === "bugun"
      ? bugunku
      : filtre === "yaklasan"
        ? sirali.filter((r) => r.tarih >= bugun)
        : [...randevular],
  );

  function hataMetni(e: unknown): string {
    return e instanceof Error ? e.message : String(e);
  }

  async function randevulariGetir(berberId: number) {
    randevular = await berberRandevulari(berberId);
  }

  async function musaitlikYukle(berberId?: number) {
    const id = berberId ?? oturum?.id;
    if (!id) return;
    kapali = await kapaliSlotlar(id, tarih);
  }

  async function giris(event: SubmitEvent) {
    event.preventDefault();
    isleniyor = true;
    hata = "";
    try {
      oturum = await berberGiris(seciliSalon, ad, pin);
      await randevulariGetir(oturum.id);
      await musaitlikYukle(oturum.id);
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

  async function slotDegistir(saat: string) {
    if (!oturum) return;
    try {
      if (kapali.includes(saat)) await slotAc(oturum.id, tarih, saat);
      else await slotKapat(oturum.id, tarih, saat);
      await musaitlikYukle(oturum.id);
    } catch (e) {
      hata = hataMetni(e);
    }
  }

  function cikis() {
    berberCikis();
    oturum = null;
    randevular = [];
    kapali = [];
    ad = "";
    pin = "";
    hata = "";
    sekme = "ozet";
  }

  onMount(async () => {
    try {
      salonlar = await yonetimSalonlari();
      if (salonlar.length > 0) seciliSalon = salonlar[0].id;
      oturum = berberOturumu();
      if (oturum) {
        await randevulariGetir(oturum.id);
        await musaitlikYukle(oturum.id);
      }
    } catch (e) {
      hata = hataMetni(e);
    } finally {
      yukleniyor = false;
    }
  });
</script>

<div class="sayfa">
  {#if hata}<p class="uyari">{hata}</p>{/if}

  {#if yukleniyor}
    <p class="bos">Yükleniyor…</p>
  {:else if !oturum}
    <h1>Berber Girişi</h1>
    <form class="kart giris" onsubmit={giris}>
      <p class="aciklama">Salonunuzu seçin, adınızı ve 4 haneli PIN'inizi girin. PIN'i salon yöneticisi verir.</p>
      <p class="demo">Demo hesap: <b>Emre Usta</b> · PIN <b>1234</b></p>
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
    <header class="ust">
      <div class="kimlik">
        <div class="avatar">{basHarfler}</div>
        <div>
          <h1>{oturum.ad}</h1>
          <p>{oturum.salonAd}</p>
        </div>
      </div>
      <button class="btn ikincil" onclick={cikis}>Çıkış</button>
    </header>

    <p class="doluluk">Bu hafta doluluk: <b>%{doluluk}</b> · {haftaRandevu} randevu</p>

    <section class="kartlar">
      <div class="kart"><span>Bugünkü randevu</span><b>{bugunku.length}</b></div>
      <div class="kart"><span>Bekleyen</span><b>{bekleyen}</b></div>
      <div class="kart"><span>Onaylı</span><b>{onayli}</b></div>
      <div class="kart vurgu"><span>Bugünkü kazanç</span><b>{tl(ozet.bugun)}</b></div>
    </section>

    {#if sonraki}
      <div class="kart sonraki">
        <span class="etiket">Sıradaki randevu</span>
        <strong>{sonraki.hizmet}</strong>
        <p>{sonraki.tarih} · {sonraki.saat} · {sonraki.kod}</p>
      </div>
    {/if}

    <nav class="sekme">
      <button class:aktif={sekme === "ozet"} onclick={() => (sekme = "ozet")}>Özet</button>
      <button class:aktif={sekme === "randevular"} onclick={() => (sekme = "randevular")}>Randevular</button>
      <button class:aktif={sekme === "musaitlik"} onclick={() => (sekme = "musaitlik")}>Müsaitlik</button>
      <button class:aktif={sekme === "kazanc"} onclick={() => (sekme = "kazanc")}>Kazanç</button>
    </nav>

    {#if sekme === "ozet"}
      <section class="kart blok">
        <h2>Bugünün programı</h2>
        {#if bugunku.length === 0}
          <p class="bos">Bugün randevu yok. Boş saatleriniz: {bos.length} / {saatler.length}.</p>
        {:else}
          {#each bugunku as r (r.id)}
            <div class="satir">
              <span class="saat">{r.saat}</span>
              <div class="bilgi">
                <strong>{r.hizmet}</strong>
                <p>{r.kod}</p>
              </div>
              <span class="rozet {r.durum}">{durumEtiketi(r.durum)}</span>
            </div>
          {/each}
        {/if}
      </section>
    {:else if sekme === "randevular"}
      <section class="kart blok">
        <div class="filtre">
          <button class:aktif={filtre === "bugun"} onclick={() => (filtre = "bugun")}>Bugün</button>
          <button class:aktif={filtre === "yaklasan"} onclick={() => (filtre = "yaklasan")}>Yaklaşan</button>
          <button class:aktif={filtre === "tumu"} onclick={() => (filtre = "tumu")}>Tümü</button>
        </div>
        {#if gosterilecek.length === 0}
          <p class="bos">Bu filtrede randevu yok.</p>
        {:else}
          {#each gosterilecek as r (r.id)}
            <div class="satir">
              <span class="saat">{r.tarih.slice(5)}<br />{r.saat}</span>
              <div class="bilgi">
                <strong>{r.hizmet}</strong>
                <p>{r.kod} · {tl(r.tutar)}</p>
              </div>
              <div class="islem">
                <span class="rozet {r.durum}">{durumEtiketi(r.durum)}</span>
                <button onclick={() => durumDegistir(r.id, "onaylandi")} disabled={isleniyor || r.durum === "onaylandi"}>Onayla</button>
                <button onclick={() => durumDegistir(r.id, "iptal")} disabled={isleniyor || r.durum === "iptal"}>İptal</button>
              </div>
            </div>
          {/each}
        {/if}
      </section>
    {:else if sekme === "musaitlik"}
      <section class="kart blok">
        <h2>Boş saatler</h2>
        <label>Tarih<input type="date" bind:value={tarih} onchange={() => musaitlikYukle()} /></label>
        <p class="aciklama">{tarih} için {bos.length} saat müsait. Kapatmak için saate dokunun.</p>
        <div class="slotlar">
          {#each saatler as s (s)}
            <button class:kapali={kapali.includes(s)} onclick={() => slotDegistir(s)}>{s}</button>
          {/each}
        </div>
        <div class="lejant">
          <span><i class="kutu müsait"></i> Müsait</span>
          <span><i class="kutu kapali"></i> Kapalı</span>
        </div>
        {#if bos.length > 0}
          <p class="aciklama">İlk boş saatler: {bos.slice(0, 3).join(", ")}</p>
        {/if}
      </section>
    {:else}
      <section class="kart blok">
        <h2>Kazanç</h2>
        <div class="kartlar uc">
          <div class="kart"><span>Bugün</span><b>{tl(ozet.bugun)}</b></div>
          <div class="kart"><span>Son 7 gün</span><b>{tl(ozet.hafta)}</b></div>
          <div class="kart"><span>Bu ay</span><b>{tl(ozet.ay)}</b></div>
        </div>
        <div class="grafik">
          {#each ozet.gunluk as g (g.gun)}
            <div class="cubuk">
              <div class="deger" style:height={`${Math.round((g.tutar / enYuksek) * 100)}%`} title={tl(g.tutar)}></div>
              <span>{g.gun.slice(8)}</span>
            </div>
          {/each}
        </div>
        <p class="aciklama">Yalnızca onaylı randevular sayılır; iptaller kazanca eklenmez.</p>
      </section>
    {/if}
  {/if}
</div>

<style>
  h1 { margin: 0; font-size: 24px; }
  h2 { margin: 0; font-size: 17px; }
  .ust { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .ust .btn { width: auto; flex: 0 0 auto; padding: 10px 16px; }
  .kimlik h1 { font-size: 21px; }
  .ust p { margin: 4px 0 0; color: var(--yazi-soluk); font-size: 14px; }
  .giris { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .aciklama { margin: 0; color: var(--yazi-soluk); font-size: 13px; }
  .demo { margin: 0; font-size: 12px; color: var(--yazi-soluk); background: var(--zemin); padding: 6px 8px; border-radius: 8px; }
  label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 600; }
  input, select { padding: 10px; border: 1px solid var(--kenar); border-radius: 10px; background: var(--zemin); font-weight: 400; }
  .kartlar { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .kartlar.uc { grid-template-columns: repeat(3, 1fr); }
  .kartlar .kart { padding: 12px; display: flex; flex-direction: column; gap: 4px; }
  .kartlar span { font-size: 12px; color: var(--yazi-soluk); }
  .kartlar b { font-size: 19px; }
  .vurgu { border-color: var(--renk-ana); }
  .sonraki { padding: 14px; display: flex; flex-direction: column; gap: 4px; border-left: 5px solid var(--renk-ana); }
  .sonraki .etiket { font-size: 12px; color: var(--renk-ana); font-weight: 700; }
  .sonraki p { margin: 0; color: var(--yazi-soluk); font-size: 14px; }
  .sekme { display: flex; gap: 6px; overflow-x: auto; }
  .sekme button, .filtre button { flex: 0 0 auto; padding: 8px 14px; border: 1px solid var(--kenar); border-radius: 999px; background: var(--kart); font-size: 13px; color: var(--yazi-soluk); }
  .sekme button.aktif, .filtre button.aktif { background: var(--renk-ana); border-color: var(--renk-ana); color: #fff; font-weight: 600; }
  .blok { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
  .filtre { display: flex; gap: 6px; }
  .satir { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--kenar); }
  .satir:last-child { border-bottom: 0; }
  .saat { font-weight: 700; font-size: 14px; color: var(--renk-ana); min-width: 46px; }
  .bilgi { flex: 1; }
  .bilgi p { margin: 2px 0 0; font-size: 12px; color: var(--yazi-soluk); }
  .islem { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .islem button { border: 1px solid var(--kenar); background: var(--zemin); border-radius: 8px; padding: 4px 8px; font-size: 12px; }
  .rozet { padding: 2px 8px; border-radius: 999px; font-size: 12px; white-space: nowrap; }
  .rozet.bekliyor { background: #fef3c7; color: #92400e; }
  .rozet.onaylandi { background: #d1fae5; color: #065f46; }
  .rozet.iptal { background: #fee2e2; color: #991b1b; }
  .slotlar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .slotlar button { padding: 9px 0; border: 1px solid var(--kenar); border-radius: 8px; background: var(--zemin); font-size: 13px; }
  .slotlar button.kapali { background: #fee2e2; color: #991b1b; border-color: #fca5a5; text-decoration: line-through; }
  .lejant { display: flex; gap: 14px; font-size: 12px; color: var(--yazi-soluk); }
  .lejant span { display: inline-flex; align-items: center; gap: 6px; }
  .kutu { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
  .kutu.müsait { background: var(--zemin); border: 1px solid var(--kenar); }
  .kutu.kapali { background: #fee2e2; border: 1px solid #fca5a5; }
  .grafik { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding-top: 8px; }
  .cubuk { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; height: 100%; }
  .cubuk .deger { width: 100%; min-height: 2px; background: var(--renk-ana); border-radius: 4px 4px 0 0; }
  .cubuk span { font-size: 11px; color: var(--yazi-soluk); }
  .bos { color: var(--yazi-soluk); font-size: 14px; }
  .uyari { margin: 0; padding: 10px 12px; border-radius: 10px; background: #fee2e2; color: #991b1b; font-size: 14px; }
  .kimlik { display: flex; align-items: center; gap: 12px; }
  .avatar { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, var(--renk-ana), #7a0016); color: #fff; font-weight: 800; font-size: 16px; letter-spacing: 0.5px; }
  .doluluk { margin: 0; font-size: 13px; color: var(--yazi-soluk); }
  .doluluk b { color: var(--yazi); }
</style>
