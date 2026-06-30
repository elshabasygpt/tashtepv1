import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "تشطيب — متجر مواد البناء والسيراميك",
    short_name: "تشطيب",
    description: "تسوق أفضل مواد البناء والسيراميك والدهانات في مصر",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F97316",
    orientation: "portrait",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    categories: ["shopping", "lifestyle"],
    screenshots: [],
  };
}
