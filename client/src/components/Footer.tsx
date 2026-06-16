import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-cream-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-amiri text-gold-400 mb-4">مؤسسة المنى الإبداعية</h3>
            <p className="text-dark-200 text-sm leading-relaxed">
              منصة ثقافية إبداعية تحتفي بالأدب والنصوص الإبداعية والشعر والقصص، وتسعى لنشر الوعي الثقافي والأدبي.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-cream-100 mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/texts', label: 'النصوص' },
                { href: '/authors', label: 'المؤلفون' },
                { href: '/events', label: 'الفعاليات' },
                { href: '/about', label: 'عن المؤسسة' },
                { href: '/contact', label: 'تواصل معنا' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-dark-300 hover:text-gold-400 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-cream-100 mb-4">معلومات الاتصال</h4>
            <ul className="space-y-2 text-sm text-dark-300">
              <li>البريد الإلكتروني: info@al-muna.com</li>
              <li>الهاتف: +966 5X XXX XXXX</li>
              <li>العنوان: المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-6 text-center text-xs text-dark-400">
          تصميم وبرمجة وسيم الزبيري
        </div>
      </div>
    </footer>
  );
}
