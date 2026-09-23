// Hero photo of the home page when no slide is set on the admin Media page:
// our own installation (relief herringbone parquet 5007), shot on site.
export const DEFAULT_HERO_IMAGE = "https://effectparquet.s3.eu-north-1.amazonaws.com/d2943b68-d775-4dcf-a983-b034e61de521.jpg";

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
