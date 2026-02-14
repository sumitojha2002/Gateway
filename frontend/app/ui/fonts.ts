import { Lilita_One, Poppins } from "next/font/google";

export const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
  variable: "--font-lilita",
  fallback: ["cursive"],
  adjustFontFallback: true,
});

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "600"], // Normal + semibold covers 80% of use cases
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
});
