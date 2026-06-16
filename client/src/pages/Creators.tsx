import React from 'react';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import type { Author } from '../types';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function Creators() {
  const revealRef = useReveal<HTMLDivElement>();
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get('/authors?limit=50').then((res) => setAuthors(res.data.authors || res.data.data || res.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection title="المبدعون" subtitle="تعرف على كتابنا وأدبائنا ومبدعينا" height="h-[40vh]" />
      <section ref={revealRef} className="py-16 bg-surface-DEFAULT reveal" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-neutral-800 border-t-accent-500 rounded-full animate-spin" />
            </div>
          ) : authors.length === 0 ? (
            <div className="text-center py-20"><p className="text-neutral-400 text-lg">لا يوجد مبدعون بعد</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade">
              {authors.map((author) => (
                <Link key={author.id} to={`/creators/${author.slug}`}
                  className="group bg-surface-card border border-neutral-800 rounded-xl p-6 hover:border-accent-500/30 transition-all duration-300 flex gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-elevated flex-shrink-0 border-2 border-transparent group-hover:border-accent-500/50 transition-all">
                    {author.image ? (
                      <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-neutral-500">👤</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-amiri font-bold text-neutral-50 group-hover:text-accent-500 transition-colors">
                      {author.name}
                    </h3>
                    {author.nationality && (
                      <p className="text-xs text-neutral-500 mt-1">{author.nationality}</p>
                    )}
                    {author.bio && (
                      <p className="text-sm text-neutral-400 mt-2 line-clamp-2 leading-relaxed">{author.bio}</p>
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
