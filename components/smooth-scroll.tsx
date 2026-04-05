"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    // Reset scroll to top on page load (prevent browser from restoring scroll position)
    if (window.location.hash !== "#docs") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Handle anchor link smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href !== "#") {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            const navHeight = 64; // Height of navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - navHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return null;
}
