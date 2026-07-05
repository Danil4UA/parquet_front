// Category slots configurable from the admin Media page.
// Slugs match the catalog paths (/products/<slug>) and the keys
// stored in the site content slot "category_images".
export const CATEGORY_MEDIA_SLOTS = [
  { slug: "all", label: "Catalog (all products)" },
  { slug: "laminate", label: "Laminate" },
  { slug: "spc", label: "SPC" },
  { slug: "wood", label: "Wood" },
  { slug: "sales", label: "Sales" },
  { slug: "panels", label: "Panels" },
  { slug: "cladding", label: "Cladding" },
  { slug: "cleaning", label: "Cleaning" },
];

// Images bundled with the frontend, used when nothing is configured in the admin
export const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  all: "/assets/category_flooring_new.jpg",
  laminate: "/assets/category_laminate.jpg",
  spc: "/assets/category_spc.jpg",
  wood: "/assets/category_wood.jpg",
  sales: "/assets/category_catalog.jpg",
  panels: "/assets/category_panel.jpg",
  cladding: "/assets/category_seeling.jpg",
  cleaning: "/assets/category_catalog.jpg",
};
