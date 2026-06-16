import React from 'react';
import Loading from '../components/Loading';
import api from '../services/api';
import type { Text } from '../types';
import { useParams, Link } from 'react-router-dom';

export default function TextDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [text, setText] = React.useState<Text | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get(`/texts/${slug}`).then((res) => setText(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading />;
  if (!text) return <div className="text-center py-20 text-dark-400" dir="rtl">النص غير موجود</div>;

  const typeLabels: Record<string, string> = { poem: 'قصيدة', story: 'قصة', article: 'مقال', novel: 'رواية', prose: 'نثر', other: 'نص' };

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 text-xs rounded-full bg-gold-100 text-gold-800">{typeLabels[text.type] || text.type}</span>
            {text.category_name && <Link to={`/texts?category=${text.category_slug}`} className="px-3 py-1 text-xs rounded-full bg-brown-100 text-brown-700 hover:bg-brown-200 transition-colors">{text.category_name}</Link>}
          </div>
          <h1 className="text-3xl md:text-5xl font-amiri font-bold text-dark-900 mb-4">{text.title}</h1>
          {text.author_name && (
            <Link to={`/authors/${text.author_slug}`} className="inline-flex items-center gap-2 text-gold-700 hover:text-gold-800 transition-colors">
              <span className="text-sm">{text.author_name}</span>
            </Link>
          )}
          <div className="flex items-center gap-4 mt-4 text-xs text-dark-400">
            <span>📅 {new Date(text.created_at).toLocaleDateString('ar-SA')}</span>
            <span>👁 {text.view_count} قراءة</span>
          </div>
        </div>
        <div className="prose prose-lg max-w-none font-noto leading-relaxed text-dark-800 [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-amiri [&_h2]:text-brown-800 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-amiri [&_h3]:text-brown-700" dangerouslySetInnerHTML={{ __html: text.content }} />
        {text.related && text.related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-brown-200">
            <h3 className="text-2xl font-amiri font-bold text-brown-800 mb-6">نصوص ذات صلة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {text.related.map((r) => (
                <Link key={r.id} to={`/texts/${r.slug}`} className="p-4 bg-cream-50 rounded-lg hover:bg-gold-50 transition-colors border border-brown-100">
                  <h4 className="font-amiri font-bold text-dark-800">{r.title}</h4>
                  {r.author_name && <p className="text-xs text-dark-400 mt-1">{r.author_name}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
