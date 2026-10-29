// Adım 15: Tema (gece / gündüz) — seçim localStorage'da saklanır
// @lat: [[tema#Gece/Gündüz Teması]]
export type Tema = "gunduz" | "gece";

const ANAHTAR = "tema";

function ilkTema(): Tema {
  if (typeof document === "undefined") return "gunduz";
  const kayit = typeof localStorage !== "undefined" ? localStorage.getItem(ANAHTAR) : null;
  if (kayit === "gece" || kayit === "gunduz") return kayit;
  return document.documentElement.dataset.tema === "gece" ? "gece" : "gunduz";
}

class TemaYonetici {
  mod = $state<Tema>(ilkTema());

  // @lat: [[tema#Değiştirme]]
  degistir() {
    this.mod = this.mod === "gece" ? "gunduz" : "gece";
    if (typeof document !== "undefined") {
      document.documentElement.dataset.tema = this.mod;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ANAHTAR, this.mod);
    }
  }
}

export const tema = new TemaYonetici();
