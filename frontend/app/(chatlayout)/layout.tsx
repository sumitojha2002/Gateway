import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
