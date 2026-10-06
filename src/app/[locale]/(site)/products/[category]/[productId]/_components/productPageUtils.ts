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

/** Which surface of a room photo the visualizer paints for a category; null = no "see it in your room" at all. */
export type VisualizerSurface = "floor" | "wall";

export const visualizerSurface = (category?: string): VisualizerSurface | null => {
  if (category === "Cladding") return "wall";
  // Skirting boards and cleaning products have nothing to show on a room photo (the backend refuses them too).
  if (category === "Panels" || category === "Cleaning") return null;
  return "floor";
};

/** Translation key for the visualizer copy: the wall cladding variant when the product goes on a wall. */
export const visualizerKey = (category: string | undefined, key: string) =>
  visualizerSurface(category) === "wall" ? `${key}_wall` : key;

export const roundArea = (value: number) => Math.round(value * 100) / 100;

export const boxesForArea = (area: number, boxCoverage: number) =>
  boxCoverage > 0 ? Math.ceil(area / boxCoverage) : 0;
