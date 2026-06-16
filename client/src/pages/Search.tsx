import React from 'react';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import type { Text, Category } from '../types';
import { Link, useSearchParams } from 'react-router-dom';

const typeLabels: Record<string, string> = {
  poem: 'شعر', story: 'قصة', article: 'مقال', novel: 'رواية', prose: 'نثر', other: 'نص',
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get('q') || '');
  const [results, setResults] = React.useState<Text[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [type, setType] = React.useState(searchParams.get('type') || '');
  const [category, setCategory] = React.useState(searchParams.get('category') || '');

  React.useEffect(() => {
    api.get('/categories?limit=50').then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const params = new URLSearchParams({ q: query, limit: '50' });
    if (type) params.set('type', type);
    if (category) params.set('category', category);
    setSearchParams(params);
    api.get(`/texts?${params.toString()}`).then((res) => {
      setResults(res.data.texts || res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  return (
    <>
      <HeroSection title="البحث" subtitle="ابحث في النصوص والكتّاب والأرشيف الأدبي" height="h-[35vh]" />
      <section className="py-16 bg-surface-DEFAULT" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={doSearch} className="mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالعنوان، الكاتب، أو كلمة مفتاحية..."
                className="flex-1 bg-surface-card border border-neutral-800 rounded-lg px-4 py-3 text-neutral-50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 outline-none transition-all placeholder-neutral-600" />
              <button type="submit" className="px-8 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all font-medium">
                بحث
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="bg-surface-card border border-neutral-800 rounded-lg px-4 py-2 text-sm text-neutral-50 focus:border-accent-500 outline-none transition-all">
                <option value="">كل الأنواع</option>
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="bg-surface-card border border-neutral-800 rounded-lg px-4 py-2 text-sm text-neutral-50 focus:border-accent-500 outline-none transition-all">
                <option value="">كل التصنيفات</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-neutral-800 border-t-accent-500 rounded-full animate-spin" />
            </div>
          ) : searched ? (
            results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-neutral-400 text-lg mb-2">لا توجد نتائج لـ "{query}"</p>
                <p className="text-neutral-500 text-sm">حاول استخدام كلمات مختلفة أو تصفح التصنيفات</p>
              </div>
            ) : (
              <>
                <p className="text-neutral-400 mb-6 text-sm">
                  {results.length} نتيجة لـ "{query}"
                </p>
                <div className="space-y-4">
                  {results.map((text) => (
                    <Link key={text.id} to={`/texts/${text.slug}`}
                      className="block bg-surface-card border border-neutral-800 rounded-xl p-5 hover:border-accent-500/30 transition-all duration-300">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-accent-500/10 text-accent-400">
                          {typeLabels[text.type] || text.type}
                        </span>
                        {text.category_name && (
                          <span className="inline-block px-3 py-1 text-xs rounded-full bg-gold-500/10 text-gold-400">
                            {text.category_name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-amiri font-bold text-neutral-50 hover:text-accent-500 transition-colors mb-1">
                        {text.title}
                      </h3>
                      {text.author_name && (
                        <p className="text-sm text-neutral-400 mb-2">{text.author_name}</p>
                      )}
                      {text.excerpt && (
                        <p className="text-sm text-neutral-300 line-clamp-2">{text.excerpt}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-400">أدخل كلمة البحث للبدء</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
