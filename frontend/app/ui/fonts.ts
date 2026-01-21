import { Lilita_One } from "next/font/google";
import { Poppins } from "next/font/google";

export const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: ["400"],

  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: [ "200", "300", "400", "500", "600", "700", "800", "900"], // Specify all weights you need
});
