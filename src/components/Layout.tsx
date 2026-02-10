import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="md:ml-20 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
