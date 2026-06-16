import React from 'react';
import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Text, Author, Category, Event as EventType } from '../types';
import { useReveal } from '../hooks/useReveal';

export default function Home() {
  const revealRef = useReveal<HTMLDivElement>();
  const [featuredTexts, setFeaturedTexts] = React.useState<Text[]>([]);
  const [featuredAuthors, setFeaturedAuthors] = React.useState<Author[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState<EventType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      api.get('/texts?is_featured=1&limit=6'),
      api.get('/authors?is_featured=1&limit=4'),
      api.get('/categories?limit=6'),
      api.get('/events?limit=3'),
    ]).then(([t, a, c, e]) => {
      setFeaturedTexts(t.data.data || []);
      setFeaturedAuthors(a.data.data || a.data || []);
      setCategories(c.data.data || c.data || []);
      setUpcomingEvents(e.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const TextCard = (text: Text) => (
    <Link key={text.id} to={`/texts/${text.slug}`} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-brown-100 hover:border-gold-300 animate-slide-up">
      <span className="inline-block px-3 py-1 text-xs rounded-full bg-gold-100 text-gold-800 mb-3">{text.type === 'poem' ? 'قصيدة' : text.type === 'story' ? 'قصة' : text.type === 'article' ? 'مقال' : text.type === 'novel' ? 'رواية' : text.type === 'prose' ? 'نثر' : 'نص'}</span>
      <h3 className="text-xl font-amiri font-bold text-dark-800 group-hover:text-gold-700 transition-colors mb-2">{text.title}</h3>
      {text.author_name && <p className="text-sm text-dark-400">{text.author_name}</p>}
      {text.excerpt && <p className="text-sm text-dark-500 mt-2 line-clamp-2">{text.excerpt}</p>}
    </Link>
  );

  return (
    <div ref={revealRef} className="reveal">
      <HeroSection title="مؤسسة المنى الإبداعية" subtitle="حيث يلتقي الإبداع بالكلمة، وتنطلق الأفكار نحو آفاق جديدة" />
      <section className="py-16 bg-cream-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-amiri font-bold text-brown-800 mb-3">نصوص مميزة</h2>
            <p className="text-dark-500">مجموعة مختارة من أفضل النصوص الإبداعية</p>
          </div>
          {loading ? <div className="text-center py-10 text-dark-400">جارٍ التحميل...</div> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{featuredTexts.map(TextCard)}</div>
              <div className="text-center mt-8"><Link to="/texts" className="inline-block px-6 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium">استعرض كل النصوص</Link></div>
            </>
          )}
        </div>
      </section>
      {categories.length > 0 && (
        <section className="py-16 bg-white" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-amiri font-bold text-brown-800 mb-3">التصنيفات</h2>
              <p className="text-dark-500">استعرض النصوص حسب التصنيف</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/texts?category=${cat.slug}`} className="group p-6 bg-cream-50 rounded-xl text-center hover:bg-gold-50 hover:shadow-md transition-all border border-brown-100 hover:border-gold-300">
                  <div className="text-3xl mb-2">{cat.icon || '📖'}</div>
                  <h3 className="font-amiri font-bold text-dark-800 group-hover:text-gold-700">{cat.name}</h3>
                  {cat.text_count !== undefined && <p className="text-xs text-dark-400 mt-1">{cat.text_count} نص</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {featuredAuthors.length > 0 && (
        <section className="py-16 bg-cream-50" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-amiri font-bold text-brown-800 mb-3">المؤلفون</h2>
              <p className="text-dark-500">تعرف على كتابنا ومبدعينا</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredAuthors.map((author) => (
                <Link key={author.id} to={`/authors/${author.slug}`} className="group text-center">
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-brown-100 mb-3 border-2 border-transparent group-hover:border-gold-400 transition-all">
                    {author.image ? <img src={author.image} alt={author.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl text-brown-400">👤</div>}
                  </div>
                  <h3 className="font-amiri font-bold text-dark-800 group-hover:text-gold-700">{author.name}</h3>
                  {author.nationality && <p className="text-xs text-dark-400">{author.nationality}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-amiri font-bold text-brown-800 mb-3">الفعاليات القادمة</h2>
              <p className="text-dark-500">لا تفوّت فعالياتنا القادمة</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((ev) => (
                <Link key={ev.id} to={`/events/${ev.slug}`} className="group bg-cream-50 rounded-xl overflow-hidden hover:shadow-lg transition-all border border-brown-100">
                  {ev.image && <img src={ev.image} alt={ev.title} className="w-full h-40 object-cover" />}
                  <div className="p-5">
                    <h3 className="text-lg font-amiri font-bold text-dark-800 group-hover:text-gold-700 mb-2">{ev.title}</h3>
                    <p className="text-sm text-dark-400">{new Date(ev.start_date).toLocaleDateString('ar-SA')}</p>
                    {ev.description && <p className="text-sm text-dark-500 mt-2 line-clamp-2">{ev.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
