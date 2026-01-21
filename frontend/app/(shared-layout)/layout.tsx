import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 bg-[]">
        {children}
      </div>
    </>
  );
}
