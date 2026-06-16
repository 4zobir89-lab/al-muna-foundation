import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps { children: ReactNode; transparentNav?: boolean }

export default function Layout({ children, transparentNav }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent={transparentNav} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
