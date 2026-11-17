import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header, { type CurrentUser } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children?: ReactNode;
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
  currentUser?: CurrentUser | null;
}

export default function MainLayout({
  children,
  currentPage,
  setCurrentPage,
  currentUser,
}: MainLayoutProps = {}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/70 via-white to-white text-slate-800 font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
