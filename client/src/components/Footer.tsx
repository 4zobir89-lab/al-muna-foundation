import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-card text-neutral-300" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-3xl font-amiri text-gold-500 mb-4">المنى</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              منصة ثقافية إبداعية تحتفي بالأدب والنصوص الإبداعية والشعر والقصص، وتسعى لنشر الوعي الثقافي والأدبي.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-tajawal text-gold-400 mb-4">روابط سريعة</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/texts', label: 'النصوص' },
                { href: '/authors', label: 'المؤلفون' },
                { href: '/events', label: 'الفعاليات' },
                { href: '/archive', label: 'الأرشيف' },
                { href: '/creators', label: 'المبدعون' },
                { href: '/search', label: 'البحث' },
                { href: '/about', label: 'عن المؤسسة' },
                { href: '/contact', label: 'تواصل معنا' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-neutral-400 hover:text-accent-500 transition-colors duration-200">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-tajawal text-gold-400 mb-4">معلومات الاتصال</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="text-accent-500">البريد الإلكتروني:</span>
                <span>info@al-muna.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-500">الهاتف:</span>
                <span>+966 5X XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-500">العنوان:</span>
                <span>المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-10 pt-6 text-center text-xs text-neutral-600">
          تصميم وبرمجة وسيم الزبيري
        </div>
      </div>
    </footer>
  );
}
