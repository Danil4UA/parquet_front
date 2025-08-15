"use client";

import { useEffect, useState } from "react";
import { debounce } from "lodash";

export default function useIsMobileDebounce() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const debouncedCheck = debounce(checkIsMobile, 10);

    checkIsMobile();
    window.addEventListener("resize", debouncedCheck);

    return () => window.removeEventListener("resize", debouncedCheck);
  }, []);

  return { isMobile };
}