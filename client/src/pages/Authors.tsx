import React from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import type { Author } from '../types';
import { Link } from 'react-router-dom';

export default function Authors() {
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get('/authors?limit=50').then((res) => setAuthors(res.data.data || res.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <HeroSection title="المؤلفون" subtitle="تعرف على كتابنا ومبدعينا" height="h-[40vh]" />
      <section className="py-12 bg-cream-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <div className="text-center py-16 text-dark-400">جارٍ التحميل...</div> : authors.length === 0 ? (
            <div className="text-center py-16"><p className="text-dark-400 text-lg">لا يوجد مؤلفون</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authors.map((author) => (
                <Link key={author.id} to={`/authors/${author.slug}`} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-brown-100 hover:border-gold-300 flex gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-brown-100 flex-shrink-0">
                    {author.image ? <img src={author.image} alt={author.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl text-brown-400">👤</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-amiri font-bold text-dark-800 group-hover:text-gold-700 transition-colors">{author.name}</h3>
                    {author.nationality && <p className="text-xs text-dark-400">{author.nationality}</p>}
                    {author.bio && <p className="text-sm text-dark-500 mt-2 line-clamp-2">{author.bio}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
