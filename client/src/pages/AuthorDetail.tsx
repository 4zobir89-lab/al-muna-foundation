import React from 'react';
import Loading from '../components/Loading';
import api from '../services/api';
import type { Author } from '../types';
import { useParams, Link } from 'react-router-dom';

export default function AuthorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [author, setAuthor] = React.useState<Author | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get(`/authors/${slug}`).then((res) => setAuthor(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading />;
  if (!author) return <div className="text-center py-20 text-dark-400" dir="rtl">المؤلف غير موجود</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-48 h-48 rounded-2xl overflow-hidden bg-brown-100 flex-shrink-0 mx-auto md:mx-0">
            {author.image ? <img src={author.image} alt={author.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl text-brown-400">👤</div>}
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-amiri font-bold text-dark-900 mb-4">{author.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-dark-400 mb-4">
              {author.nationality && <span>🌍 {author.nationality}</span>}
              {author.birth_date && <span>🎂 {author.birth_date}</span>}
              {author.death_date && <span>🕊 {author.death_date}</span>}
            </div>
            {author.bio && <p className="text-dark-600 leading-relaxed whitespace-pre-line">{author.bio}</p>}
          </div>
        </div>
        {author.texts && author.texts.length > 0 && (
          <div>
            <h2 className="text-2xl font-amiri font-bold text-brown-800 mb-6">نصوص {author.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {author.texts.map((text) => (
                <Link key={text.id} to={`/texts/${text.slug}`} className="p-5 bg-cream-50 rounded-xl hover:bg-gold-50 transition-all border border-brown-100 hover:border-gold-300">
                  <h3 className="font-amiri font-bold text-dark-800 hover:text-gold-700 transition-colors">{text.title}</h3>
                  <span className="text-xs text-dark-400 mt-1 inline-block">{text.type === 'poem' ? 'قصيدة' : text.type === 'story' ? 'قصة' : text.type === 'article' ? 'مقال' : text.type === 'novel' ? 'رواية' : text.type === 'prose' ? 'نثر' : 'نص'}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
