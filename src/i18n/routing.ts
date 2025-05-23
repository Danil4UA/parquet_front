import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ru", "he"],
  defaultLocale: "he"
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
