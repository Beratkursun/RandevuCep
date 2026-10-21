// Adım 15: Tema (gece / gündüz) — seçim localStorage'da saklanır
// @lat: [[tema#Gece/Gündüz Teması]]
export type Tema = "gunduz" | "gece";

const ANAHTAR = "tema";

class TemaYonetici {
  mod = $state<Tema>(
    typeof document !== "undefined" && document.documentElement.dataset.tema === "gece"
      ? "gece"
      : "gunduz"
  );

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
