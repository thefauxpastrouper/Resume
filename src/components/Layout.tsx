import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="md:ml-20 pt-14 md:pt-0">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          {children}
        </div>
      </main>
    </div>
  );
}
