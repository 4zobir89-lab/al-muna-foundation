import React from 'react';
import Loading from '../components/Loading';
import api from '../services/api';
import type { Text } from '../types';
import { useParams, Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function TextDetail() {
  const revealRef = useReveal<HTMLDivElement>();
  const { slug } = useParams<{ slug: string }>();
  const [text, setText] = React.useState<Text | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get(`/texts/${slug}`).then((res) => setText(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  React.useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => { e.preventDefault(); };
    const preventContext = (e: MouseEvent) => { e.preventDefault(); };
    const contentEl = document.getElementById('text-content');
    if (contentEl) {
      contentEl.addEventListener('copy', preventCopy);
      contentEl.addEventListener('contextmenu', preventContext);
      return () => {
        contentEl.removeEventListener('copy', preventCopy);
        contentEl.removeEventListener('contextmenu', preventContext);
      };
    }
  }, [text]);

  if (loading) return <Loading />;
  if (!text) return <div className="text-center py-20 text-neutral-400" dir="rtl">النص غير موجود</div>;

  const typeLabels: Record<string, string> = { poem: 'قصيدة', story: 'قصة', article: 'مقال', novel: 'رواية', prose: 'نثر', other: 'نص' };

  return (
    <>
      <article ref={revealRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-surface reveal" dir="rtl">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-accent-500/10 text-accent-400">{typeLabels[text.type] || text.type}</span>
            {text.category_name && <Link to={`/texts?category=${text.category_slug}`} className="inline-block px-3 py-1 text-xs rounded-full bg-gold-500/10 text-gold-400 hover:bg-gold-500/20">{text.category_name}</Link>}
          </div>
          <h1 className="text-3xl md:text-5xl font-amiri font-bold text-neutral-50 mb-4">{text.title}</h1>
          {text.author_name && (
            <Link to={`/authors/${text.author_slug}`} className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-400 transition-colors">
              <span className="text-sm">{text.author_name}</span>
            </Link>
          )}
          <div className="flex items-center gap-4 mt-4 text-xs text-neutral-400">
            <span>📅 {new Date(text.created_at).toLocaleDateString('ar-SA')}</span>
            <span>👁 {text.view_count} قراءة</span>
          </div>
        </div>
        <div id="text-content" className="relative select-none leading-relaxed text-neutral-200 font-tajawal [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-amiri [&_h2]:text-accent-400 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-amiri [&_h3]:text-accent-400" dangerouslySetInnerHTML={{ __html: text.content }} />
        <div className="text-center mt-12 pt-8 border-t border-neutral-800">
          <p className="text-xs text-neutral-600 tracking-wider">almuna.org © جميع الحقوق محفوظة</p>
        </div>
        {text.related && text.related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <h3 className="text-2xl font-amiri font-bold text-neutral-50 mb-6">نصوص ذات صلة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-fade">
              {text.related.map((r) => (
                <Link key={r.id} to={`/texts/${r.slug}`} className="bg-surface-elevated border border-neutral-800 rounded-xl p-4 hover:border-accent-500/30">
                  <h4 className="font-amiri font-bold text-neutral-50">{r.title}</h4>
                  {r.author_name && <p className="text-xs text-neutral-400 mt-1">{r.author_name}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
