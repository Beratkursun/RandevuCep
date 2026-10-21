// Adım 12: Satın alınan biletler — Rust'tan kod alır, localStorage'a kaydeder
import { invoke, isTauri } from "@tauri-apps/api/core";
import type { SepetKalemi } from "./sepet.svelte";

// @lat: [[biletler#Bilet Üretimi]]
export interface Bilet {
  kod: string;
  baslik: string;
  tarih: string;
  mekan: string;
  kategori: string;
  adet: number;
}

const ANAHTAR = "biletlerim";

// @lat: [[biletler#Kalıcılık]]
function yukle(): Bilet[] {
  try {
    if (typeof localStorage === "undefined") return [];
    return JSON.parse(localStorage.getItem(ANAHTAR) ?? "[]");
  } catch {
    return [];
  }
}

// Tauri içinde çalışıyorsak Rust komutunu çağır, tarayıcıda ise JS ile üret
// @lat: [[biletler#Ortam Ayrımı]]
async function biletKoduAl(etkinlikId: number): Promise<string> {
  if (typeof window !== "undefined" && isTauri()) {
    // Rust tarafındaki etkinlik_id parametresi JS'te camelCase yazılır: etkinlikId
    return invoke<string>("bilet_olustur", { etkinlikId });
  }
  return `WEB-${etkinlikId}-${Date.now().toString(36).toUpperCase()}`;
}

class Biletlerim {
  liste = $state<Bilet[]>(yukle());

  // @lat: [[biletler#Satın Alma Akışı]]
  async satinAl(kalemler: SepetKalemi[]) {
    for (const k of kalemler) {
      const kod = await biletKoduAl(k.etkinlik.id);
      this.liste.unshift({
        kod,
        baslik: k.etkinlik.baslik,
        tarih: k.etkinlik.tarih,
        mekan: k.etkinlik.mekan,
        kategori: k.bilet.ad,
        adet: k.adet,
      });
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ANAHTAR, JSON.stringify(this.liste));
    }
  }
}

export const biletlerim = new Biletlerim();
