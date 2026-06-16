import React from 'react';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import api from '../services/api';
import type { Event as EventType } from '../types';
import { useParams } from 'react-router-dom';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = React.useState<EventType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get(`/events/${slug}`).then((res) => setEvent(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Layout><Loading /></Layout>;
  if (!event) return <Layout><div className="text-center py-20 text-dark-400" dir="rtl">الفعالية غير موجودة</div></Layout>;

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        {event.image && <img src={event.image} alt={event.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />}
        <h1 className="text-3xl md:text-5xl font-amiri font-bold text-dark-900 mb-4">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-dark-400 mb-6">
          <span>📅 {new Date(event.start_date).toLocaleDateString('ar-SA')}{event.end_date ? ` - ${new Date(event.end_date).toLocaleDateString('ar-SA')}` : ''}</span>
          {event.location && <span>📍 {event.location}</span>}
        </div>
        {event.description && <div className="prose prose-lg max-w-none font-noto leading-relaxed text-dark-800 whitespace-pre-line">{event.description}</div>}
      </article>
    </Layout>
  );
}
