import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps { children?: ReactNode; transparentNav?: boolean }

export default function Layout({ children, transparentNav }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-DEFAULT text-neutral-200 selection:bg-accent-600/30 selection:text-neutral-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-accent-600 focus:text-neutral-50 focus:rounded-lg focus:outline-none">
        تخطى إلى المحتوى الرئيسي
      </a>
      <Navbar transparent={transparentNav} />
      <main id="main-content" className="flex-1">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
}
