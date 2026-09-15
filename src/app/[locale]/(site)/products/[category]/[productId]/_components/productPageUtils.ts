export const CATEGORY_TITLE_KEYS: Record<string, string> = {
  Laminate: "laminate_title",
  SPC: "spc_title",
  Wood: "wood_title",
  Cladding: "cladding_title",
  Panels: "panels_title",
  Cleaning: "cleaning_title",
};

export const WASTE_RESERVE = 0.1;

export const isFlooring = (category?: string) => category !== "Cleaning";

export const roundArea = (value: number) => Math.round(value * 100) / 100;

export const boxesForArea = (area: number, boxCoverage: number) =>
  boxCoverage > 0 ? Math.ceil(area / boxCoverage) : 0;
