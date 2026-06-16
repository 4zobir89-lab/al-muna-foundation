import React from 'react';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import type { Text } from '../types';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function Magazine() {
  const revealRef = useReveal<HTMLDivElement>();
  const [texts, setTexts] = React.useState<Text[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get('/texts?limit=20').then((res) => {
      setTexts(res.data.texts || res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection title="مجلة المؤسسة" subtitle="إصدارات دورية ومقالات مختارة" height="h-[40vh]" />
      <section ref={revealRef} className="py-16 bg-surface-DEFAULT reveal" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-neutral-800 border-t-accent-500 rounded-full animate-spin" />
            </div>
          ) : texts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">قريباً.. إصدارات المجلة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-fade">
              {texts.map((text, i) => (
                <Link key={text.id} to={`/texts/${text.slug}`}
                  className={`group bg-surface-card border border-neutral-800 rounded-xl overflow-hidden hover:border-accent-500/30 transition-all duration-300 ${i === 0 ? 'md:col-span-2 md:grid md:grid-cols-2' : ''}`}>
                  <div className="p-6 md:p-8">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-accent-500/10 text-accent-400 mb-3">
                      {text.type === 'article' ? 'مقال' : text.type === 'poem' ? 'قصيدة' : text.type === 'story' ? 'قصة' : 'نص'}
                    </span>
                    <h3 className={`font-amiri font-bold text-neutral-50 group-hover:text-accent-500 transition-colors mb-2 ${i === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {text.title}
                    </h3>
                    {text.author_name && (
                      <p className="text-sm text-neutral-400 mb-3">{text.author_name}</p>
                    )}
                    {text.excerpt && (
                      <p className="text-sm text-neutral-300 line-clamp-3 leading-relaxed">{text.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
