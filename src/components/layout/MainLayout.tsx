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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
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
