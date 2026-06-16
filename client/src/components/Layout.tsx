import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps { children?: ReactNode; transparentNav?: boolean }

export default function Layout({ children, transparentNav }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent={transparentNav} />
      <main className="flex-1">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
}
