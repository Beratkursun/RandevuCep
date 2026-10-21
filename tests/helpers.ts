import { salonlar } from "../src/lib/data";
import type { RandevuTaslagi } from "../src/lib/types";

export const salon = salonlar[0];
export const kesim = salon.hizmetler[0];
export const sakal = salon.hizmetler[1];

export function taslak(overrides: Partial<RandevuTaslagi> = {}): RandevuTaslagi {
  return {
    id: "t1",
    salonId: salon.id,
    berberId: "emre",
    hizmetler: [kesim],
    tarih: "2026-10-22",
    saat: "10:00",
    ...overrides,
  };
}
