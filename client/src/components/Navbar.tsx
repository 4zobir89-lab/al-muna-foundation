import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps { transparent?: boolean }

export default function Navbar({ transparent }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bgClass = transparent && !scrolled
    ? 'bg-transparent'
    : 'bg-surface-DEFAULT/90 backdrop-blur-xl shadow-lg shadow-black/20';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/" className="flex items-center gap-3 group">
            <span className="text-3xl font-bold font-amiri text-gold-500 group-hover:text-gold-400 transition-colors drop-shadow-sm">المنى</span>
            <span className="hidden sm:inline text-sm text-neutral-400">مؤسسة إبداعية</span>
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors" aria-label="القائمة">
            <svg className="w-6 h-6 text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>
          <div className={`${open ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row absolute lg:relative top-16 lg:top-auto left-0 right-0 bg-surface-card/95 lg:bg-transparent backdrop-blur-xl shadow-xl lg:shadow-none lg:p-0 p-4 gap-1 border-b border-neutral-800 lg:border-0`}>
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/archive', label: 'الأرشيف' },
              { href: '/creators', label: 'المبدعون' },
              { href: '/events', label: 'الفعاليات' },
              { href: '/about', label: 'عن المؤسسة' },
              { href: '/contact', label: 'تواصل معنا' },
            ].map((link) => (
              <a key={link.href} href={link.href}
                className="px-4 py-2.5 text-neutral-300 hover:text-accent-500 hover:bg-surface-hover/60 rounded-lg transition-all text-sm font-tajawal font-medium">
                {link.label}
              </a>
            ))}
          </div>
          <button onClick={toggleTheme} className="hidden lg:block mr-4 p-2.5 rounded-lg border border-neutral-700/50 hover:border-accent-500/50 text-neutral-400 hover:text-accent-500 transition-all" aria-label="تبديل الثيم">
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
