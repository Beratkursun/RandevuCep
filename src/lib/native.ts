import { invoke, isTauri } from "@tauri-apps/api/core";

// @lat: [[randevular#Ortam Ayrımı]]
export function tauriMi(): boolean {
  return typeof window !== "undefined" && isTauri();
}

export async function randevuKoduAl(salonId: number): Promise<string> {
  if (tauriMi()) {
    return invoke<string>("randevu_olustur", { salonId });
  }
  return `WEB-RNV-${String(salonId).padStart(3, "0")}-${Date.now().toString(36).toUpperCase()}`;
}
