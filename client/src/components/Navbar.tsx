import React from 'react';

interface NavbarProps { transparent?: boolean }

export default function Navbar({ transparent }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bgClass = transparent && !scrolled ? 'bg-transparent' : 'bg-cream-100/95 backdrop-blur-md shadow-sm';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold font-amiri text-brown-700 group-hover:text-gold-600 transition-colors">المنى</span>
            <span className="hidden sm:inline text-sm text-dark-400">مؤسسة إبداعية</span>
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-brown-100 transition-colors" aria-label="القائمة">
            <svg className="w-6 h-6 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>
          <div className={`${open ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row absolute lg:relative top-16 left-0 right-0 lg:top-auto bg-cream-100 lg:bg-transparent lg:shadow-none shadow-lg lg:p-0 p-4 gap-1`}>
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/texts', label: 'النصوص' },
              { href: '/authors', label: 'المؤلفون' },
              { href: '/events', label: 'الفعاليات' },
              { href: '/about', label: 'عن المؤسسة' },
              { href: '/contact', label: 'تواصل معنا' },
            ].map((link) => (
              <a key={link.href} href={link.href}
                className="px-4 py-2 text-dark-600 hover:text-gold-700 hover:bg-brown-100/50 rounded-lg transition-all text-sm font-medium">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
