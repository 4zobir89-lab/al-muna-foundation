import React from 'react';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import type { Text, Category } from '../types';
import { Link, useSearchParams } from 'react-router-dom';

const typeLabels: Record<string, string> = {
  poem: 'شعر', story: 'قصة', article: 'مقال', novel: 'رواية', prose: 'نثر', other: 'نص',
};

export default function Archive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [texts, setTexts] = React.useState<Text[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = React.useState(searchParams.get('type') || '');
  const [categoryFilter, setCategoryFilter] = React.useState(searchParams.get('category') || '');

  React.useEffect(() => {
    api.get('/categories?limit=50').then((res) => setCategories(res.data || [])).catch(() => {});
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
      const data = res.data.texts || res.data.data || [];
      setTexts(data);
      const total = res.data.total || 0;
      setTotalPages(Math.ceil(total / 12));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page, search, typeFilter, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); };

  return (
    <>
      <HeroSection title="الأرشيف الأدبي" subtitle="استكشف مجموعة واسعة من النصوص الإبداعية المصنفة" height="h-[40vh]" />
      <section className="py-16 bg-surface-DEFAULT" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الأرشيف..." className="flex-1 bg-surface-card border border-neutral-800 rounded-lg px-4 py-3 text-neutral-50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 outline-none transition-all placeholder-neutral-600" />
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="bg-surface-card border border-neutral-800 rounded-lg px-4 py-3 text-neutral-50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 outline-none transition-all appearance-none">
              <option value="">كل الأنواع</option>
              {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="bg-surface-card border border-neutral-800 rounded-lg px-4 py-3 text-neutral-50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 outline-none transition-all appearance-none">
              <option value="">كل التصنيفات</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
            <button type="submit" className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all font-medium whitespace-nowrap">بحث</button>
          </form>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-neutral-800 border-t-accent-500 rounded-full animate-spin" />
            </div>
          ) : texts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">لا توجد نتائج</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {texts.map((text) => (
                  <Link key={text.id} to={`/texts/${text.slug}`}
                    className="group bg-surface-card border border-neutral-800 rounded-xl p-6 hover:border-accent-500/30 transition-all duration-300">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-accent-500/10 text-accent-400">
                        {typeLabels[text.type] || text.type}
                      </span>
                      {text.category_name && (
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-gold-500/10 text-gold-400">
                          {text.category_name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-amiri font-bold text-neutral-50 group-hover:text-accent-500 transition-colors mb-2">
                      {text.title}
                    </h3>
                    {text.author_name && (
                      <p className="text-sm text-neutral-400 mb-2">{text.author_name}</p>
                    )}
                    {text.excerpt && (
                      <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed">{text.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-12">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                    className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg hover:border-accent-500 hover:text-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    السابق
                  </button>
                  <span className="px-4 py-2 text-neutral-400">صفحة {page} من {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                    className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg hover:border-accent-500 hover:text-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    التالي
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
