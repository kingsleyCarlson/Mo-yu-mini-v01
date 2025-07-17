import { ReactNode } from "react";
import Header from "./header";
import BottomNavigation from "./bottom-navigation";
import FloatingActionButton from "./floating-action-button";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {children}
      </main>
      <BottomNavigation />
      <FloatingActionButton />
    </div>
  );
}
