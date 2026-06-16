import React from 'react';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import type { Text, Category, TextType } from '../types';
import { Link, useSearchParams } from 'react-router-dom';

export default function Texts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [texts, setTexts] = React.useState<Text[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = React.useState(searchParams.get('type') || '');
  const [categoryFilter, setCategoryFilter] = React.useState(searchParams.get('category') || '');

  const typeLabels: Record<TextType, string> = { poem: 'قصيدة', story: 'قصة', article: 'مقال', novel: 'رواية', prose: 'نثر', other: 'نص' };

  React.useEffect(() => {
    api.get('/categories?limit=50').then((res) => setCategories(res.data.data || res.data || [])).catch(console.error);
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '12');
    if (search) params.set('q', search);
    if (typeFilter) params.set('type', typeFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    api.get(`/texts?${params.toString()}`).then((res) => {
      setTexts(res.data.data || []);
      setTotalPages(Math.ceil((res.data.total || res.data.pagination?.total || 0) / 12));
    }).catch(console.error).finally(() => setLoading(false));
  }, [page, search, typeFilter, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); };

  return (
    <>
      <HeroSection title="النصوص" subtitle="استكشف مجموعة واسعة من النصوص الإبداعية" height="h-[40vh]" />
      <section className="py-12 bg-cream-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن نص..." className="flex-1 px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white" />
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
              <option value="">كل الأنواع</option>
              {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
              <option value="">كل التصنيفات</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
            <button type="submit" className="px-6 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium">بحث</button>
          </form>
          {loading ? <div className="text-center py-16 text-dark-400">جارٍ التحميل...</div> : texts.length === 0 ? (
            <div className="text-center py-16"><p className="text-dark-400 text-lg">لا توجد نصوص</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {texts.map((text) => (
                <Link key={text.id} to={`/texts/${text.slug}`} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-brown-100 hover:border-gold-300">
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-gold-100 text-gold-800 mb-3">{typeLabels[text.type] || text.type}</span>
                  {text.category_name && <span className="inline-block px-3 py-1 text-xs rounded-full bg-brown-100 text-brown-700 mb-3 mr-2">{text.category_name}</span>}
                  <h3 className="text-xl font-amiri font-bold text-dark-800 group-hover:text-gold-700 transition-colors mb-2">{text.title}</h3>
                  {text.author_name && <p className="text-sm text-dark-400 mb-2">{text.author_name}</p>}
                  {text.excerpt && <p className="text-sm text-dark-500 line-clamp-3">{text.excerpt}</p>}
                </Link>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-brown-200 hover:bg-brown-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">السابق</button>
              <span className="px-4 py-2 text-dark-500">صفحة {page} من {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg border border-brown-200 hover:bg-brown-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">التالي</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
